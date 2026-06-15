'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMusic } from '@fortawesome/free-solid-svg-icons';
import SocialLinksRow from '@/components/SocialLinksRow';
import { getContent } from '@/lib/content';

const DEFAULTS = {
  title: 'Vous voilà sur un horizon lointain',
  message:
    "Ce chemin ne résonne avec aucun de nos horizons connus. Laissez la musique vous reconduire vers l'accueil : chants et instruments du monde vous y attendent, pour voyager à nouveau jusqu'au cœur de soi.",
};

export default function NotFound() {
  const [content, setContent] = useState(DEFAULTS);

  useEffect(() => {
    getContent<Partial<typeof DEFAULTS>>('page_404')
      .then((data) => {
        if (data) setContent({ ...DEFAULTS, ...data });
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-24 overflow-hidden">
      <div className="max-w-lg w-full text-center">
        {/* Notes flottantes */}
        <div className="relative flex justify-center items-center mb-8 h-24">
          <span className="absolute -left-2 top-2 text-amber-500/40 text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>♪</span>
          <span className="absolute left-1/4 -top-1 text-amber-500/30 text-3xl animate-bounce" style={{ animationDelay: '0.6s' }}>♫</span>
          <FontAwesomeIcon icon={faMusic} className="text-amber-500 text-6xl sm:text-7xl drop-shadow-[0_0_25px_rgba(245,158,11,0.35)]" />
          <span className="absolute right-1/4 -top-1 text-amber-500/30 text-3xl animate-bounce" style={{ animationDelay: '0.9s' }}>♩</span>
          <span className="absolute -right-2 top-2 text-amber-500/40 text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>♬</span>
        </div>

        <h1
          className="text-3xl sm:text-5xl text-amber-500 mb-5 leading-tight"
          style={{ fontFamily: '"Waiting for the Sunrise", cursive' }}
        >
          {content.title}
        </h1>
        <p className="text-gray-400 mb-10 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {content.message}
        </p>

        <Link
          href="/accueil"
          className="inline-block rounded-lg bg-amber-500 text-black font-semibold px-6 py-3 hover:bg-amber-400 transition-colors mb-12"
        >
          Revenir à l&apos;accueil
        </Link>

        <div className="border-t border-white/10 pt-8">
          {/* Contact en texte */}
          <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm mb-6">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>philmarzic @ lilo.org</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} />
              <span>06 28 06 07 56</span>
            </div>
          </div>

          <p className="text-gray-500 text-sm mb-5">Retrouvez Philmar sur</p>
          <SocialLinksRow />
        </div>
      </div>
    </main>
  );
}
