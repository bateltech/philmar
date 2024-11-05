'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faFacebookF, faInstagram, faSoundcloud, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('.navStyle');
      const items = document.querySelectorAll('.linkStyle');
      const icons = document.querySelector('.icons');
      const titre = document.querySelector('.titre');

      if (window.scrollY > 100) {
        nav.classList.add('bg-white', 'bg-opacity-90');
        nav.classList.remove('bg-transparent');

        items.forEach(item => {
          item.classList.remove('text-white');
          item.classList.add('text-black');
        });

        icons.classList.add('text-black');
        icons.classList.remove('text-white');

        titre.classList.add('text-black');
        titre.classList.remove('text-white');
      } else {
        nav.classList.add('bg-transparent');
        nav.classList.remove('bg-white', 'bg-opacity-90');

        items.forEach(item => {
          item.classList.remove('text-black');
          item.classList.add('text-white');
        });

        icons.classList.add('text-white');
        icons.classList.remove('text-black');

        titre.classList.add('text-white');
        titre.classList.remove('text-black');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 z-20 transition-colors duration-300 w-full">
      <nav className="flex justify-between items-center navStyle bg-transparent px-6 py-4">
        <div className="flex items-center space-x-3">
          <Image src="/images/logo.png" alt="Philmar Logo" width={50} height={50} />
          <span className="font-bold text-lg titre">Philmar</span>
        </div>

        <div className="flex space-x-8 items-center">
          <ul className="flex space-x-6">
            <li><Link href="/accueil" className={`linkStyle ${isActive('/accueil') ? 'text-amber-500 font-bold border-b-2 border-amber-500' : ''}`}>Accueil</Link></li>
            <li><Link href="/discographie" className={`linkStyle ${isActive('/discographie') ? 'text-amber-500 font-bold border-b-2 border-amber-500' : ''}`}>Discographie</Link></li>
            <li><Link href="/concerts" className={`linkStyle ${isActive('/concerts') ? 'text-amber-500 font-bold border-b-2 border-amber-500' : ''}`}>Concerts</Link></li>
            <li><Link href="/spectacles" className={`linkStyle ${isActive('/spectacles') ? 'text-amber-500 font-bold border-b-2 border-amber-500' : ''}`}>Spectacles</Link></li>
            <li><Link href="/biographie" className={`linkStyle ${isActive('/biographie') ? 'text-amber-500 font-bold border-b-2 border-amber-500' : ''}`}>Biographie</Link></li>
            <li><Link href="/instruments" className={`linkStyle ${isActive('/instruments') ? 'text-amber-500 font-bold border-b-2 border-amber-500' : ''}`}>Instruments</Link></li>
            <li><Link href="/voix" className={`linkStyle ${isActive('/voix') ? 'text-amber-500 font-bold border-b-2 border-amber-500' : ''}`}>Voix</Link></li>
          </ul>

          <div className="flex space-x-4 text-white icons">
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
