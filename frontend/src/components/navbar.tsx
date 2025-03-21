'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faFacebookF, faInstagram, faSoundcloud, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faBars, faEnvelope, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (path: string) => pathname === path;
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('.navStyle');
      const items = document.querySelectorAll('.linkStyle');
      const icons = document.querySelector('.icons');
      const titre = document.querySelector('.titre');
      const menuIcon = document.querySelector('.menuIcon'); // Get the hamburger icon
  
      if (window.scrollY > 100) {
        nav.classList.add('bg-white', 'bg-opacity-90');
        nav.classList.remove('bg-transparent');
  
        items.forEach(item => {
          const linkPath = item.getAttribute('href');
          if (!isActive(linkPath)) {
            item.classList.remove('text-white');
            item.classList.add('text-black');
          }
        });
  
        icons.classList.add('text-black');
        icons.classList.remove('text-white');
  
        titre.classList.add('text-black');
        titre.classList.remove('text-white');
  
        menuIcon.classList.add('text-black'); // Change hamburger menu icon color
        menuIcon.classList.remove('text-white');
      } else {
        nav.classList.add('bg-transparent');
        nav.classList.remove('bg-white', 'bg-opacity-90');
  
        items.forEach(item => {
          const linkPath = item.getAttribute('href');
          if (!isActive(linkPath)) {
            item.classList.remove('text-black');
            item.classList.add('text-white');
          }
        });
  
        icons.classList.add('text-white');
        icons.classList.remove('text-black');
  
        titre.classList.add('text-white');
        titre.classList.remove('text-black');
  
        menuIcon.classList.add('text-white'); // Change hamburger menu icon back to white
        menuIcon.classList.remove('text-black');
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    
    <header className="fixed top-0 right-0 left-0 z-20 transition-colors duration-300 w-full animate-slideInFromTop">
    <nav className="flex justify-between items-center navStyle bg-transparent px-6 py-4">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <Image src="/images/logo.png" alt="Philmar Logo" width={50} height={50} />
        <span className="font-bold text-lg titre tracking-wider" style={{ fontFamily: '"Waiting for the Sunrise", cursive' }}>
          Philmar
        </span>
      </div>

      {/* Desktop Menu */}
<div className="hidden lg:flex space-x-8 items-center">
        <ul className="flex space-x-6">
          {["accueil", "discographie", "concerts", "spectacles", "biographie", "instruments", "voix"].map((page) => (
            <li key={page}>
              <Link href={`/${page}`} className={`linkStyle ${isActive(`/${page}`) ? "text-amber-500 font-bold border-b-2 border-amber-500" : ""}`}>
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Social Icons */}
        <div className="flex space-x-4 text-white icons">
          <Link href="mailto:philmarzic@lilo.org" className="hover:text-amber-500">
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
          </Link>
          <Link href="https://www.youtube.com/@PhilmarZic" className="hover:text-amber-500">
            <FontAwesomeIcon icon={faYoutube} size="lg" />
          </Link>
          <Link href="https://www.facebook.com/philmarzic/" className="hover:text-amber-500">
            <FontAwesomeIcon icon={faFacebookF} size="lg" />
          </Link>
          <Link href="https://www.instagram.com/philmarzic/" className="hover:text-amber-500">
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </Link>
          <Link href="https://soundcloud.com/philmarzic" className="hover:text-amber-500">
            <FontAwesomeIcon icon={faSoundcloud} size="lg" />
          </Link>
          <Link href="https://fr.linkedin.com/in/philmar" className="hover:text-amber-500">
            <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
          </Link>
        </div>
      </div>

      {/* Hamburger Menu (Mobile) */}
<div className="lg:hidden">
<button onClick={() => setMenuOpen(true)} className="menuIcon text-white transition-colors">
  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
</button>
</div>

    </nav>

   {/* Drawer */}
   {menuOpen && (
  <div className="fixed inset-0 w-screen h-screen min-h-screen bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center space-y-6 text-white text-lg">
    {/* Bouton pour fermer le drawer */}
    <button onClick={() => setMenuOpen(false)} className="absolute top-5 right-5 text-white">
      <FontAwesomeIcon icon={faTimes} size="lg" />
    </button>

    {/* Liens de navigation */}
    {["accueil", "discographie", "concerts", "spectacles", "biographie", "instruments", "voix"].map((item) => (
      <Link key={item} href={`/${item}`} onClick={() => setMenuOpen(false)} className="hover:text-amber-500">
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </Link>
    ))}

    {/* Icônes des réseaux sociaux */}
    <div className="flex space-x-6 mt-4">
      <Link href="mailto:philmarzic@lilo.org" aria-label="Gmail" className="hover:text-amber-500">
        <FontAwesomeIcon icon={faEnvelope} size="lg" />
      </Link>
      <Link href="https://www.youtube.com/@PhilmarZic" aria-label="YouTube" className="hover:text-amber-500">
        <FontAwesomeIcon icon={faYoutube} size="lg" />
      </Link>
      <Link href="https://www.facebook.com/philmarzic/" aria-label="Facebook" className="hover:text-amber-500">
        <FontAwesomeIcon icon={faFacebookF} size="lg" />
      </Link>
      <Link href="https://www.instagram.com/philmarzic/" aria-label="Instagram" className="hover:text-amber-500">
        <FontAwesomeIcon icon={faInstagram} size="lg" />
      </Link>
      <Link href="https://soundcloud.com/philmarzic" aria-label="SoundCloud" className="hover:text-amber-500">
        <FontAwesomeIcon icon={faSoundcloud} size="lg" />
      </Link>
      <Link href="https://fr.linkedin.com/in/philmar" aria-label="LinkedIn" className="hover:text-amber-500">
        <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
      </Link>
    </div>
  </div>
)}


  </header>
  );
};

export default Navbar;
