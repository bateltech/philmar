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

  const encoded = encodeURIComponent(playlistUrl);
  const iframeSrc = `https://w.soundcloud.com/player/?url=${encoded}&visual=false&auto_play=false`;

  /* ---- Load SC API + create widget ---- */
  useEffect(() => {
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

      // Check readiness via getVolume
      const readyPoll = setInterval(() => {
        widget.getVolume(() => {
          console.log('[Vinyl] Widget READY');
          clearInterval(readyPoll);
          setWidgetReady(true);
          widget.setVolume(volume);
        });
      }, 500);
    }, 300);

    return () => clearInterval(initPoll);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    const w = widgetRef.current;
    if (!w) return;
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

      {/* Iframe quasi-invisible mais "visible" pour Chrome autoplay */}
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

      <div className="fixed top-20 right-4 z-50 flex flex-col items-center gap-2">
        {/* Vinyl disc */}
        <button
          onClick={handleToggle}
          className={`relative w-20 h-20 rounded-full cursor-pointer focus:outline-none vinyl-spinning${isPlaying ? '' : ' vinyl-paused'}`}
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
        >
          <img
            src="/images/vinyle.png"
            alt="Vinyl"
            className="w-full h-full rounded-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
            {isPlaying ? (
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
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
          className="vinyl-volume-slider w-20"
        />
      </div>
    </>
  );
}
