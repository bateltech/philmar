import type { Metadata } from 'next';

/** Adresse officielle du site public (même valeur que PUBLIC_ORIGIN dans middleware.ts). */
export const SITE_URL = 'https://www.philmarzic.com';
export const SITE_NAME = 'Philmar';

/** Pages publiques indexables, utilisées par le sitemap. */
export const PUBLIC_ROUTES = [
  '/accueil',
  '/biographie',
  '/concerts',
  '/spectacles',
  '/discographie',
  '/instruments',
  '/voix',
  '/mentions-legales',
] as const;

/**
 * Métadonnées d'une page publique : titre, description, adresse canonique
 * et aperçu de partage (Facebook, WhatsApp, LinkedIn…).
 * L'image de partage vient de app/opengraph-image.jpg.
 */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: 'fr_FR',
      type: 'website',
    },
  };
}
