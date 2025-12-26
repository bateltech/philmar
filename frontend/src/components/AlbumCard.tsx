'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface AlbumCardProps {
  title: string;
  description: string;
  imageSrc: string;
  genre: string;
  forSale: boolean;
  purchaseLink: string;
  soundcloudLink: string;

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

  const soundcloudEmbedUrl = soundcloudLink
    ? `https://w.soundcloud.com/player/?url=${encodeURIComponent(
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
            <p className="text-xs sm:text-[0.875em] max-h-[7em] overflow-y-auto pr-1 scrollbar-transparent">
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
            {soundcloudLink && (
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

          {/* Player */}
          {isPlayerActive && soundcloudEmbedUrl && (
            <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-20">
              <div className="relative w-[90%] max-w-md">
                <button
                  onClick={onTogglePlayer}
                  className="absolute -top-8 right-0 text-white text-sm opacity-70 hover:opacity-100"
                >
                  ✕ fermer
                </button>

                <iframe
                  width="100%"
                  height="120"
                  allow="autoplay"
                  src={soundcloudEmbedUrl}
                  className="rounded"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlbumCard;
