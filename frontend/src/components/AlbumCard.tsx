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
      className="relative w-[250px] md:w-[300px] h-[250px] md:h-[300px] overflow-hidden shadow-lg transition-transform transform hover:scale-110"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={imageSrc}
        alt={title}
        layout="fill"
        objectFit="cover"
      />

      {/* Hover Overlay with Scrollable Content */}
      {hovered && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-between p-4 text-left text-white h-full overflow-y-auto scrollbar-thin">
          <div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-[0.875em] text-justify">{description}</p>
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
