import { createHmac } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Reçoit les pages vues du site public et les transmet au backend.
 *
 * Aucune donnée personnelle n'est conservée : l'adresse IP sert seulement à calculer
 * une empreinte brouillée qui change chaque jour (on ne peut ni retrouver l'IP,
 * ni suivre un visiteur d'un jour à l'autre). Le pays vient de Vercel.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const SECRET = process.env.STATS_INGEST_SECRET;

const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pingdom|uptimerobot|monitor|curl|wget|python|axios|node-fetch|go-http/i;

const deviceOf = (ua: string) =>
  /ipad|tablet|kindle|silk|(android(?!.*mobile))/i.test(ua) ? 'tablet' : /mobi|iphone|ipod|android/i.test(ua) ? 'mobile' : 'desktop';

const parisDay = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' });

/** Garde seulement le nom du site d'origine (« www.google.com/… » → « google.com »). */
const referrerHost = (value: unknown, ownHost: string) => {
  if (typeof value !== 'string' || !value) return undefined;
  try {
    const host = new URL(value).hostname.replace(/^www\./, '').toLowerCase();
    if (!host || host === ownHost.replace(/^www\./, '')) return undefined;
    return host.slice(0, 100);
  } catch {
    return undefined;
  }
};

export async function POST(request: NextRequest) {
  const noContent = new NextResponse(null, { status: 204 });
  // En local, la base Supabase est la même qu'en ligne : on ne compte pas les visites de développement
  // (sauf STATS_TRACK_DEV=true dans .env.local, pour tester)
  if (!SECRET || (process.env.NODE_ENV !== 'production' && process.env.STATS_TRACK_DEV !== 'true')) return noContent;

  const ua = request.headers.get('user-agent') || '';
  const host = (request.headers.get('host') || '').split(':')[0].toLowerCase();
  if (!ua || BOT_UA.test(ua) || host.startsWith('admin.')) return noContent;

  let body: { path?: unknown; referrer?: unknown };
  try {
    body = await request.json();
  } catch {
    return noContent;
  }
  const path = typeof body.path === 'string' ? body.path.split('?')[0].slice(0, 200) : '';
  if (!path.startsWith('/') || path.startsWith('/admin')) return noContent;

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || request.ip || '';
  const day = parisDay();
  const visitor = createHmac('sha256', `${SECRET}:${day}`).update(`${ip}|${ua}`).digest('hex').slice(0, 16);
  const country = (request.headers.get('x-vercel-ip-country') || '').toUpperCase();

  try {
    await fetch(`${API_URL}/stats/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-stats-secret': SECRET },
      body: JSON.stringify({
        path,
        referrer: referrerHost(body.referrer, host),
        country: /^[A-Z]{2}$/.test(country) ? country : undefined,
        device: deviceOf(ua),
        visitor,
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    // Une statistique perdue n'est pas grave : on ne bloque jamais le visiteur
  }
  return noContent;
}
