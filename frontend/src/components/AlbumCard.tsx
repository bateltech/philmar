// components/AlbumCard.tsx
'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface AlbumCardProps {
  title: string;
  description: string;
  imageSrc: string;
  genre: string;
  forSale: boolean;
}

const AlbumCard = ({ title, description, imageSrc, genre, forSale }: AlbumCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Références pour mesurer la largeur du titre
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Mesure la largeur lorsque l’overlay apparaît
  useEffect(() => {
    if (hovered && titleRef.current) {
      const titleWidth = titleRef.current.scrollWidth;
      const TEN_REM_PX = 240; // 14 rem * 16 px (taille de base)
      setShouldAnimate(titleWidth > TEN_REM_PX);
    }
  }, [hovered, title]);


  return (
    <div
      className="group relative w-full aspect-square overflow-hidden shadow-lg transition-transform transform md:hover:scale-[1.03] max-w-full cursor-pointer 
      border border-transparent hover:border-white hover:border-opacity-80 focus-visible:border-white focus-visible:border-opacity-80"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShouldAnimate(false);
      }}
    >
      {/* Image */}
      <div className="w-full h-full relative">
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </div>

      {/* Hover Overlay with Scrollable Content */}
      {hovered && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-between p-3 sm:p-4 text-left text-white h-full overflow-hidden group-hover:opacity-100 opacity-0 transition-opacity">
          <div className="overflow-hidden flex-grow">
            {/* SCROLLING TITLE */}

            <div className="overflow-hidden w-full">
              <div className={`inline-block w-max will-change-transform ${ shouldAnimate ? 'group-hover:animate-marqueeMobile md:group-hover:animate-marqueeDesktop' : '' }`}>
                <h3
                  ref={titleRef}
                  className="text-sm sm:text-base font-bold mb-2 whitespace-nowrap pr-10"
                >
                  {title}
                </h3>
              </div>
            </div>



            {/* Description scrollable */}
            <p className="text-xs sm:text-[0.875em] max-h-[13em] md:max-h-[7em] sm:max-h-[10em] overflow-y-auto pr-1 scrollbar-transparent">
              {description}
            </p>
          </div>
          <div className="flex w-full space-x-3 sm:space-x-4 justify-end mt-2">
            <button
              className={`p-2 sm:p-3 rounded-full transition ${
                forSale ? 'bg-white bg-opacity-40 hover:bg-opacity-80' : 'bg-gray-400 bg-opacity-40 cursor-not-allowed'
              }`}
              disabled={!forSale}
            >
              <img src={forSale ? "/images/cart.svg" : "/images/no_cart.svg"} alt="Cart" className="w-6 h-6" />
            </button>
            <button className="p-2 bg-white bg-opacity-40 rounded-full hover:bg-opacity-80 transition">
              <img src="/images/triangle.svg" alt="Triangle" className="w-6 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumCard;
