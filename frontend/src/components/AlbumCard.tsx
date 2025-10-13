// components/AlbumCard.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AlbumCardProps {
  title: string;
  description: string;
  imageSrc: string;
  genre: string;
  forSale: boolean;
}

const AlbumCard = ({ title, description, imageSrc, genre, forSale }: AlbumCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative w-full h-full aspect-square overflow-hidden shadow-lg transition-transform transform hover:scale-105"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="w-full h-full relative">
        <Image src={imageSrc} alt={title} layout="fill" objectFit="cover" />
      </div>

      {/* Hover Overlay with Scrollable Content */}
      {hovered && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-between p-4 text-left text-white h-full overflow-hidden">
          <div className="overflow-hidden">
            {/* SCROLLING TITLE */}
            <div className="overflow-hidden w-full">
              <div className="inline-block min-w-full group-hover:animate-marquee">
                <h3 className="text-lg font-bold mb-2 whitespace-nowrap w-max">
                  {title}
                </h3>
              </div>
            </div>

            {/* Description scrollable */}
            <p className="text-[0.875em] max-h-[10em] overflow-y-auto pr-1 scrollbar-transparent">
              {description}
            </p>
          </div>
          <div className="flex w-full space-x-4 justify-end mt-2">
            <button
              className={`p-2 rounded-full transition ${
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
