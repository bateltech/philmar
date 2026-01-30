'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faFacebookF, faInstagram, faSoundcloud, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const pathname = usePathname();

  // état d’animation d’entrée (liens + icônes)
  const [navIn, setNavIn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setNavIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // états desktop (hover) avec latence anti-flicker
  const [openPerf, setOpenPerf] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const perfTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterPerf = () => { if (perfTimer.current) clearTimeout(perfTimer.current); setOpenPerf(true); };
  const leavePerf = () => { perfTimer.current = setTimeout(() => setOpenPerf(false), 100); };
  const enterForm = () => { if (formTimer.current) clearTimeout(formTimer.current); setOpenForm(true); };
  const leaveForm = () => { formTimer.current = setTimeout(() => setOpenForm(false), 100); };

  // états mobile (drawer + accordéons)
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePerfOpen, setMobilePerfOpen] = useState(false);
  const [mobileFormOpen, setMobileFormOpen] = useState(false);

  // active parents sur sous-pages
  const isActive = (path: string) => {
    if (path === '/concerts') return pathname === '/concerts' || pathname === '/spectacles';
    if (path === '/instruments') return pathname === '/instruments' || pathname === '/voix';
    return pathname === path;
  };

  // styles au scroll — **scopé au desktop uniquement** pour ne pas casser le menu mobile
  useEffect(() => {
    const handleScroll = () => {
      // si le menu mobile est ouvert, ne pas toucher aux styles
      if (mobileOpen) return;

      const nav = document.querySelector('.navStyle') as HTMLElement | null;
      const desktopScope = document.querySelector('.desktop-links') as HTMLElement | null;
      const items = desktopScope?.querySelectorAll<HTMLAnchorElement>('.linkStyle') ?? [];
      const icons = desktopScope?.querySelector('.icons') as HTMLElement | null;
      const titre = document.querySelector('.titre') as HTMLElement | null;
      if (!nav || !icons || !titre) return;

      const scrolled = window.scrollY > 100;
      if (scrolled) {
        nav.classList.add('bg-white', 'bg-opacity-90'); nav.classList.remove('bg-transparent');
        icons.classList.add('text-black'); icons.classList.remove('text-white');
        titre.classList.add('text-black'); titre.classList.remove('text-white');
      } else {
        nav.classList.add('bg-transparent'); nav.classList.remove('bg-white', 'bg-opacity-90');
        icons.classList.add('text-white'); icons.classList.remove('text-black');
        titre.classList.add('text-white'); titre.classList.remove('text-black');
      }

      items.forEach((item) => {
        const linkPath = item.getAttribute('href') || '';
        item.classList.remove('text-black', 'text-white', 'text-amber-500', 'font-bold', 'border-amber-500');
        item.classList.add('border-b-2', 'border-transparent', 'pb-[2px]');
        if (isActive(linkPath)) {
          item.classList.add('text-amber-500', 'font-bold', 'border-amber-500');
          item.classList.remove('border-transparent');
        } else {
          item.classList.add(scrolled ? 'text-black' : 'text-white');
        }
      });

      // 2) Dans ton handleScroll (dans le useEffect existant), AJOUTE juste ces lignes après la gestion de `titre/icons` :
      const hamburger = document.querySelector('.hamburger-btn') as HTMLElement | null;
      if (hamburger) {
        hamburger.classList.toggle('text-black', scrolled);
        hamburger.classList.toggle('text-white', !scrolled);
        hamburger.classList.toggle('border-white/30', !scrolled);
        hamburger.classList.toggle('border-black/30', scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, mobileOpen]); // <-- tient compte de l'état mobile

  // smooth scroll vers #projets si déjà sur /accueil
  const handleProjetsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/accueil') {
      e.preventDefault();
      const el = document.getElementById('projets');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileOpen(false);
    }
  };

  // lock scroll body quand drawer mobile ouvert
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 transition-colors w-full">
      <nav className="flex items-center justify-between navStyle bg-transparent px-4 md:px-6 py-3 md:py-4">
        {/* NE PAS TOUCHER ▼▼▼ (conformément à ta demande) */}
        <div className="flex items-center space-x-3">
          <Image src="/images/logo.png" priority alt="Philmar Logo" width={50} height={50} />
          <span className="font-bold text-lg titre tracking-wider" style={{ fontFamily: '"Waiting for the Sunrise", cursive' }}>Philmar</span>
        </div>
        {/* NE PAS TOUCHER ▲▲▲ */}

        {/* Hamburger mobile (icône plus robuste) */}
        <button
          type="button"
          className="hamburger-btn [@media(min-width:1060px)]:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/30 text-white icons transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Ouvrir le menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="relative block w-5 h-3">
            <span className={`absolute left-0 right-0 top-0 h-[2px] rounded bg-current transition-transform ${mobileOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] rounded bg-current transition-opacity ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute left-0 right-0 bottom-0 h-[2px] rounded bg-current transition-transform ${mobileOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </span>
        </button>

        {/* Desktop : liens + icônes (scopés via .desktop-links) */}
        <div className={`hidden [@media(min-width:1060px)]:flex items-center gap-8 desktop-links ${navIn ? 'animate-navIn' : 'opacity-0 -translate-y-[6px]'}`}>
          <ul className="flex items-center gap-6">
            <li><Link href="/accueil" className={`linkStyle border-b-2 border-transparent pb-[2px] ${isActive('/accueil') ? 'text-amber-500 font-bold border-amber-500' : ''}`}>Accueil</Link></li>

            {/* Performances */}
            <li className="relative" onMouseEnter={enterPerf} onMouseLeave={leavePerf}>
              <Link
                href="/concerts"
                onClick={(e) => e.preventDefault()}
                aria-haspopup="menu"
                aria-expanded={openPerf}
                className={`linkStyle border-b-2 border-transparent pb-[2px] ${isActive('/concerts') ? 'text-amber-500 font-bold border-amber-500' : ''}`}
              >
                Performances
              </Link>
              <div className={`absolute left-1/2 -translate-x-1/2 top-full ${openPerf ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'} transition-all duration-150 ease-out`}>
                <div className="pt-2">
                  <ul className="min-w-[200px] rounded-xl shadow-xl shadow-black/30 ring-1 ring-white/10 border border-white/10 bg-black/70 text-white backdrop-blur-md py-2">
                    <li><Link href="/concerts" className="block px-4 py-2 hover:bg-white/10 rounded-md">Concerts</Link></li>
                    <li><Link href="/spectacles" className="block px-4 py-2 hover:bg-white/10 rounded-md">Spectacles</Link></li>
                  </ul>
                </div>
              </div>
            </li>

            <li><Link href="/discographie" className={`linkStyle border-b-2 border-transparent pb-[2px] ${isActive('/discographie') ? 'text-amber-500 font-bold border-amber-500' : ''}`}>Discographie</Link></li>
            <li><Link href="/biographie" className={`linkStyle border-b-2 border-transparent pb-[2px] ${isActive('/biographie') ? 'text-amber-500 font-bold border-amber-500' : ''}`}>Biographie</Link></li>

            {/* Formations */}
            <li className="relative" onMouseEnter={enterForm} onMouseLeave={leaveForm}>
              <Link
                href="/instruments"
                onClick={(e) => e.preventDefault()}
                aria-haspopup="menu"
                aria-expanded={openForm}
                className={`linkStyle border-b-2 border-transparent pb-[2px] ${isActive('/instruments') ? 'text-amber-500 font-bold border-amber-500' : ''}`}
              >
                Formations
              </Link>
              <div className={`absolute left-1/2 -translate-x-1/2 top-full ${openForm ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'} transition-all duration-150 ease-out`}>
                <div className="pt-2">
                  <ul className="min-w-[200px] rounded-xl shadow-xl shadow-black/30 ring-1 ring-white/10 border border-white/10 bg-black/70 text-white backdrop-blur-md py-2">
                    <li><Link href="/instruments" className="block px-4 py-2 hover:bg-white/10 rounded-md">Instruments du monde</Link></li>
                    <li><Link href="/voix" className="block px-4 py-2 hover:bg-white/10 rounded-md">Voie du chant</Link></li>
                  </ul>
                </div>
              </div>
            </li>

            {/* Projets */}
            <li><Link href="/accueil#projets" onClick={handleProjetsClick} className="linkStyle border-b-2 border-transparent pb-[2px]">Projets</Link></li>

            {/* <li><Link href="/contact" className={`linkStyle border-b-2 border-transparent pb-[2px] ${isActive('/contact') ? 'text-amber-500 font-bold border-amber-500' : ''}`}>Contact</Link></li> */}
          </ul>

          {/* Icônes sociales */}
          <div className="flex gap-4 text-white icons">
            <Link href="mailto:philmarzic@lilo.org" aria-label="Gmail" className="hover:text-amber-500" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faEnvelope} size="lg" /></Link>
            <Link href="https://www.youtube.com/@PhilmarZic" aria-label="YouTube" className="hover:text-amber-500" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faYoutube} size="lg" /></Link>
            <Link href="https://www.facebook.com/philmarzic/" aria-label="Facebook" className="hover:text-amber-500" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebookF} size="lg" /></Link>
            <Link href="https://www.instagram.com/philmarzic/" aria-label="Instagram" className="hover:text-amber-500" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} size="lg" /></Link>
            <Link href="https://soundcloud.com/philmarzic" aria-label="SoundCloud" className="hover:text-amber-500" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faSoundcloud} size="lg" /></Link>
            <Link href="https://fr.linkedin.com/in/philmar" aria-label="LinkedIn" className="hover:text-amber-500" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedinIn} size="lg" /></Link>
          </div>
        </div>
      </nav>

      {/* Drawer mobile (z-index + backdrop renforcés) */}
      <div className={`[@media(min-width:1060px)]:hidden fixed inset-0 z-[70] transition ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!mobileOpen}>
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileOpen(false)} />
        <div className={`fixed left-0 right-0 top-[64px] mx-3 rounded-2xl border border-white/10 bg-black/70 text-white backdrop-blur-md shadow-xl overflow-hidden transform transition-all ${mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`} role="dialog" aria-modal="true">
          <div className="p-3">
            <ul className="flex flex-col divide-y divide-white/10">
              <li><Link href="/accueil" className={`block py-3 px-3 linkStyle ${isActive('/accueil') ? 'text-amber-400 font-bold' : ''}`} onClick={() => setMobileOpen(false)}>Accueil</Link></li>

              {/* Performances — accordéon */}
              <li>
                <button type="button" onClick={() => setMobilePerfOpen((v) => !v)} className={`w-full text-left py-3 px-3 linkStyle flex items-center justify-between ${isActive('/concerts') ? 'text-amber-400 font-bold' : ''}`} aria-expanded={mobilePerfOpen} aria-controls="mob-perf">
                  <span>Performances</span><span className={`transition-transform ${mobilePerfOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>
                <div id="mob-perf" className={`grid transition-all duration-200 ${mobilePerfOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <ul className="py-1">
                      <li><Link href="/concerts" className="block py-2 pl-6 pr-3 hover:text-amber-400" onClick={() => setMobileOpen(false)}>Concerts</Link></li>
                      <li><Link href="/spectacles" className="block py-2 pl-6 pr-3 hover:text-amber-400" onClick={() => setMobileOpen(false)}>Spectacles</Link></li>
                    </ul>
                  </div>
                </div>
              </li>

              <li><Link href="/discographie" className={`block py-3 px-3 linkStyle ${isActive('/discographie') ? 'text-amber-400 font-bold' : ''}`} onClick={() => setMobileOpen(false)}>Discographie</Link></li>
              <li><Link href="/biographie" className={`block py-3 px-3 linkStyle ${isActive('/biographie') ? 'text-amber-400 font-bold' : ''}`} onClick={() => setMobileOpen(false)}>Biographie</Link></li>

              {/* Formations — accordéon */}
              <li>
                <button type="button" onClick={() => setMobileFormOpen((v) => !v)} className={`w-full text-left py-3 px-3 linkStyle flex items-center justify-between ${isActive('/instruments') ? 'text-amber-400 font-bold' : ''}`} aria-expanded={mobileFormOpen} aria-controls="mob-form">
                  <span>Formations</span><span className={`transition-transform ${mobileFormOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>
                <div id="mob-form" className={`grid transition-all duration-200 ${mobileFormOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <ul className="py-1">
                      <li><Link href="/instruments" className="block py-2 pl-6 pr-3 hover:text-amber-400" onClick={() => setMobileOpen(false)}>Instruments</Link></li>
                      <li><Link href="/voix" className="block py-2 pl-6 pr-3 hover:text-amber-400" onClick={() => setMobileOpen(false)}>Voix</Link></li>
                    </ul>
                  </div>
                </div>
              </li>

              <li><Link href="/accueil#projets" className="block py-3 px-3 linkStyle" onClick={(e) => { handleProjetsClick(e as any); }}>Projets</Link></li>

              {/* Réseaux sociaux */}
              <li>
                <div className="flex items-center gap-4 py-3 px-3 text-white/90">
                  <Link href="mailto:philmarzic@lilo.org" aria-label="Gmail" className="hover:text-amber-400" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faEnvelope} /></Link>
                  <Link href="https://www.youtube.com/@PhilmarZic" aria-label="YouTube" className="hover:text-amber-400" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faYoutube} /></Link>
                  <Link href="https://www.facebook.com/philmarzic/" aria-label="Facebook" className="hover:text-amber-400" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebookF} /></Link>
                  <Link href="https://www.instagram.com/philmarzic/" aria-label="Instagram" className="hover:text-amber-400" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} /></Link>
                  <Link href="https://soundcloud.com/philmarzic" aria-label="SoundCloud" className="hover:text-amber-400" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faSoundcloud} /></Link>
                  <Link href="https://fr.linkedin.com/in/philmar" aria-label="LinkedIn" className="hover:text-amber-400" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedinIn} /></Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* utilitaires (si pas déjà présents) */}
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        @keyframes navIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-navIn { animation: navIn 380ms cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>
    </header>
  );
};

export default Navbar;
