import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  '/concerts',
  'Concerts',
  'Les concerts de Philmar : chants et instruments du monde en solo ou en formation. Dates, présentations et galerie photos.',
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
