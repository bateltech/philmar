'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface AudioTrack {
  src: string;
  title: string;
}

interface AlbumCardProps {
  title: string;
  description: string;
  imageSrc: string;
  genre: string;
  forSale: boolean;
  purchaseLink: string;
  soundcloudLink: string;
  audioTracks?: AudioTrack[];

  isPlayerActive: boolean;
  onTogglePlayer: () => void;
}

const AlbumCard = ({
  title,
  description,
  imageSrc,
  forSale,
  purchaseLink,
  soundcloudLink,
  audioTracks,
  isPlayerActive,
  onTogglePlayer,
}: AlbumCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const titleRef = useRef<HTMLHeadingElement>(null);

  // overlay visible si hover OU player actif
  const overlayVisible = hovered || isPlayerActive;

  useEffect(() => {
    if (overlayVisible && titleRef.current) {
      const titleWidth = titleRef.current.scrollWidth;
      const TEN_REM_PX = 240;
      setShouldAnimate(titleWidth > TEN_REM_PX);
    }
  }, [overlayVisible, title]);

  const isBandcamp = soundcloudLink?.includes('bandcamp') ?? false;
  const isSpotify = soundcloudLink?.includes('spotify') ?? false;
  const hasAudio = (audioTracks?.length ?? 0) > 0;
  // Le lecteur MP3 sert de secours uniquement si aucun lien d'écoute n'est renseigné
  const useMp3Player = !soundcloudLink && hasAudio;

  // Parse Bandcamp: accepte un code <iframe> complet ou juste l'URL embed
  const parseBandcampSrc = (input: string) => {
    const srcMatch = input.match(/src=["']([^"']+)["']/);
    let src = srcMatch ? srcMatch[1] : input;
    // Forcer size=large
    src = src.replace(/\/size=[^/]*\//, '/size=large/');
    if (!src.includes('size=')) src = src.replace(/\/?$/, '/size=large/');
    return src;
  };

  // Parse Spotify: accepte une URL de partage ou un code <iframe> collé
  const parseSpotifySrc = (input: string) => {
    const srcMatch = input.match(/src=["']([^"']+)["']/);
    let src = (srcMatch ? srcMatch[1] : input).trim();
    src = src.replace(/open\.spotify\.com\/intl-[a-z]+\//, 'open.spotify.com/');
    if (!src.includes('/embed/')) {
      src = src.replace('open.spotify.com/', 'open.spotify.com/embed/');
    }
    return src.split('?')[0];
  };

  const embedUrl = soundcloudLink
    ? isBandcamp
      ? parseBandcampSrc(soundcloudLink)
      : isSpotify
      ? parseSpotifySrc(soundcloudLink)
      : `https://w.soundcloud.com/player/?url=${encodeURIComponent(
          soundcloudLink
        )}&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false`
    : null;

  return (
    <div
      className="group relative w-full aspect-square overflow-hidden shadow-lg transition-transform md:hover:scale-[1.03]
      border border-transparent hover:border-white hover:border-opacity-80"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="w-full h-full relative">
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </div>

      {/* Overlay */}
      {overlayVisible && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-between p-4 text-white z-10">
          <div className="overflow-hidden flex-grow">
            {/* Title */}
            <div className="overflow-hidden w-full">
              <div
                className={`inline-block w-max ${
                  shouldAnimate
                    ? 'animate-marqueeMobile md:animate-marqueeDesktop'
                    : ''
                }`}
              >
                <h3
                  ref={titleRef}
                  className="text-sm sm:text-base font-bold mb-2 whitespace-nowrap pr-10"
                >
                  {title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-[0.875em] max-h-[7.5em] overflow-y-auto pr-1 scrollbar-transparent whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-3">
            {/* Buy */}
            {forSale && purchaseLink ? (
              <a
                href={purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white bg-opacity-40 hover:bg-opacity-80"
              >
                <img src="/images/cart.svg" className="w-6 h-6" />
              </a>
            ) : (
              <div className="p-2 rounded-full bg-gray-400 bg-opacity-40 cursor-not-allowed">
                <img src="/images/no_cart.svg" className="w-6 h-6" />
              </div>
            )}

            {/* Play */}
            {(soundcloudLink || hasAudio) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePlayer();
                }}
                className={`p-2 rounded-full transition ${
                  isPlayerActive
                    ? 'bg-white bg-opacity-90'
                    : 'bg-white bg-opacity-40 hover:bg-opacity-80'
                }`}
              >
                <img src="/images/triangle.svg" className="w-6 h-5" />
              </button>
            )}
          </div>

          {/* Player SoundCloud / Bandcamp : mini-lecteur dans la carte */}
          {isPlayerActive && embedUrl && !isSpotify && (
            <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-20">
              <div className="relative w-[95%] max-w-md">
                <button
                  onClick={onTogglePlayer}
                  className="absolute -top-8 right-0 text-white text-sm opacity-70 hover:opacity-100"
                >
                  ✕ fermer
                </button>

                <iframe
                  width={isBandcamp ? '80%' : '100%'}
                  height={isBandcamp ? '150' : '120'}
                  allow="autoplay; encrypted-media"
                  src={embedUrl}
                  className="rounded"
                  style={isBandcamp ? { border: 0, display: 'block', margin: '0 auto' } : undefined}
                  {...(isBandcamp ? { seamless: true } : {})}
                />
              </div>
            </div>
          )}

          {/* Lecteur MP3 (fallback sans lien d'écoute) */}
          {isPlayerActive && useMp3Player && (
            <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-20 p-4">
              <div className="relative w-full">
                <button
                  onClick={onTogglePlayer}
                  className="absolute -top-6 right-0 text-white text-sm opacity-70 hover:opacity-100"
                >
                  ✕ fermer
                </button>
                <Mp3Player tracks={audioTracks!} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Player Spotify : fenêtre modale centrée (taille naturelle ~352px) */}
      {isPlayerActive &&
        embedUrl &&
        isSpotify &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
            onClick={onTogglePlayer}
          >
            <div
              className="relative w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onTogglePlayer}
                className="absolute -top-8 right-0 text-white text-sm opacity-70 hover:opacity-100"
              >
                ✕ fermer
              </button>

              <iframe
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                src={embedUrl}
                className="rounded-xl"
                style={{ border: 0 }}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

/* ===================== LECTEUR MP3 SÉQUENTIEL ===================== */
const formatTime = (s: number) => {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const Mp3Player = ({ tracks }: { tracks: AudioTrack[] }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window === 'undefined') return 50;
    const stored = localStorage.getItem('mp3_volume');
    const v = Number(stored);
    return stored !== null && Number.isFinite(v) && v >= 0 ? Math.min(100, v) : 50;
  });

  const current = tracks[index];

  // Charge et lance le morceau courant à chaque changement d'index
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.play().catch(() => setIsPlaying(false));
  }, [index]);

  // Applique le volume à l'élément audio et mémorise le réglage
  useEffect(() => {
    const a = audioRef.current;
    if (a) a.volume = volume / 100;
    localStorage.setItem('mp3_volume', String(volume));
  }, [volume, index]);

  const toggleMute = () => setVolume((v) => (v === 0 ? 60 : 0));
  const volumeIcon = volume === 0 ? '🔇' : volume < 35 ? '🔈' : volume < 70 ? '🔉' : '🔊';

  const handleEnded = () => {
    // Passe au morceau suivant ; s'arrête après le dernier
    setIndex((i) => (i < tracks.length - 1 ? i + 1 : i));
    if (index >= tracks.length - 1) setIsPlaying(false);
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  const goTo = (i: number) => {
    if (i < 0 || i >= tracks.length) return;
    setIndex(i);
  };

  const seek = (value: number) => {
    const a = audioRef.current;
    if (!a || !Number.isFinite(a.duration)) return;
    a.currentTime = (value / 100) * a.duration;
  };

  return (
    <div className="w-full rounded-xl bg-neutral-900/90 p-4 text-white shadow-lg">
      <audio
        ref={audioRef}
        src={current.src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
          setDuration(a.duration || 0);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
      />

      {/* Titre + n° de piste */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold" title={current.title}>
          {current.title || `Piste ${index + 1}`}
        </p>
        {tracks.length > 1 && (
          <span className="shrink-0 text-xs text-white/60">
            {index + 1} / {tracks.length}
          </span>
        )}
      </div>

      {/* Barre de progression */}
      <input
        type="range"
        min={0}
        max={100}
        value={progress}
        onChange={(e) => seek(Number(e.target.value))}
        aria-label="Progression"
        className="mp3-progress w-full"
      />
      <div className="mt-1 flex justify-between text-[11px] text-white/60">
        <span>{formatTime((progress / 100) * duration)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Contrôles */}
      <div className="mt-2 flex items-center justify-center gap-6">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="text-2xl disabled:opacity-30"
          aria-label="Précédent"
        >
          ⏮
        </button>
        <button
          onClick={togglePlay}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-black"
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
        >
          {isPlaying ? '❚❚' : '►'}
        </button>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index === tracks.length - 1}
          className="text-2xl disabled:opacity-30"
          aria-label="Suivant"
        >
          ⏭
        </button>
      </div>

      {/* Volume */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="text-base leading-none"
          aria-label={volume === 0 ? 'Rétablir le son' : 'Couper le son'}
        >
          {volumeIcon}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
          className="mp3-progress flex-1"
        />
      </div>

      <style jsx>{`
        .mp3-progress {
          -webkit-appearance: none;
          appearance: none;
          height: 5px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.25);
          outline: none;
          cursor: pointer;
        }
        .mp3-progress::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 13px;
          height: 13px;
          border-radius: 9999px;
          background: #fff;
        }
        .mp3-progress::-moz-range-thumb {
          width: 13px;
          height: 13px;
          border: 0;
          border-radius: 9999px;
          background: #fff;
        }
      `}</style>
    </div>
  );
};

export default AlbumCard;
