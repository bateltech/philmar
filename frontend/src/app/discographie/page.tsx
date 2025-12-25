'use client'
import FilterDropdown from '../../components/FilterDropdown';
import AlbumCard from '../../components/AlbumCard';
import { useState, useEffect } from 'react';

type SortMode = 'recent' | 'old' | 'alpha';

type Album = {
  title: string;
  imageSrc: string;
  genre: 'album' | 'enregistrement' | 'conte';
  year: number;
  forSale: boolean;
  description: string;
};

export default function Discographie () {
    const [selectedGenre, setSelectedGenre] = useState<'all' | 'album' | 'enregistrement' | 'conte'>('all');
    const [sortMode, setSortMode] = useState<SortMode>('recent');

    const [albums, setAlbums] = useState<Album[]>([]);
    useEffect(() => {
      fetch('/data/discographie.json')
        .then((res) => res.json())
        .then(setAlbums);
    }, []);

  return (
    <div className="min-h-screen bg-[length:100%_auto] bg-top bg-no-repeat" style={{ backgroundImage: "url('/images/sun_bg.png')" }}>
      <div className="container mx-auto py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-24 sm:mt-[8rem] mb-12 sm:mb-24 text-center sm:text-left sm:ml-12">Discographie</h1>
        
        {/* Filter Buttons */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-0 px-0 sm:px-6 lg:px-24">
            <div className="flex flex-wrap justify-center gap-3 mb-4 sm:mb-8">
                <button
                onClick={() => setSelectedGenre('all')}
                className={`px-4 sm:px-6 py-2 ${selectedGenre === 'all' ? 'bg-blue-950 border border-blue-950' : 'border border-white'}  text-white cursor-pointer hover:bg-blue-950 border hover:border-blue-950`}
                >
                Tout
                </button>
                <button
                onClick={() => setSelectedGenre('album')}
                className={`px-4 sm:px-6 py-2 ${selectedGenre === 'album' ? 'bg-blue-950 border border-blue-950' : 'border border-white'}  text-white cursor-pointer hover:bg-blue-950 border hover:border-blue-950`}
                >
                Albums
                </button>
                <button
                onClick={() => setSelectedGenre('enregistrement')}
                className={`px-4 sm:px-6 py-2 ${selectedGenre === 'enregistrement' ? 'bg-blue-950 border border-blue-950' : 'border border-white'}  text-white cursor-pointer hover:bg-blue-950 border hover:border-blue-950`}
                >
                Enregistrements
                </button>
                <button
                onClick={() => setSelectedGenre('conte')}
                className={`px-4 sm:px-6 py-2 ${selectedGenre === 'conte' ? 'bg-blue-950 border border-blue-950' : 'border border-white'}  text-white cursor-pointer hover:bg-blue-950 border hover:border-blue-950`}
                >
                Contes
                </button>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-4 sm:mb-8">
                {/* Dropdown */}
                <FilterDropdown value={sortMode} onChange={setSortMode} />
            </div>
        </div>

        {/* Albums Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          gap-6 sm:gap-8 mt-8
          px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32"
        >
          {albums
            .filter(
              (album) =>
                selectedGenre === 'all' || album.genre === selectedGenre
            )
            .sort((a, b) => {
              if (sortMode === 'recent') return b.year - a.year;
              if (sortMode === 'old') return a.year - b.year;
              if (sortMode === 'alpha') return a.title.localeCompare(b.title);
              return 0;
            })
            .map((album, index) => (
              <AlbumCard
                key={index}
                title={album.title}
                imageSrc={album.imageSrc}
                genre={album.genre}
                forSale={album.forSale}
                description={album.description}
              />
            ))}
        </div>

      </div>
    </div>
  );
};

