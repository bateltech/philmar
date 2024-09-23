'use client'; // Marquer ce fichier comme un composant client

import Link from 'next/link';
import { useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faFacebookF, faInstagram, faSoundcloud, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('.navStyle');
      if (window.scrollY > 100) {
        nav.classList.add('bg-white', 'bg-opacity-80');
        nav.classList.remove('bg-transparent');
      } else {
        nav.classList.add('bg-transparent');
        nav.classList.remove('bg-white', 'bg-opacity-80');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 z-20 transition-colors duration-300 w-full">
        <nav className="flex justify-between items-center navStyle bg-transparent px-6 py-4">
        {/* Logo et Nom Philmar */}
            <div className="flex items-center space-x-3">
                <Image src="/images/logo.png" alt="Philmar Logo" width={50} height={50} />
                <span className="font-bold text-lg text-black">Philmar</span>
            </div>

            {/* Liens du menu et Icônes des réseaux sociaux */}
            <div className="flex space-x-8 items-center">
                {/* Liens du menu */}
                <ul className="flex space-x-6">
                <li><Link href="/accueil" className="linkStyle">Accueil</Link></li>
                <li><Link href="/discographie" className="linkStyle">Discographie</Link></li>
                <li><Link href="/concerts" className="linkStyle">Concerts</Link></li>
                <li><Link href="/spectacles" className="linkStyle">Spectacles</Link></li>
                <li><Link href="/biographie" className="linkStyle">Biographie</Link></li>
                <li><Link href="/instruments" className="linkStyle">Instruments</Link></li>
                <li><Link href="/voix" className="linkStyle">Voix</Link></li>
                </ul>

                {/* Icônes des réseaux sociaux */}
                <div className="flex space-x-4 text-black">
                    <Link href="mailto:example@gmail.com" passHref aria-label="Gmail" className="hover:text-amber-500">
                        <FontAwesomeIcon icon={faEnvelope} size="lg" />
                    </Link>
                    <Link href="https://youtube.com" passHref aria-label="YouTube" className="hover:text-amber-500">
                        <FontAwesomeIcon icon={faYoutube} size="lg" />
                    </Link>
                    <Link href="https://facebook.com" passHref aria-label="Facebook" className="hover:text-amber-500">
                        <FontAwesomeIcon icon={faFacebookF} size="lg" />
                    </Link>
                    <Link href="https://instagram.com" passHref aria-label="Instagram" className="hover:text-amber-500">
                        <FontAwesomeIcon icon={faInstagram} size="lg" />
                    </Link>
                    <Link href="https://soundcloud.com" passHref aria-label="SoundCloud" className="hover:text-amber-500">
                        <FontAwesomeIcon icon={faSoundcloud} size="lg" />
                    </Link>
                    <Link href="https://linkedin.com" passHref aria-label="LinkedIn" className="hover:text-amber-500">
                        <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
                    </Link>
                </div>
            </div>
      </nav>
    </header>
  );
};

export default Navbar;
