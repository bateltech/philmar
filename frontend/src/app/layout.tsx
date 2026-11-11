import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import LayoutShell from '../components/layout-shell';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Philmar – Musicien, chanteur et multi-instrumentiste',
    template: '%s | Philmar',
  },
  description:
    'Site officiel de Philmar (Philippe Martin), musicien multi-instrumentiste et chanteur : concerts, spectacles, discographie, ateliers instruments du monde et voix.',
  keywords: ['Philmar', 'Philippe Martin', 'musicien', 'instruments du monde', 'chant', 'concerts', 'spectacles', 'ateliers voix'],
  openGraph: {
    siteName: SITE_NAME,
    locale: 'fr_FR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  // suppressHydrationWarning : l'admin ajoute une classe de thème sur <html> avant l'hydratation
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <LayoutShell navbar={<Navbar />} footer={<Footer />}>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
