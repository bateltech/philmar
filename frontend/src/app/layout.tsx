import './globals.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import LayoutShell from '../components/layout-shell';

export const metadata = {
    title: "Philmar - Site Officiel",
    description: "Découvrez la discographie, les performances et la biographie de Philmar.",
    keywords: "Philmar, musique, concerts, albums, artiste",
    openGraph: {
      title: "Philmar - Site Officiel",
      description: "Découvrez les albums, la biographie et les événements de Philmar.",
      images: "/images/artist-cover.jpg",
      type: "website",
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/images/apple-touch-icon.png",
    },
    themeColor: "#ffffff",
  };

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="fr">
      <body>
        <LayoutShell navbar={<Navbar />} footer={<Footer />}>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}