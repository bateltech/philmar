'use client';

import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Avis = { texte: string; auteur: string; lieu?: string };

const options: EmblaOptionsType = {
  loop: true,            // ← loop infini
  align: 'center',
  dragFree: false,
  containScroll: 'trimSnaps',
};

export default function AvisSlider() {
  const [avisData, setAvisData] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  // Charger depuis /public/data
  useEffect(() => {
    let alive = true;
    fetch('/data/avis_instruments.json', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('Impossible de charger /data/avis_instruments.json');
        return r.json();
      })
      .then((data: Avis[]) => { if (alive) setAvisData(Array.isArray(data) ? data : []); })
      .catch(console.error)
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  // Autoplay (pause au hover / drag / interaction)
  useEffect(() => {
    if (!emblaApi) return;

    const onPointerDown = () => setPaused(true);
    const onPointerUp = () => setPaused(false);

    emblaApi.on('pointerDown', onPointerDown);
    emblaApi.on('pointerUp', onPointerUp);
    emblaApi.on('select', () => setPaused(true)); // léger stop après action utilisateur

    const id = setInterval(() => {
      if (!paused && (avisData?.length ?? 0) > 1) emblaApi.scrollNext();
    }, 6000);

    return () => {
      clearInterval(id);
      emblaApi.off('pointerDown', onPointerDown);
      emblaApi.off('pointerUp', onPointerUp);
    };
  }, [emblaApi, paused, avisData?.length]);

  const goPrev = () => emblaApi?.scrollPrev();
  const goNext = () => emblaApi?.scrollNext();

  if (loading) {
    return (
      <div className="transition-all duration-500 text-center max-w-xl mx-auto border p-6 rounded-2xl rounded-br-none bg-white/10 text-white">
        <p className="italic opacity-70">Chargement…</p>
      </div>
    );
  }

  if (avisData.length === 0) {
    return (
      <div className="transition-all duration-500 text-center max-w-xl mx-auto border p-6 rounded-2xl rounded-br-none bg-white/10 text-white">
        <p className="italic opacity-70">Aucun avis disponible.</p>
      </div>
    );
  }

  const hasMultiple = avisData.length > 1;

  return (
    <div className="relative max-w-xl mx-auto">
      {/* Boutons extérieurs */}
      {hasMultiple && (
        <>
          <button
            onClick={goPrev}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-label="Avis précédent"
            className="absolute -left-20 top-1/2 -translate-y-1/2 select-none text-white/80 hover:text-white p-1"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={goNext}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-label="Avis suivant"
            className="absolute -right-20 top-1/2 -translate-y-1/2 select-none text-white/80 hover:text-white p-1"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}

      {/* Embla viewport (draggable horizontal) */}
      <div
        ref={emblaRef}
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="flex items-center">
          {avisData.map(({ texte, auteur, lieu }, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%] px-2">
              <div className="border p-6 bg-white/10 text-white transition-colors duration-300 rounded-2xl rounded-br-none text-center">
                <p className="italic">"{texte}"</p>
                <p className="mt-4 font-bold">{auteur}</p>
                {lieu ? <p className="text-sm italic">{lieu}</p> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
