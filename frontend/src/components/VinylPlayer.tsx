'use client';

import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '@/lib/player-context';

export default function VinylPlayer() {
  const {
    playlistUrl,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
  } = usePlayer();

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<any>(null);
  const [widgetReady, setWidgetReady] = useState(false);
  /**
   * SoundCloud (et ses cookies) n'est chargé qu'au premier clic sur lecture,
   * pour ne rien déposer chez le visiteur sans action de sa part (règles CNIL).
   */
  const [activated, setActivated] = useState(false);
  const pendingPlay = useRef(false);

  /* ---- Mobile tuck (half-hidden to the right) ---- */
  const [tucked, setTucked] = useState(true);
  const tuckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTuckTimer = () => {
    if (tuckTimer.current) { clearTimeout(tuckTimer.current); tuckTimer.current = null; }
  };

  const startTuckTimer = () => {
    clearTuckTimer();
    tuckTimer.current = setTimeout(() => setTucked(true), 5000);
  };

  // Un seul clic suffit : il lance/arrête la musique et sort le disque s'il était rangé (mobile)
  const handleTap = () => {
    if (tucked) setTucked(false);
    handleToggle();
    startTuckTimer();
  };

  useEffect(() => () => clearTuckTimer(), []);

  const encoded = encodeURIComponent(playlistUrl);
  // L'iframe n'est créée qu'au clic de l'utilisateur : on peut donc demander la lecture
  // automatique, autorisée par le navigateur puisqu'elle suit une action du visiteur.
  const iframeSrc = `https://w.soundcloud.com/player/?url=${encoded}&visual=false&auto_play=true`;

  /* ---- Load SC API + create widget (uniquement après le premier clic) ---- */
  useEffect(() => {
    if (!activated) return;
    // Load script
    if (!(window as any)?.SC?.Widget) {
      if (!document.querySelector('script[src="https://w.soundcloud.com/player/api.js"]')) {
        const s = document.createElement('script');
        s.src = 'https://w.soundcloud.com/player/api.js';
        s.async = true;
        document.body.appendChild(s);
      }
    }

    // Poll until SC API + iframe ready, create widget once
    const initPoll = setInterval(() => {
      const SC = (window as any)?.SC;
      if (!SC?.Widget || !iframeRef.current || widgetRef.current) {
        if (widgetRef.current) clearInterval(initPoll);
        return;
      }

      console.log('[Vinyl] Creating widget');
      const widget = SC.Widget(iframeRef.current);
      widgetRef.current = widget;
      clearInterval(initPoll);

      // Check readiness via getVolume (plusieurs réponses peuvent arriver : on ne traite que la première)
      let ready = false;
      const readyPoll = setInterval(() => {
        widget.getVolume(() => {
          if (ready) return;
          ready = true;
          console.log('[Vinyl] Widget READY');
          clearInterval(readyPoll);
          setWidgetReady(true);
          widget.setVolume(volume);
          // Lance la lecture demandée par le clic qui a chargé le lecteur.
          // Le widget peut ignorer le premier play() tant que la playlist n'est pas
          // chargée : on réessaie jusqu'à ce que la lecture ait vraiment démarré.
          if (pendingPlay.current) ensurePlaying(widget, 10);
        });
      }, 500);
    }, 300);

    return () => clearInterval(initPoll);
  }, [activated]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Relance play() jusqu'à ce que SoundCloud confirme la lecture (max `tries` essais). */
  const ensurePlaying = (widget: any, tries: number) => {
    widget.isPaused((paused: boolean) => {
      if (!pendingPlay.current) return;
      if (!paused) {
        pendingPlay.current = false;
        setIsPlaying(true);
        return;
      }
      if (tries <= 0) {
        pendingPlay.current = false;
        return;
      }
      widget.play();
      setTimeout(() => ensurePlaying(widget, tries - 1), 700);
    });
  };

  /* ---- Poll play state from widget every 500ms ---- */
  useEffect(() => {
    if (!widgetReady) return;

    const statePoll = setInterval(() => {
      const w = widgetRef.current;
      if (!w) return;
      w.isPaused((paused: boolean) => {
        setIsPlaying(!paused);
      });
    }, 500);

    return () => clearInterval(statePoll);
  }, [widgetReady, setIsPlaying]);

  /* ---- Sync volume ---- */
  useEffect(() => {
    if (widgetReady && widgetRef.current?.setVolume) {
      widgetRef.current.setVolume(volume);
    }
  }, [volume, widgetReady]);

  /* ---- Toggle play/pause (uses SC state, not React state) ---- */
  const handleToggle = () => {
    if (!activated) {
      console.log('[Vinyl] Premier clic : chargement du lecteur et lecture automatique');
      pendingPlay.current = true;
      setActivated(true);
      return;
    }
    const w = widgetRef.current;
    if (!w || !widgetReady) return; // lecteur encore en chargement
    // Un clic pendant le démarrage automatique = l'utilisateur veut arrêter
    if (pendingPlay.current) {
      pendingPlay.current = false;
      w.pause();
      return;
    }
    // Ask SC player its actual state, then toggle
    w.isPaused((paused: boolean) => {
      console.log('[Vinyl] toggle — SC isPaused:', paused);
      if (paused) {
        w.play();
      } else {
        w.pause();
      }
    });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .vinyl-spinning {
          animation: vinyl-spin 3s linear infinite;
        }
        .vinyl-paused {
          animation-play-state: paused !important;
        }
      `}} />

      {/* Iframe quasi-invisible mais "visible" pour Chrome autoplay — créée seulement après le premier clic */}
      {activated && (
      <iframe
        ref={iframeRef}
        title="SoundCloud Vinyl Audio"
        width="300"
        height="166"
        allow="autoplay; encrypted-media"
        scrolling="no"
        frameBorder="no"
        src={iframeSrc}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          opacity: 0.01,
          pointerEvents: 'none',
          zIndex: -1,
        }}
        aria-hidden="true"
      />
      )}

      <div
        className={`fixed top-20 right-4 z-40 flex flex-col items-center gap-2 transition-transform duration-500 ease-in-out ${tucked ? 'translate-x-[52px] sm:translate-x-0' : 'translate-x-0'}`}
      >
        {/* Vinyl disc */}
        <button
          onClick={handleTap}
          className={`relative w-20 h-20 rounded-full cursor-pointer focus:outline-none vinyl-spinning${isPlaying ? '' : ' vinyl-paused'}`}
          aria-label={isPlaying ? 'Mettre en pause la musique de Philmar' : 'Écouter la musique de Philmar (lecteur SoundCloud)'}
          title={activated ? undefined : 'Écouter — le lecteur SoundCloud se charge au clic'}
        >
          <img
            src="/images/vinyle.png"
            alt=""
            className="w-full h-full rounded-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
            {activated && !widgetReady ? (
              // Chargement du lecteur SoundCloud après le premier clic
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" className="drop-shadow-lg">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" className="drop-shadow-lg">
                <polygon points="8,4 20,12 8,20" />
              </svg>
            )}
          </div>
        </button>

        {/* Volume slider */}
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => { setVolume(Number(e.target.value)); startTuckTimer(); }}
          aria-label="Volume"
          className={`vinyl-volume-slider w-20 transition-opacity duration-500 ${tucked ? 'sm:opacity-100 opacity-0 pointer-events-none sm:pointer-events-auto' : 'opacity-100 pointer-events-auto'}`}
        />
      </div>
    </>
  );
}
