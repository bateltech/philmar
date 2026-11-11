import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ContentService, ContentType } from './content.service';

export const BACKUP_FORMAT = 'philmar-backup';
const BACKUP_VERSION = 1;

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  version: number;
  exportedAt: string;
  content: Record<string, { data: unknown; updated_at: string | null }>;
  messages: unknown[];
}

@Injectable()
export class BackupService {
  constructor(
    private supabaseService: SupabaseService,
    private contentService: ContentService,
  ) {}

  async exportBackup(): Promise<BackupFile> {
    const client = this.supabaseService.getClient();
    const [contentRes, messagesRes] = await Promise.all([
      client.from('content').select('type, data, updated_at').order('type'),
      client.from('contact_messages').select('*').order('created_at', { ascending: false }),
    ]);

    if (contentRes.error) {
      throw new BadRequestException(`Lecture du contenu impossible : ${contentRes.error.message}`);
    }
    if (messagesRes.error) {
      throw new BadRequestException(`Lecture des messages impossible : ${messagesRes.error.message}`);
    }

    const valid = this.contentService.getValidContentTypes();
    const content: BackupFile['content'] = {};
    for (const row of contentRes.data ?? []) {
      if (valid.includes(row.type as ContentType)) {
        content[row.type] = { data: row.data, updated_at: row.updated_at ?? null };
      }
    }

    return {
      format: BACKUP_FORMAT,
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      content,
      messages: messagesRes.data ?? [],
    };
  }

  /**
   * Restaure le contenu du site depuis une sauvegarde. Les messages reçus ne sont
   * pas touchés (ni supprimés, ni réimportés) pour ne pas créer de doublons.
   */
  async restoreContent(backup: unknown): Promise<{ restored: string[] }> {
    if (!backup || typeof backup !== 'object') {
      throw new BadRequestException('Fichier de sauvegarde invalide.');
    }
    const file = backup as Partial<BackupFile>;
    if (file.format !== BACKUP_FORMAT || !file.content || typeof file.content !== 'object') {
      throw new BadRequestException("Ce fichier n'est pas une sauvegarde de l'admin Philmar.");
    }

    const valid = this.contentService.getValidContentTypes();
    const entries = Object.entries(file.content).filter(
      ([type, entry]) =>
        valid.includes(type as ContentType) &&
        !!entry &&
        typeof entry === 'object' &&
        'data' in entry &&
        entry.data !== undefined &&
        entry.data !== null,
    );

    if (entries.length === 0) {
      throw new BadRequestException('La sauvegarde ne contient aucun contenu à restaurer.');
    }

    for (const [type, entry] of entries) {
      await this.contentService.updateContent(type as ContentType, entry.data);
    }

    return { restored: entries.map(([type]) => type) };
  }
}
