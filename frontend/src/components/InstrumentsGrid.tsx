'use client';

import { useEffect, useState } from 'react';

type Instrument = {
  nom: string;
  image: string; // ex: "/images/instruments/oud.jpg"
};

const InstrumentsGrid = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Charger depuis /public/data (pas d'import ESM)
  useEffect(() => {
    let alive = true;
    fetch('/data/instruments.json', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('Impossible de charger /data/instruments.json');
        return r.json();
      })
      .then((data: Instrument[]) => {
        if (!alive) return;
        setInstruments(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const instrumentsToShow = showAll ? instruments : instruments.slice(0, 8);

  if (loading) {
    return (
      <div className="text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full aspect-square rounded bg-white/10" />
              <div className="mt-2 h-4 w-2/3 mx-auto rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (instruments.length === 0) {
    return <p className="text-white/80 italic">Aucun instrument disponible.</p>;
  }

  return (
    <div className="text-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
        {instrumentsToShow.map((instrument, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={instrument.image}
              alt={instrument.nom}
              className="w-full aspect-square object-cover rounded shadow-md"
              loading="lazy"
            />
            <p className="mt-2 text-center italic text-sm">{instrument.nom}</p>
          </div>
        ))}
      </div>

      {!showAll && instruments.length > 8 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="text-white underline hover:text-gray-300"
          >
            Plus →
          </button>
        </div>
      )}
    </div>
  );
};

export default InstrumentsGrid;
