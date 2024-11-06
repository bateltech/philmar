import Link from 'next/link';
import './globals.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="fr">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link href='https://fonts.googleapis.com/css?family=Waiting for the Sunrise' rel='stylesheet'></link>
        </head>
      <body>
      <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}