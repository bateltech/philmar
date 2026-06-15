'use client'
import FilterDropdown from '../../components/FilterDropdown';
import AlbumCard from '../../components/AlbumCard';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getContent } from '../../lib/content';

type SortMode = 'recent' | 'old' | 'alpha';

type AudioTrack = {
  src: string;
  title: string;
};

type Album = {
  title: string;
  imageSrc: string;
  genre: 'album' | 'enregistrement' | 'conte';
  year: number;
  forSale: boolean;
  description: string;
  purchaseLink: string;
  soundcloudLink: string;
  audioTracks?: AudioTrack[];
};

export default function Discographie () {
    const [selectedGenre, setSelectedGenre] = useState<'all' | 'album' | 'enregistrement' | 'conte'>('all');
    const [sortMode, setSortMode] = useState<SortMode>('recent');
    const [activePlayerId, setActivePlayerId] = useState<string | null>(null);

    const [albums, setAlbums] = useState<Album[]>([]);
    const [albumsLoaded, setAlbumsLoaded] = useState(false);
    useEffect(() => {
      getContent<Album[]>('discographie')
        .then((data) => {
          setAlbums(data);
          setAlbumsLoaded(true);
        })
        .catch(() => setAlbumsLoaded(true));
    }, []);

  return (
    <div className="min-h-screen bg-[length:100%_auto] bg-top bg-no-repeat" style={{ backgroundImage: "url('/images/sun_bg.png')" }}>
      <div className="container mx-auto py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-24 sm:mt-[8rem] mb-12 sm:mb-24 text-center sm:text-left sm:ml-12"
        >Discographie</motion.h1>
        
        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          className="flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-0 px-0 sm:px-6 lg:px-24"
        >
            <div className="flex flex-wrap justify-start sm:justify-center gap-3 mb-4 sm:mb-8">
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

            <div className="flex flex-wrap justify-start sm:justify-center gap-3 mb-4 sm:mb-8">
                {/* Dropdown */}
                <FilterDropdown value={sortMode} onChange={setSortMode} />
            </div>
        </motion.div>

        {/* Albums Grid */}
        <motion.div
          key={selectedGenre}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          gap-6 sm:gap-8 mt-8
          px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          initial="hidden"
          animate={albumsLoaded ? 'visible' : 'hidden'}
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
            .map((album) => (
              <motion.div
                key={album.title}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
                }}
              >
                <AlbumCard
                  title={album.title}
                  imageSrc={album.imageSrc}
                  genre={album.genre}
                  forSale={album.forSale}
                  description={album.description}
                  purchaseLink={album.purchaseLink}
                  soundcloudLink={album.soundcloudLink}
                  audioTracks={album.audioTracks}
                  isPlayerActive={activePlayerId === album.title}
                  onTogglePlayer={() =>
                    setActivePlayerId(
                      activePlayerId === album.title ? null : album.title
                    )
                  }
                />
              </motion.div>
            ))}
        </motion.div>

      </div>
    </div>
  );
};

