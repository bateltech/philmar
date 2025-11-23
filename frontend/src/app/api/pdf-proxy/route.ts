import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy minimaliste pour servir des PDF dans un <iframe> même si la source envoie
 * des en-têtes X-Frame-Options / CSP bloquants côté tiers.
 *
 * ⚠️ Sécurité:
 * - On n'autorise que http(s).
 * - On limite aux fichiers dont le content-type contient "pdf".
 * - On supprime/écrase les en-têtes qui empêchent l'embed.
 * - On forward en stream pour de gros PDF.
 *
 * Utilisation: /api/pdf-proxy?url=https%3A%2F%2F…%2Ffichier.pdf
 */


export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sanitizeUrl(u: string): string { return u; }

function filenameFromUrl(u: string) {
  try {
    const { pathname } = new URL(u);
    const base = pathname.split('/').pop() || 'document.pdf';
    return base.endsWith('.pdf') ? base : `${base}.pdf`;
  } catch {
    return 'document.pdf';
  }
}

async function peekFirstBytes(stream: ReadableStream, n = 8) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < n) {
    const { value, done } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.byteLength;
    if (total >= n) break;
  }
  const prefix = chunks.length ? new Uint8Array(chunks.reduce((a, b) => a + b.byteLength, 0)) : new Uint8Array();
  if (chunks.length) {
    let off = 0;
    for (const c of chunks) { prefix.set(c, off); off += c.byteLength; }
  }
  const rest = new ReadableStream({
    start(controller) {
      if (prefix.byteLength) controller.enqueue(prefix);
      const pump = async () => {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      };
      pump();
    },
  });

  return { firstBytes: prefix, rebuilt: rest };
}

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get('url');
  if (!urlParam) return new Response('Missing url', { status: 400 });

  let target: string;
  try {
    target = new URL(urlParam, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost').toString();
    target = sanitizeUrl(target);
  } catch {
    return new Response('Invalid url', { status: 400 });
  }

  const range = req.headers.get('range') || undefined;

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        ...(range ? { Range: range } : {}),
        'User-Agent': 'Mozilla/5.0 (compatible; BashroomPDFProxy/1.2)',
        Accept: 'application/pdf,*/*',
      },
    });
  } catch {
    return new Response('Proxy fetch failed', { status: 502 });
  }

  if (!upstream.ok && upstream.status !== 206) {
    return new Response(`Upstream error ${upstream.status}`, { status: 502 });
  }

  const headers = new Headers(upstream.headers);

  
  headers.set('Content-Type', 'application/pdf');

  // Supprimer les trucs qui bloquent l'iframe
  headers.delete('X-Frame-Options');
  headers.delete('Content-Security-Policy');
  headers.delete('Content-Encoding');
  headers.delete('X-Content-Type-Options');

  headers.set('Content-Type', 'application/pdf');

  // Très important : ne pas forcer le téléchargement
  headers.delete('content-disposition');

  // headers.set('Content-Disposition', `inline; filename="${filenameFromUrl(target).replace(/"/g, '')}"`);
  
  if (!headers.has('Accept-Ranges')) headers.set('Accept-Ranges', 'bytes');

  let body = upstream.body as unknown as ReadableStream<Uint8Array> | null;
  if (!body) return new Response('Empty body', { status: 502 });

  const { firstBytes, rebuilt } = await peekFirstBytes(body, 8);
  body = rebuilt;

  const isPdf = firstBytes && new TextDecoder().decode(firstBytes.slice(0, 5)) === '%PDF-';
  if (!isPdf) {
    return new Response('Upstream did not return a PDF (got non-PDF bytes)', {
      status: 415,
      headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }),
    });
  }

  const status = upstream.status === 206 ? 206 : 200;
  headers.set('Cache-Control', 'no-store');

  return new Response(body, { status, headers });
}
