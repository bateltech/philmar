import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateMessageDto } from './dto/create-message.dto';

const MESSAGES_TABLE = 'contact_messages';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const BREVO_SEND_URL = 'https://api.brevo.com/v3/smtp/email';

// Un humain met plus de 3 s à remplir le formulaire
const MIN_FILL_TIME_MS = 3000;
const MAX_LINKS = 3;

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private supabaseService: SupabaseService,
    private configService: ConfigService,
  ) {}

  /** Traite un envoi du formulaire public. */
  async submit(dto: CreateMessageDto, ip?: string): Promise<void> {
    // Champ piège rempli ou envoi trop rapide → robot. On répond "OK" sans rien faire
    // pour ne pas lui indiquer qu'il a été détecté.
    if (dto.website || dto.elapsedMs < MIN_FILL_TIME_MS) {
      this.logger.warn(`Spam ignoré (honeypot/timing) depuis ${ip ?? 'IP inconnue'}`);
      return;
    }

    const links = dto.message.match(/https?:\/\/|www\./gi)?.length ?? 0;
    if (links > MAX_LINKS) {
      throw new BadRequestException('Votre message contient trop de liens.');
    }

    await this.verifyTurnstile(dto.turnstileToken, ip);

    const { data, error } = await this.supabaseService
      .getClient()
      .from(MESSAGES_TABLE)
      .insert({ name: dto.name, email: dto.email, message: dto.message })
      .select()
      .single();

    if (error) {
      this.logger.error(`Enregistrement du message impossible : ${error.message}`);
      throw new ServiceUnavailableException("Le message n'a pas pu être envoyé. Réessayez plus tard.");
    }

    // Le message est déjà enregistré : un échec d'email ne doit pas faire échouer l'envoi
    await this.sendNotification(data as ContactMessage).catch((err) =>
      this.logger.error(`Email de notification non envoyé : ${err.message}`),
    );
  }

  private async verifyTurnstile(token: string, ip?: string): Promise<void> {
    const secret = this.configService.get<string>('contact.turnstileSecretKey');
    if (!secret) {
      this.logger.error('TURNSTILE_SECRET_KEY manquant : formulaire de contact bloqué.');
      throw new ServiceUnavailableException("Le formulaire est momentanément indisponible.");
    }

    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.append('remoteip', ip);

    const res = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body }).catch(() => null);
    const result = res ? ((await res.json().catch(() => null)) as { success?: boolean } | null) : null;

    if (!result?.success) {
      throw new BadRequestException('La vérification anti-robot a échoué. Rechargez la page et réessayez.');
    }
  }

  private async sendNotification(msg: ContactMessage): Promise<void> {
    const apiKey = this.configService.get<string>('contact.brevoApiKey');
    const sender = this.configService.get<string>('contact.senderEmail');
    const recipient = this.configService.get<string>('contact.recipientEmail');

    if (!apiKey || !sender || !recipient) {
      this.logger.warn('Brevo non configuré : message enregistré sans email de notification.');
      return;
    }

    const date = new Date(msg.created_at).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
    const html =
      `<p><strong>Nouveau message reçu via le site</strong> le ${date}</p>` +
      `<p><strong>De :</strong> ${escapeHtml(msg.name)} &lt;${escapeHtml(msg.email)}&gt;</p>` +
      `<p style="white-space:pre-wrap">${escapeHtml(msg.message)}</p>` +
      `<hr><p style="color:#888;font-size:12px">Répondez directement à cet email pour écrire à l'expéditeur.</p>`;

    const res = await fetch(BREVO_SEND_URL, {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Site Philmar', email: sender },
        to: [{ email: recipient }],
        replyTo: { email: msg.email, name: msg.name },
        subject: `Nouveau message de ${msg.name}`,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      throw new Error(`Brevo ${res.status} ${await res.text().catch(() => '')}`);
    }
  }

  // ---------- Admin ----------

  async list(): Promise<ContactMessage[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(MESSAGES_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(`Lecture des messages impossible : ${error.message}`);
    }
    return data as ContactMessage[];
  }

  async setRead(id: string, read: boolean): Promise<ContactMessage> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(MESSAGES_TABLE)
      .update({ read })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw new BadRequestException(error.message);
    if (!data) throw new NotFoundException('Message introuvable');
    return data as ContactMessage;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabaseService.getClient().from(MESSAGES_TABLE).delete().eq('id', id);
    if (error) throw new BadRequestException(error.message);
  }
}
