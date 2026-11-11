import type { MetadataRoute } from 'next';
import { PUBLIC_ROUTES, SITE_URL } from '@/lib/seo';

/** /sitemap.xml : liste des pages publiques pour les moteurs de recherche. */
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === '/mentions-legales' ? 'yearly' : 'monthly',
    priority: route === '/accueil' ? 1 : route === '/mentions-legales' ? 0.3 : 0.8,
  }));
}
