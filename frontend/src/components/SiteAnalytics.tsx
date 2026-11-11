'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';

const isAdminUrl = (url: URL) => url.hostname.startsWith('admin.') || url.pathname.startsWith('/admin');

/**
 * Statistiques de visites, sans cookie et sans donnée personnelle stockée :
 * - Vercel Web Analytics (tableau de bord Vercel)
 * - nos propres statistiques, affichées dans l'admin (page « Statistiques »)
 * Les pages de l'admin ne sont jamais comptées.
 */
export default function SiteAnalytics() {
  const pathname = usePathname();
  const firstView = useRef(true);

  useEffect(() => {
    if (!pathname || isAdminUrl(new URL(window.location.href))) return;
    // Le site d'origine (Google, Instagram…) n'a de sens qu'à l'arrivée sur le site
    const referrer = firstView.current ? document.referrer : '';
    firstView.current = false;
    const body = JSON.stringify({ path: pathname, referrer });
    try {
      if (!navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }))) {
        fetch('/api/track', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
      }
    } catch {
      // Les statistiques ne doivent jamais gêner la navigation
    }
  }, [pathname]);

  return <Analytics beforeSend={(event) => (isAdminUrl(new URL(event.url)) ? null : event)} />;
}
