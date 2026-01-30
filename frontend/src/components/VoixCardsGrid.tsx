'use client';
import { useEffect, useState } from 'react';
import VoixCard from './VoixCard';

interface VoixItem {
  type: 'stage' | 'atelier' | 'cours';
  title: string;
  image: string;
  description: string;
  details?: string;
  extra?: string;
}

export default function VoixCardsGrid() {
  const [data, setData] = useState<VoixItem[]>([]);
  const [filter, setFilter] = useState<'stage' | 'atelier' | 'cours'>('atelier');

  useEffect(() => {
    fetch('/data/voix_data.json')
      .then(res => res.json())
      .then(setData);
  }, []);

  const filtered = data.filter((item) => item.type === filter);

  return (
    <div className="w-full overflow-hidden">
      {/* Filter buttons */}
      <div className="flex flex-wrap justify-start ml-0 sm:ml-12 gap-2 sm:gap-4 mt-8 sm:mt-12 mb-4">
        {['stage', 'atelier', 'cours'].map((category) => (
          <button
            key={category}
            className={`border px-3 sm:px-6 py-2 uppercase text-xs sm:text-sm ${
              filter === category ? 'bg-blue-950 border-blue-950' : 'border-white'
            } text-white hover:bg-blue-950 transition`}
            onClick={() => setFilter(category as 'stage' | 'atelier' | 'cours')}
          >
            {category === 'stage' ? 'Stages' : category === 'atelier' ? 'Ateliers' : 'Cours'}
          </button>
        ))}
      </div>

      {/* Subtitle */}
      <p className="italic text-left ml-0 sm:ml-12 text-sm text-white mb-6 sm:mb-8 mt-6 sm:mt-8">
        {filter === 'stage' && '(Journée, weekend,...)'}
        {filter === 'atelier' && '(Ponctuel ou en série)'}
        {filter === 'cours' && '(Individuel ou régulier)'}
      </p>

      {/* Cards */}
      <div className="flex flex-wrap justify-start ml-0 sm:ml-6 gap-4 sm:gap-6 px-0 sm:px-6">
        {filtered.map((item, index) => (
          <VoixCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
