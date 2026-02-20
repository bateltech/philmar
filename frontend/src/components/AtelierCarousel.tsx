'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Atelier {
  nom: string;
  image: string;
  description?: string;
  objectifs?: string;
  approche?: string;
  deroulement?: string;
  pdf?: string; // URL absolue ou relative (ex: /documents/xxx.pdf)
}

type Pointer = 'mouse' | 'touch' | 'pen' | '';

export default function AteliersCarousel() {
  const [base, setBase] = useState<Atelier[]>([]);
  const [items, setItems] = useState<Atelier[]>([]);

  // Modale / PDF
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);      // URL d'origine (pour "ouvrir dans un onglet")
  // const [viewerSrc, setViewerSrc] = useState<string | null>(null); // blob: URL pour l'iframe
  const [viewerErr, setViewerErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Carousel state
  const containerRef = useRef<HTMLDivElement>(null);
  const strideRef = useRef<number>(0);
  const rafLoopRef = useRef<number | null>(null);

  const isPointerDownRef = useRef(false);
  const dragActiveRef = useRef(false);
  const didDragRef = useRef(false);
  const dragStartXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const velocityRef = useRef(0);
  const pointerTypeRef = useRef<Pointer>('');

  const momentumIdRef = useRef<number | null>(null);
  const restoreUserSelectRef = useRef<string | null>(null);

  // Feel
  const DRAG_THRESHOLD_PX = 4;
  const FRICTION = 0.94;
  const MIN_VELOCITY = 0.06;
  const MAX_TICK = 48;

  // ---------- DATA ----------
  useEffect(() => {
    let cancelled = false;
    fetch('/data/ateliers_instruments.json', { cache: 'no-store' })
      .then((r) => r.json())
      .then((arr: Atelier[]) => {
        if (cancelled) return;
        const safe = (arr || []).filter(Boolean);
        setBase(safe);
        setItems([...safe, ...safe, ...safe]); // triple pour le loop
      })
      .catch(() => {
        setBase([]);
        setItems([]);
      });
    return () => { cancelled = true; };
  }, []);

  const measureStride = () => {
    const el = containerRef.current;
    if (!el) return 0;
    const c0 = el.children[0] as HTMLElement | undefined;
    const c1 = el.children[1] as HTMLElement | undefined;
    if (!c0 || !c1) return 0;
    return c1.offsetLeft - c0.offsetLeft;
  };

  useEffect(() => {
    const ro = new ResizeObserver(() => { strideRef.current = measureStride(); });
    const el = containerRef.current;
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Init au tiers central
  useEffect(() => {
    if (!containerRef.current || base.length === 0 || items.length === 0) return;
    requestAnimationFrame(() => {
      strideRef.current = measureStride();
      const el = containerRef.current!;
      const L = base.length;
      const stride = strideRef.current || 0;
      const target = L * stride;
      const prev = el.style.scrollBehavior;
      el.style.scrollBehavior = 'auto';
      el.scrollLeft = target;
      el.style.scrollBehavior = prev;
    });
  }, [base.length, items.length]);

  // Rebouclage invisible
  const handleLoopBoundaries = (): number => {
    const el = containerRef.current;
    if (!el || base.length === 0) return 0;
    const L = base.length;
    const stride = strideRef.current || 0;
    if (!stride) return 0;
    const firstBoundary = L * stride;
    const lastBoundary = 2 * L * stride;
    const x = el.scrollLeft;
    if (x < firstBoundary) {
      const prev = el.style.scrollBehavior;
      el.style.scrollBehavior = 'auto';
      el.scrollLeft = x + L * stride;
      el.style.scrollBehavior = prev;
      return L * stride;
    } else if (x >= lastBoundary) {
      const prev = el.style.scrollBehavior;
      el.style.scrollBehavior = 'auto';
      el.scrollLeft = x - L * stride;
      el.style.scrollBehavior = prev;
      return -L * stride;
    }
    return 0;
  };

  const onScroll = () => {
    if (rafLoopRef.current) cancelAnimationFrame(rafLoopRef.current);
    rafLoopRef.current = requestAnimationFrame(() => { handleLoopBoundaries(); });
  };

  // ---------- MOMENTUM ----------
  const startMomentum = () => {
    stopMomentum();
    const step = () => {
      const el = containerRef.current;
      if (!el) return;
      let v = velocityRef.current;
      if (Math.abs(v) < MIN_VELOCITY) { stopMomentum(); return; }
      const delta = Math.max(-MAX_TICK, Math.min(MAX_TICK, v));
      el.scrollLeft -= delta;
      handleLoopBoundaries();
      v *= FRICTION;
      velocityRef.current = v;
      momentumIdRef.current = requestAnimationFrame(step);
    };
    momentumIdRef.current = requestAnimationFrame(step);
  };

  const stopMomentum = () => {
    if (momentumIdRef.current) {
      cancelAnimationFrame(momentumIdRef.current);
      momentumIdRef.current = null;
    }
  };

  // ---------- BOUTONS ----------
  const scrollByCards = (dir: 'left' | 'right', count = 1) => {
    const el = containerRef.current;
    if (!el) return;
    stopMomentum();
    const stride = strideRef.current || measureStride();
    if (!stride) return;
    el.scrollBy({ left: (dir === 'left' ? -1 : 1) * stride * count, behavior: 'smooth' });
  };

  // ---------- DRAG ----------
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    pointerTypeRef.current = (e.pointerType as Pointer) || 'mouse';
    isPointerDownRef.current = true;
    dragActiveRef.current = false;
    didDragRef.current = false;
    dragStartXRef.current = e.clientX;
    startScrollLeftRef.current = el.scrollLeft;
    lastXRef.current = e.clientX;
    lastTRef.current = performance.now();
    velocityRef.current = 0;

    stopMomentum();
    restoreUserSelectRef.current = (document.body.style as any).userSelect || '';
    (document.body.style as any).userSelect = 'none';

    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    (el as any).__prevScrollBehavior = prev;

    el.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    const x = e.clientX;
    const moved = Math.abs(x - dragStartXRef.current);

    if (!dragActiveRef.current && moved >= DRAG_THRESHOLD_PX) {
      dragActiveRef.current = true;
      didDragRef.current = true;             // ✅ Patch #3
      el.classList.add('cursor-grabbing');
    }
    if (!dragActiveRef.current) return;

    const dx = x - dragStartXRef.current;
    el.scrollLeft = startScrollLeftRef.current - dx;

    const shift = handleLoopBoundaries();
    if (shift !== 0) startScrollLeftRef.current += shift;

    const now = performance.now();
    const dt = Math.max(1, now - lastTRef.current);
    const vx = (x - lastXRef.current) / dt;
    velocityRef.current = -vx * 16.7;
    lastXRef.current = x;
    lastTRef.current = now;

    e.preventDefault();
  };

  const endDrag = (e?: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    const el = containerRef.current;
    if (el && e) el.releasePointerCapture?.(e.pointerId);

    if (restoreUserSelectRef.current !== null) {
      (document.body.style as any).userSelect = restoreUserSelectRef.current;
      restoreUserSelectRef.current = null;
    }
    el?.classList.remove('cursor-grabbing');

    if (el && (el as any).__prevScrollBehavior != null) {
      el.style.scrollBehavior = (el as any).__prevScrollBehavior;
      (el as any).__prevScrollBehavior = null;
    }

    if (dragActiveRef.current && pointerTypeRef.current !== 'touch') startMomentum();

    // ✅ Patch #1
    dragActiveRef.current = false;
    didDragRef.current = false;
  };

  const onClickCapture = (e: React.MouseEvent) => {
    // ✅ Patch #3
    if (didDragRef.current) {
      e.stopPropagation();
      e.preventDefault();
      didDragRef.current = false;
    }
  };

  const preventImgDrag = (e: React.DragEvent) => e.preventDefault();

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
    stopMomentum();

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
          onClick={() => scrollByCards('left')}
          aria-label="Précédent"
          type="button"
          className="flex-shrink-0 p-0 sm:w-12 sm:h-12 flex items-center justify-center sm:rounded-full sm:bg-black/60 sm:border sm:border-white/30 text-white/60 sm:text-white hover:text-white hover:sm:bg-black/80 hover:sm:border-white/60 hover:scale-110 transition-all sm:shadow-lg"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        {/* Track */}
        <div
          ref={containerRef}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          onDragStart={preventImgDrag}
          onClickCapture={onClickCapture}
          className="flex-1 min-w-0 flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth cursor-grab overscroll-x-contain"
        >
          {items.map((atelier, index) => (
            <div
              key={`${atelier.nom}-${index}`}
              className="flex-shrink-0 w-[calc(100vw-5.5rem)] sm:w-[300px] bg-black text-white rounded shadow border border-white/20 select-none"
            >
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
                {atelier.description && (<p className="mb-2 text-justify">{atelier.description}</p>)}
                {atelier.objectifs && (
                  <p className="mb-2 text-justify">
                    <span className="font-bold">Objectifs :</span> {atelier.objectifs}
                  </p>
                )}
                {atelier.approche && (
                  <p className="mb-2 text-justify">
                    <span className="font-bold">Approche :</span> {atelier.approche}
                  </p>
                )}
                {atelier.deroulement && (
                  <p className="mb-2 text-justify">
                    <span className="font-bold">Possibilités de déroulement :</span> {atelier.deroulement}
                  </p>
                )}

                {atelier.pdf && (
                  <a
                    href={atelier.pdf}
                    onClick={(e) => { e.stopPropagation(); openPdf(e, atelier.pdf); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    rel="noopener"
                    className="text-blue-300 font-semibold underline relative z-10 pt-4 pb-4"
                  >
                    En savoir plus →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Flèche droite */}
        <button
          onClick={() => scrollByCards('right')}
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
