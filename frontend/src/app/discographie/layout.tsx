import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  '/discographie',
  'Discographie',
  'Discographie de Philmar : écoutez les albums et morceaux, des instruments du monde au chant improvisé.',
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
