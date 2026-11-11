import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  '/mentions-legales',
  'Mentions légales',
  'Mentions légales du site officiel de Philmar : édition, hébergement, propriété intellectuelle et données personnelles.',
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
