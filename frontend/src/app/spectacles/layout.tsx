import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  '/spectacles',
  'Spectacles',
  'Les spectacles musicaux de Philmar : créations mêlant chant, instruments du monde et improvisation. Présentations et galerie photos.',
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
