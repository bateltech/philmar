import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  '/biographie',
  'Biographie',
  'Le parcours de Philmar, né en 1965 en Haute-Savoie : du rock à l’improvisation, des instruments et chants du monde à la transmission de la voix.',
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
