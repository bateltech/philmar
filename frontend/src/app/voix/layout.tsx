import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  '/voix',
  'Ateliers voix – La voie du chant',
  'Stages, ateliers et séances individuelles de chant avec Philmar. Aucune connaissance musicale requise : simplement le désir de se faire plaisir, partager et éveiller sa voix.',
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
