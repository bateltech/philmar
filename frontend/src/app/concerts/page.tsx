'use client';

import { useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Concert = {
  title: string;
  description: string;
  image: string;
  link: string;
};

export default function Concerts() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Carrousel - utilise des refs pour éviter les problèmes de synchronisation React/DOM
  const carouselRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const [itemsPerView, setItemsPerView] = useState(4);
  const cloneCount = 4;

  // Détecte la taille de l'écran pour ajuster le nombre d'items visibles
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const concertsRes = await fetch('/data/concerts.json');
        const concertsData = await concertsRes.json();

        const galleryRes = await fetch('/data/galerie.json');
        const galleryData = await galleryRes.json();

        setConcerts(concertsData);
        setGalleryImages(galleryData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScrollToRecents = () => {
    const recentsSection = document.getElementById('recents');
    if (recentsSection) {
      recentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getExtendedConcerts = useCallback(() => {
    if (concerts.length === 0) return [];
    const clonesBefore = concerts.slice(-cloneCount);
    const clonesAfter = concerts.slice(0, cloneCount);
    return [...clonesBefore, ...concerts, ...clonesAfter];
  }, [concerts, cloneCount]);

  // Calcule et applique directement le transform sur le DOM
  const applyTransform = useCallback((index: number, animate: boolean) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const totalIndex = index + cloneCount;
    const itemWidth = 100 / itemsPerView;
    const gapPx = itemsPerView === 1 ? 0 : 6;
    const transform = `calc(-${totalIndex * itemWidth}% - ${totalIndex * gapPx}px)`;

    if (!animate) {
      carousel.style.transition = 'none';
    }

    carousel.style.transform = `translateX(${transform})`;

    if (!animate) {
      // Force reflow pour appliquer immédiatement
      void carousel.offsetHeight;
      carousel.style.transition = 'transform 500ms ease-in-out';
    }
  }, [cloneCount, itemsPerView]);

  // Navigation
  const goToNext = useCallback(() => {
    if (isAnimatingRef.current || concerts.length === 0) return;
    isAnimatingRef.current = true;
    indexRef.current += 1;
    applyTransform(indexRef.current, true);
  }, [concerts.length, applyTransform]);

  const goToPrev = useCallback(() => {
    if (isAnimatingRef.current || concerts.length === 0) return;
    isAnimatingRef.current = true;
    indexRef.current -= 1;
    applyTransform(indexRef.current, true);
  }, [concerts.length, applyTransform]);

  // Gestion de la boucle infinie
  const handleTransitionEnd = useCallback(() => {
    isAnimatingRef.current = false;

    if (concerts.length === 0) return;

    // Si on dépasse la fin, saut instantané au début
    if (indexRef.current >= concerts.length) {
      indexRef.current = indexRef.current - concerts.length;
      applyTransform(indexRef.current, false);
    }
    // Si on dépasse le début, saut instantané à la fin
    else if (indexRef.current < 0) {
      indexRef.current = indexRef.current + concerts.length;
      applyTransform(indexRef.current, false);
    }
  }, [concerts.length, applyTransform]);

  // Applique la position initiale après le chargement des concerts ou changement de taille
  useLayoutEffect(() => {
    if (concerts.length > 0 && carouselRef.current) {
      applyTransform(indexRef.current, false);
    }
  }, [concerts.length, applyTransform, itemsPerView]);

  return (
    <div className="text-white bg-black overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 py-16 sm:py-0">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <Image
            src="/images/concerts/concert-hero.png"
            alt="Concerts"
            layout="fill"
            objectFit="cover"
            className="absolute z-0"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        {/* Contenu de la Hero Section */}
        <div className="relative z-10 max-w-6xl text-white px-2 sm:px-4">
          {/* Titre principal */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mt-12 sm:mt-18 mb-6 sm:mb-8">Concerts</h1>

          {/* Texte de description */}
          <p className="mt-6 sm:mt-8 mb-12 sm:mb-24 text-base sm:text-lg leading-relaxed px-2 sm:px-4 md:px-0">
            Philmar participe à divers événements, concerts, mais aussi vernissages ou conférences, grâce à son expérience,
            son talent d&apos;improvisation et son interactivité. En solo ou avec son collectif, il propose une musique festive ou
            d&apos;ambiance, qui peut être liée à un thème ou une région du monde. Selon le projet, il peut s&apos;entourer de musiciens
            expérimentés. En lien avec des réseaux d&apos;artistes, il est possible de donner des prestations artistiques complémentaires
            à la musique de Philmar, telles que le théâtre, la danse ou les arts plastiques.
          </p>

          {/* Texte en gras */}
          <h2 className="mt-6 sm:mt-10 text-xl sm:text-2xl md:text-3xl font-bold leading-tight px-2 sm:px-0">
            Découvrez l&apos;expérience d&apos;un concert avec Philmar
          </h2>

          {/* Flèche cliquable pour scroller */}
          <button onClick={handleScrollToRecents} className="mt-8 sm:mt-12 animate-bounce focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </section>



      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
        </div>
      )}

      {/* Section "Les plus récents" */}
      {!loading && (
        <section id="recents" className="py-10 sm:py-16 px-3 sm:px-6 md:px-12 min-h-screen sm:h-auto lg:h-screen">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 sm:mt-8 mb-8 sm:mb-12 gap-4 sm:gap-0">
            {/* Titre à gauche */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Les plus récents</h2>

            {/* Bouton à droite */}
            <Link href="/spectacles"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/spectacles";
            }}
            className="inline-block border border-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg rounded-full hover:bg-white hover:text-black transition">
              Checkez les spectacles de Philmar →
            </Link>
          </div>

        <div className="relative flex items-center px-6 sm:px-10 md:px-16">
          {/* Bouton Précédent */}
          <button
            onClick={goToPrev}
            className="absolute left-0 sm:-left-2 z-10 text-white text-2xl sm:text-4xl px-2 sm:px-3 py-1 sm:py-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-80 transition"
          >
            ‹
          </button>

          <div className="overflow-hidden w-full">
            <div
              ref={carouselRef}
              className="flex gap-3 sm:gap-6"
              style={{ transition: 'transform 500ms ease-in-out' }}
              onTransitionEnd={handleTransitionEnd}
            >
              {getExtendedConcerts().map((concert, index) => (
                <div
                  key={index}
                  className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg flex-shrink-0"
                  style={{ width: `calc(${100 / itemsPerView}% - ${itemsPerView === 1 ? 0 : (itemsPerView - 1) * 6 / itemsPerView}px)` }}
                >
                  {/* Image + Étiquette du titre */}
                  <div className="relative">
                    <Image src={concert.image} alt={concert.title} width={400} height={250} className="w-full h-40 sm:h-52 object-cover" />

                    {/* Étiquette du titre */}
                    <div className="absolute top-0 left-0 sm:left-[-12px] bg-[#621912] text-white px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-lg font-bold uppercase">
                      {concert.title}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-3 sm:p-4">
                    <p className="text-xs sm:text-sm line-clamp-3 sm:line-clamp-none">{concert.description}</p>

                    {/* Lien "En savoir plus" */}
                    <div className="mt-3 sm:mt-4">
                      <Link href={concert.link} className="text-blue-400 font-medium hover:text-blue-500 flex items-center text-sm sm:text-base">
                        En savoir plus
                        <span className="ml-2">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton Suivant */}
          <button
            onClick={goToNext}
            className="absolute right-0 sm:-right-2 z-10 text-white text-2xl sm:text-4xl px-2 sm:px-3 py-1 sm:py-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-80 transition"
          >
            ›
          </button>
        </div>


      </section>


      )}

      {/* Galerie */}
      {!loading && (
        <section className="py-10 sm:py-16 px-3 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8">Galerie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {galleryImages.map((src, index) => (
              <button key={index} onClick={() => setSelectedImage(src)} className="focus:outline-none">
                <Image src={src} alt={`Galerie ${index + 1}`} width={300} height={300} className="rounded-lg object-cover w-full h-36 sm:h-48 md:h-60" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Overlay Image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          {/* Bouton Fermer */}
          <button className="absolute top-4 sm:top-6 right-4 sm:right-6 text-white text-2xl sm:text-3xl" onClick={() => setSelectedImage(null)}>
            ✕
          </button>

          {/* Bouton Précédent */}
          <button
            className="absolute left-2 sm:left-6 text-white text-4xl sm:text-6xl px-2 sm:px-4 py-1 sm:py-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-80"
            onClick={() => {
              const currentIndex = galleryImages.indexOf(selectedImage);
              const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
              setSelectedImage(galleryImages[prevIndex]);
            }}
          >
            ‹
          </button>

          {/* Image en overlay */}
          <Image
            src={selectedImage}
            alt="Agrandissement"
            width={800}
            height={600}
            className="rounded-lg object-contain max-h-[70vh] sm:max-h-[80vh] max-w-[80vw] sm:max-w-none"
          />

          {/* Bouton Suivant */}
          <button
            className="absolute right-2 sm:right-6 text-white text-4xl sm:text-6xl px-2 sm:px-4 py-1 sm:py-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-80"
            onClick={() => {
              const currentIndex = galleryImages.indexOf(selectedImage);
              const nextIndex = (currentIndex + 1) % galleryImages.length;
              setSelectedImage(galleryImages[nextIndex]);
            }}
          >
            ›
          </button>
        </div>
      )}

    </div>
  );
}
