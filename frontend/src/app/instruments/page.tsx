'use client';

import AtelierCarousel from '@/components/AtelierCarousel';
import InstrumentsGrid from '@/components/InstrumentsGrid';
import AvisSlider from '@/components/AvisSlider';

export default function Instruments() {
  return (
    <main className="bg-black text-white">
      <section className="pt-12 px-4 md:px-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 uppercase">
          Ateliers découverte des instruments du monde
        </h2>
        <p className="text-center max-w-3xl mx-auto text-sm md:text-base mb-10">
          Animés par Philmar, ces ateliers interactifs mettent en valeur une grande diversité d'instruments du monde à travers une approche artistique vivante mêlant expressivité, jeu vocal et maîtrise multi instrumentale.
        </p>
        <AtelierCarousel />
      </section>

      <section className="pt-20 px-4 md:px-20">
        <h3 className="text-xl font-semibold text-center mb-4">
          Liste des Instruments disponibles pour les Ateliers, Concerts, Expositions
        </h3>
        <p className="text-center italic mb-8">
          Une centaine d'instruments acoustiques traditionnels de tous les continents...
        </p>
        <InstrumentsGrid />
      </section>

      <section className="pt-20 px-4 md:px-20 pb-28">
        <h3 className="text-xl font-semibold text-center mb-8">Avis des participants</h3>
        <AvisSlider />
      </section>
    </main>
  );
}