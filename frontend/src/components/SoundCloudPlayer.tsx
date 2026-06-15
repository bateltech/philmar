'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useDragControls,
} from 'framer-motion';

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type SoundCloudPlayerProps = {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
};

function isBandcampUrl(url: string) {
  return url.includes('bandcamp');
}

function isSpotifyUrl(url: string) {
  return url.includes('spotify');
}

function parseBandcampEmbed(input: string) {
  const srcMatch = input.match(/src=["']([^"']+)["']/);
  const widthMatch = input.match(/width:\s*(\d+)px/);
  const heightMatch = input.match(/height:\s*(\d+)px/);

  return {
    src: srcMatch ? srcMatch[1] : input,
    width: widthMatch ? parseInt(widthMatch[1]) : 350,
    height: heightMatch ? parseInt(heightMatch[1]) : 786,
  };
}

function parseSpotifyEmbed(input: string) {
  // Accepte une URL de partage OU un code iframe collé.
  const srcMatch = input.match(/src=["']([^"']+)["']/);
  let raw = (srcMatch ? srcMatch[1] : input).trim();

  // Retire un éventuel préfixe de langue (ex: /intl-fr/)
  raw = raw.replace(/open\.spotify\.com\/intl-[a-z]+\//, 'open.spotify.com/');

  // Transforme l'URL de partage en URL d'intégration
  if (!raw.includes('/embed/')) {
    raw = raw.replace('open.spotify.com/', 'open.spotify.com/embed/');
  }

  // Retire les paramètres de requête (ex: ?si=...)
  return raw.split('?')[0];
}

export default function SoundCloudPlayer({
  isOpen,
  onClose,
  url = 'https://soundcloud.com/philmarzic/sets/steppe-by-steppe',
}: SoundCloudPlayerProps) {
  const isBandcamp = isBandcampUrl(url);
  const isSpotify = isSpotifyUrl(url);
  // "widget" = lecteur SoundCloud natif (API volume, script SC).
  const isWidget = !isBandcamp && !isSpotify;
  const bcEmbed = isBandcamp ? parseBandcampEmbed(url) : null;
  const spotifySrc = isSpotify ? parseSpotifyEmbed(url) : '';

  // Dimensions du cadre desktop pour les lecteurs à taille fixe (Bandcamp/Spotify)
  const extWidth = 400;
  const extHeight = isBandcamp ? 450 : 352; // Spotify : 352px

  /* ===================== DESKTOP VOLUME (SoundCloud only) ===================== */
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window === 'undefined') return 100;
    const v = Number(localStorage.getItem('sc_volume'));
    return Number.isFinite(v) && v > 0 ? Math.min(100, v) : 100;
  });

  const toggleMute = () => {
    setVolume((v) => (v === 0 ? 60 : 0));
  };

  const volumeIcon =
    volume === 0 ? '🔇' : volume < 35 ? '🔈' : volume < 70 ? '🔉' : '🔊';

  /* ===================== DESKTOP POSITION ===================== */
  const [corner, setCorner] = useState<Corner>(() => {
    if (typeof window === 'undefined') return 'bottom-left';
    return (localStorage.getItem('sc_corner') as Corner) || 'bottom-left';
  });

  /* ===================== REFS / MOTION ===================== */
  const [apiReady, setApiReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragControls = useDragControls();

  /* ===================== SOUNDCLOUD DESKTOP INIT ===================== */
  useEffect(() => {
    if (!isWidget) return;
    const SC = (window as any)?.SC;
    if (!apiReady || !iframeRef.current || !SC?.Widget) return;

    widgetRef.current = SC.Widget(iframeRef.current);
    widgetRef.current.bind(SC.Widget.Events.READY, () => {
      widgetRef.current?.setVolume?.(volume);
    });
  }, [apiReady, isWidget]);

  useEffect(() => {
    if (!isWidget) return;
    if (widgetRef.current?.setVolume) {
      widgetRef.current.setVolume(volume);
      localStorage.setItem('sc_volume', String(volume));
    }
  }, [volume, isWidget]);

  /* ===================== DESKTOP SNAP ===================== */
  const handleDragEnd = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const wc = {
      'top-left': { x: rect.left, y: rect.top },
      'top-right': { x: rect.right, y: rect.top },
      'bottom-left': { x: rect.left, y: rect.bottom },
      'bottom-right': { x: rect.right, y: rect.bottom },
    };

    const sc = {
      'top-left': { x: 0, y: 0 },
      'top-right': { x: vw, y: 0 },
      'bottom-left': { x: 0, y: vh },
      'bottom-right': { x: vw, y: vh },
    };

    let best: Corner = corner;
    let min = Infinity;

    (Object.keys(wc) as Corner[]).forEach((c) => {
      const dx = wc[c].x - sc[c].x;
      const dy = wc[c].y - sc[c].y;
      const d = Math.hypot(dx, dy);
      if (d < min) {
        min = d;
        best = c;
      }
    });

    setCorner(best);
    localStorage.setItem('sc_corner', best);
    x.set(0);
    y.set(0);
  };

  const cornerClasses: Record<Corner, string> = {
    'top-left': 'top-6 left-6',
    'top-right': 'top-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-right': 'bottom-6 right-6',
  };

  /* ===================== IFRAME URLS ===================== */
  const encoded = encodeURIComponent(url);

  const desktopSrc = isBandcamp
    ? bcEmbed!.src
    : isSpotify
    ? spotifySrc
    : `https://w.soundcloud.com/player/?url=${encoded}&visual=false`;

  const mobileSrc = isBandcamp
    ? (() => {
        let src = bcEmbed!.src.replace(/\/?$/, '/');
        if (!src.includes('tracklist=')) src += 'tracklist=false/';
        if (!src.includes('artwork=')) src += 'artwork=small/';
        return src;
      })()
    : isSpotify
    ? spotifySrc
    : `https://w.soundcloud.com/player/?url=${encoded}&visual=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ===================== DESKTOP PLAYER ===================== */}
          <motion.div
            ref={containerRef}
            drag
            dragListener={false}
            dragControls={dragControls}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`
              hidden sm:block fixed z-50
              ${cornerClasses[corner]}
              ${isWidget ? 'w-[360px] h-[460px]' : ''}
              bg-white shadow-xl rounded-2xl border border-orange-300 overflow-hidden
            `}
            style={
              isWidget
                ? { x, y }
                : { x, y, width: extWidth, height: extHeight + 32 }
            }
          >
            {/* Drag bar */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="h-8 cursor-move flex items-center justify-center bg-orange-100 border-b text-xs text-orange-700 select-none"
            >
              Drag & Drop Me
            </div>

            {isWidget && (
              <Script
                src="https://w.soundcloud.com/player/api.js"
                strategy="afterInteractive"
                onLoad={() => setApiReady(true)}
              />
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-1 right-1 z-20 w-7 h-7 rounded-xl bg-red-600 text-white font-bold"
            >
              &times;
            </button>

            {/* ===== VOLUME CONTROLS (SoundCloud only) ===== */}
            {isWidget && (
              <div className="mt-2 px-3 pb-2 border-b bg-white/40 backdrop-blur-md relative z-10">
                <div className="flex items-center gap-3 rounded-full px-3 py-2 bg-white/70 shadow-sm border">
                  <button
                    onClick={toggleMute}
                    className="text-base leading-none px-2 py-1 rounded-full hover:bg-white/60 transition"
                    aria-label={volume === 0 ? 'Rétablir le son' : 'Couper le son'}
                  >
                    {volumeIcon}
                  </button>

                  <div className="flex-1 flex items-center">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      aria-label="Volume"
                      className="volume-slider w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Desktop iframe */}
            <iframe
              ref={isWidget ? iframeRef : undefined}
              width={isWidget ? '100%' : extWidth}
              height={isWidget ? '100%' : extHeight}
              allow="autoplay; encrypted-media"
              scrolling="no"
              frameBorder="no"
              src={desktopSrc}
              style={isWidget ? undefined : { border: 0 }}
              {...(isBandcamp ? { seamless: true } : {})}
            />
          </motion.div>

          {/* ===================== MOBILE MINI PLAYER ===================== */}
          <motion.div
            className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#181818] border-t border-white/10"
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
          >
            <iframe
              title="Mini Player"
              className="pt-10 bg-white"
              width="100%"
              height={isBandcamp ? '160' : isSpotify ? '152' : '150'}
              allow="autoplay; encrypted-media"
              scrolling="no"
              frameBorder="no"
              src={mobileSrc}
              style={isWidget ? undefined : { border: 0 }}
              {...(isBandcamp ? { seamless: true } : {})}
            />

            <button
              onClick={onClose}
              className="absolute top-1 right-1 z-20 w-7 h-7 rounded-xl bg-red-600 text-white text-lg font-bold"
            >
              ×
            </button>
          </motion.div>

          {/* ===== Slider styles ===== */}
          <style jsx global>{`
            .volume-slider {
              -webkit-appearance: none;
              appearance: none;
              height: 6px;
              border-radius: 9999px;
              background: linear-gradient(
                90deg,
                rgba(255, 85, 0, 0.9) 0%,
                rgba(255, 136, 0, 0.9) 40%,
                rgba(255, 195, 0, 0.9) 100%
              );
              outline: none;
            }
            .volume-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 9999px;
              background: #fff;
              border: 2px solid rgba(255, 128, 0, 0.9);
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
              cursor: pointer;
            }
            .volume-slider::-moz-range-thumb {
              width: 16px;
              height: 16px;
              border-radius: 9999px;
              background: #fff;
              border: 2px solid rgba(255, 128, 0, 0.9);
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
              cursor: pointer;
            }
            .volume-slider::-moz-range-track {
              height: 6px;
              border-radius: 9999px;
              background: linear-gradient(
                90deg,
                rgba(255, 85, 0, 0.9) 0%,
                rgba(255, 136, 0, 0.9) 40%,
                rgba(255, 195, 0, 0.9) 100%
              );
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
