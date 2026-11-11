import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

const base = pageMetadata(
  '/accueil',
  'Accueil',
  'Philmar, musicien dans l’âme et professionnel : chants et instruments du monde pour voyager vers de lointains horizons et jusqu’au cœur de soi. Concerts, spectacles, ateliers et albums.',
);

// Page d'accueil : titre complet, sans le suffixe « | Philmar »
export const metadata: Metadata = {
  ...base,
  title: { absolute: 'Philmar – Musicien, chanteur et multi-instrumentiste' },
  openGraph: { ...base.openGraph, title: 'Philmar – Musicien, chanteur et multi-instrumentiste' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
