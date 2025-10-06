// components/Instruments/AteliersCarousel.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Atelier {
  nom: string;
  image: string;
  description?: string;
  objectifs?: string;
  approche?: string;
  deroulement?: string;
  pdf?: string;
}

export default function AteliersCarousel() {
  const [ateliers, setAteliers] = useState<Atelier[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/data/ateliers_instruments.json')
      .then(res => res.json())
      .then(setAteliers);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between mb-4">
        <button onClick={() => scroll('left')} aria-label="Précédent">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button onClick={() => scroll('right')} aria-label="Suivant">
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex overflow-x-auto space-x-4 scrollbar-hide"
      >
        {ateliers.map((atelier, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[300px] bg-black text-white rounded shadow border border-white"
          >
            <div className="relative">
              <Image
                src={atelier.image}
                alt={atelier.nom}
                width={300}
                height={200}
                className="w-full h-[160px] object-cover"
              />
              <div className="absolute top-0 left-0 bg-[#791919] px-2 py-1 text-xs font-bold uppercase">
                {atelier.nom}
              </div>
            </div>

            <div className="p-3 text-sm leading-snug">
              {atelier.description && (
                <p className="mb-2">{atelier.description}</p>
              )}
              {atelier.objectifs && (
                <p className="mb-2">
                  <span className="font-bold">Objectifs :</span> {atelier.objectifs}
                </p>
              )}
              {atelier.approche && (
                <p className="mb-2">
                  <span className="font-bold">Approche :</span> {atelier.approche}
                </p>
              )}
              {atelier.deroulement && (
                <p className="mb-2">
                  <span className="font-bold">Possibilités de déroulement :</span>{' '}
                  {atelier.deroulement}
                </p>
              )}
              {atelier.pdf && (
                <a
                  href={atelier.pdf}
                  target="_blank"
                  className="text-blue-400 font-semibold underline"
                >
                  En savoir plus →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
