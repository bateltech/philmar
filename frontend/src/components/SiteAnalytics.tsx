'use client';

import { Analytics } from '@vercel/analytics/next';

/**
 * Statistiques de visites Vercel Web Analytics : sans cookie et sans donnée
 * personnelle stockée, donc sans bandeau de consentement.
 * Les pages de l'admin (admin.philmarzic.com et /admin) ne sont pas comptées.
 */
export default function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        const url = new URL(event.url);
        if (url.hostname.startsWith('admin.') || url.pathname.startsWith('/admin')) return null;
        return event;
      }}
    />
  );
}
