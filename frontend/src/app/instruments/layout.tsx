import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  '/instruments',
  'Ateliers instruments du monde',
  'Ateliers découverte des instruments du monde animés par Philmar : une approche vivante mêlant expressivité, jeu vocal et pratique multi-instrumentale, adaptable à tous les publics.',
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
