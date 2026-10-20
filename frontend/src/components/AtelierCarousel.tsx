'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getContent } from '../lib/content';

interface Atelier {
  nom: string;
  image: string;
  description?: string;
  objectifs?: string;
  approche?: string;
  deroulement?: string;
  pdf?: string; // URL absolue ou relative (ex: /documents/xxx.pdf)
}

// Embla a besoin d'assez de slides pour boucler sur grand écran
const MIN_SLIDES = 8;

const options: EmblaOptionsType = {
  loop: true,
  align: 'start',
  dragFree: true, // glisse avec élan, sans s'arrêter sur chaque carte
};

export default function AteliersCarousel() {
  const [items, setItems] = useState<Atelier[]>([]);

  // Modale / PDF
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);      // URL d'origine (pour "ouvrir dans un onglet")
  const [viewerErr, setViewerErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  // ---------- DATA ----------
  useEffect(() => {
    let cancelled = false;
    getContent<Atelier[]>('ateliers_instruments')
      .then((arr: Atelier[]) => {
        if (cancelled) return;
        const safe = (arr || []).filter(Boolean);
        let looped = safe;
        while (safe.length > 0 && looped.length < MIN_SLIDES) looped = [...looped, ...safe];
        setItems(looped);
      })
      .catch(() => setItems([]));
    return () => { cancelled = true; };
  }, []);

  // ---------- BOUTONS ----------
  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  // ---------- PDF VIEWER (iframe simple) ----------
  const buildViewerUrl = (raw: string) => {
    const addParams = (u: string) =>
      u.includes('#') ? u : `${u}#toolbar=1&navpanes=0&view=FitH`;

    // PDF servi directement par ton site (public/documents/...)
    if (raw.startsWith('/')) {
      return addParams(raw);
    }

    // PDF externe → on passe par le proxy
    const absolute = new URL(raw, window.location.origin).toString();
    return addParams(`/api/pdf-proxy?url=${encodeURIComponent(absolute)}`);
  };

  const openPdf = (e: React.MouseEvent, url?: string) => {
    if (!url) return;
    e.preventDefault();
    e.stopPropagation();

    setViewerErr(null);
    setLoading(false);

    try {
      const viewerUrl = buildViewerUrl(url);
      setPdfUrl(viewerUrl);
    } catch (err) {
      console.error(err);
      setViewerErr("Impossible d'ouvrir ce PDF.");
    }
  };


  const closePdf = useCallback(() => {
    setPdfUrl(null);
    setViewerErr(null);
  }, []);




  // Bloque le scroll derrière la modale
  useEffect(() => {
    if (!pdfUrl) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (ev: KeyboardEvent) => { if (ev.key === 'Escape') closePdf(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [pdfUrl, closePdf]);

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3 select-none">
        {/* Flèche gauche */}
        <button
          onClick={scrollPrev}
          aria-label="Précédent"
          type="button"
          className="flex-shrink-0 p-0 sm:w-12 sm:h-12 flex items-center justify-center sm:rounded-full sm:bg-black/60 sm:border sm:border-white/30 text-white/60 sm:text-white hover:text-white hover:sm:bg-black/80 hover:sm:border-white/60 hover:scale-110 transition-all sm:shadow-lg"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        {/* Track */}
        <div ref={emblaRef} className="flex-1 min-w-0 overflow-hidden cursor-grab active:cursor-grabbing">
          <div className="flex touch-pan-y -ml-4">
            {items.map((atelier, index) => (
              <div key={`${atelier.nom}-${index}`} className="flex-[0_0_auto] min-w-0 pl-4">
                <div className="w-[calc(100vw-5.5rem)] sm:w-[300px] h-full bg-black text-white rounded shadow border border-white/20 select-none">
                  <div className="relative">
                    <Image
                      src={atelier.image}
                      alt={atelier.nom}
                      width={300}
                      height={200}
                      draggable={false}
                      className="w-full h-[160px] object-cover pointer-events-none"
                      priority={index < 8}
                    />
                    <div className="absolute top-0 left-0 bg-[#791919] px-2 py-1 text-xs font-bold uppercase w-2/3">
                      {atelier.nom}
                    </div>
                  </div>

                  <div className="p-2 sm:p-3 text-xs sm:text-sm leading-snug">
                    {atelier.description && (<p className="mb-2 text-justify whitespace-pre-line">{atelier.description}</p>)}
                    {atelier.objectifs && (
                      <p className="mb-2 text-justify whitespace-pre-line">
                        <span className="font-bold">Objectifs :</span> {atelier.objectifs}
                      </p>
                    )}
                    {atelier.approche && (
                      <p className="mb-2 text-justify whitespace-pre-line">
                        <span className="font-bold">Approche :</span> {atelier.approche}
                      </p>
                    )}
                    {atelier.deroulement && (
                      <p className="mb-2 text-justify whitespace-pre-line">
                        <span className="font-bold">Possibilités de déroulement :</span> {atelier.deroulement}
                      </p>
                    )}

                    {atelier.pdf?.trim() && (
                      <a
                        href={atelier.pdf}
                        onClick={(e) => openPdf(e, atelier.pdf)}
                        rel="noopener"
                        className="text-blue-300 font-semibold underline relative z-10 pt-4 pb-4"
                      >
                        En savoir plus →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flèche droite */}
        <button
          onClick={scrollNext}
          aria-label="Suivant"
          type="button"
          className="flex-shrink-0 p-0 sm:w-12 sm:h-12 flex items-center justify-center sm:rounded-full sm:bg-black/60 sm:border sm:border-white/30 text-white/60 sm:text-white hover:text-white hover:sm:bg-black/80 hover:sm:border-white/60 hover:scale-110 transition-all sm:shadow-lg"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* --- MODALE PDF (iframe sur blob:) --- */}
      {!!pdfUrl && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={closePdf} />
          <div className="relative z-10 w-[92vw] h-[88vh] max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black">
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <span className="text-white text-xs sm:text-sm opacity-80 truncate pr-2">{pdfUrl}</span>
              <div className="flex items-center gap-2">
                <a href={pdfUrl} target="_blank" rel="noopener" className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20">
                  Ouvrir dans un nouvel onglet
                </a>
                <button onClick={closePdf} aria-label="Fermer" className="p-2 rounded hover:bg-white/10 active:scale-95 transition" type="button">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="w-full h-[calc(88vh-44px)] bg-neutral-900 flex items-center justify-center">
              {loading && <div className="text-white/80 text-sm">Chargement du PDF…</div>}

              {!loading && viewerErr && (
                <div className="text-white/90 p-6 text-center">{viewerErr}</div>
              )}
              {!loading && !viewerErr && pdfUrl && (
                <iframe
                  src={pdfUrl}
                  title="PDF"
                  className="w-full h-full bg-white"
                />
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
