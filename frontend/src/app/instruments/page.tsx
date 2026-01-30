'use client';

import AtelierCarousel from '@/components/AtelierCarousel';
import InstrumentsGrid from '@/components/InstrumentsGrid';
import AvisSlider from '@/components/AvisSlider';

export default function Instruments() {
  return (
    <main className="bg-black text-white overflow-x-hidden">
      <section className="pt-8 sm:pt-12 px-3 sm:px-4 md:px-20 mt-2 sm:mt-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 mt-10 sm:mt-16 uppercase leading-tight">
          Ateliers découverte des instruments du monde
        </h2>
        <p className="text-center mt-6 sm:mt-8 mb-12 sm:mb-24 text-base sm:text-lg leading-relaxed px-2 sm:px-4 md:px-0">
          Animés par Philmar, ces ateliers interactifs mettent en valeur une grande diversité d&apos;instruments du monde à travers une approche artistique vivante mêlant expressivité, jeu vocal et maîtrise multi instrumentale.
        </p>
        <AtelierCarousel />
      </section>

      <section className="pt-12 sm:pt-20 px-3 sm:px-4 md:px-20">
        <h3 className="text-lg sm:text-xl font-semibold text-center mb-3 sm:mb-4 leading-tight px-2 sm:px-0">
          Liste des Instruments disponibles pour les Ateliers, Concerts, Expositions
        </h3>
        <p className="text-center italic mb-6 sm:mb-8 text-sm sm:text-base px-2 sm:px-0">
          Une centaine d&apos;instruments acoustiques traditionnels de tous les continents...
        </p>
        <InstrumentsGrid />
      </section>

      <section className="pt-12 sm:pt-20 px-3 sm:px-4 md:px-20 pb-16 sm:pb-28">
        <h3 className="text-lg sm:text-xl font-semibold text-center mb-6 sm:mb-8">Avis des participants</h3>
        <AvisSlider />
      </section>
    </main>
  );
}