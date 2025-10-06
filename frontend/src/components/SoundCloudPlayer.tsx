'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { AnimatePresence, motion } from 'framer-motion';

type SoundCloudPlayerProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Playlist/track URL SoundCloud. Par défaut, votre playlist actuelle. */
  url?: string;
};

export default function SoundCloudPlayer({
  isOpen,
  onClose,
  url = 'https://soundcloud.com/philmarzic/sets/steppe-by-steppe',
}: SoundCloudPlayerProps) {
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window === 'undefined') return 80;
    const v = Number(localStorage.getItem('sc_volume'));
    return Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : 80;
  });

  const [apiReady, setApiReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<any>(null);

  // Init du widget quand l'API est prête
  useEffect(() => {
    const SC = (window as any)?.SC;
    if (!apiReady || !iframeRef.current || !SC?.Widget) return;

    widgetRef.current = SC.Widget(iframeRef.current);
    widgetRef.current.bind(SC.Widget.Events.READY, () => {
      if (typeof widgetRef.current.setVolume === 'function') {
        widgetRef.current.setVolume(volume);
      }
    });
  }, [apiReady, volume]);

  // Appliquer le volume à chaque changement + persister
  useEffect(() => {
    if (widgetRef.current && typeof widgetRef.current.setVolume === 'function') {
      widgetRef.current.setVolume(volume);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sc_volume', String(volume));
      }
    }
  }, [volume]);

  const toggleMute = () => {
    setVolume((v) => (v === 0 ? 60 : 0));
  };

  const encoded = encodeURIComponent(url);
  const volumeIcon = volume === 0 ? '🔇' : volume < 35 ? '🔈' : volume < 70 ? '🔉' : '🔊';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="player"
          initial={{ opacity: 0, x: -100, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: 100 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 left-6 z-50 w-[360px] h-[460px] bg-white shadow-xl rounded-2xl border border-orange-300 overflow-hidden"
        >
          {/* API SoundCloud Widget */}
          <Script
            src="https://w.soundcloud.com/player/api.js"
            strategy="afterInteractive"
            onLoad={() => setApiReady(true)}
          />

          {/* Close button (z-20 pour passer au-dessus du contrôleur) */}
          <button
            onClick={onClose}
            className="absolute top-1 right-1 z-20 text-white flex items-center justify-center pb-[5px] text-lg font-bold rounded-xl w-7 h-7 bg-red-600 hover:bg-white hover:text-red-600 hover:border hover:border-red-600"
            aria-label="Fermer"
          >
            &times;
          </button>

          {/* Contrôleur volume – décalé vers le bas (mt-8) pour ne pas chevaucher le X */}
          <div className="mt-8 px-3 pb-2 border-b bg-white/40 backdrop-blur-md relative z-10">
            <div className="flex items-center gap-3 rounded-full px-3 py-2 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/40 shadow-sm border">
              <button
                onClick={toggleMute}
                className="text-base leading-none px-2 py-1 rounded-full hover:bg-white/60 transition"
                aria-label={volume === 0 ? 'Rétablir le son' : 'Couper le son'}
                title={volume === 0 ? 'Rétablir le son' : 'Couper le son'}
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

          {/* Widget SoundCloud AVEC liste des pistes (visual=false) */}
          <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            allow="autoplay"
            title="SoundCloud Player"
            scrolling="no"
            frameBorder="no"
            src={`https://w.soundcloud.com/player/?url=${encoded}&color=%23ff5500&auto_play=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false&show_playcount=true&show_artwork=true`}
          />

          {/* Styles personnalisés du slider */}
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
              transition: transform 0.12s ease;
            }
            .volume-slider:active::-webkit-slider-thumb {
              transform: scale(1.05);
            }
            .volume-slider::-moz-range-thumb {
              width: 16px;
              height: 16px;
              border-radius: 9999px;
              background: #fff;
              border: 2px solid rgba(255, 128, 0, 0.9);
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
              cursor: pointer;
              transition: transform 0.12s ease;
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
