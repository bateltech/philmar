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
  const cloneCount = 4;

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
    const transform = `calc(-${totalIndex * 25}% - ${totalIndex * 6}px)`;

    if (!animate) {
      carousel.style.transition = 'none';
    }

    carousel.style.transform = `translateX(${transform})`;

    if (!animate) {
      // Force reflow pour appliquer immédiatement
      void carousel.offsetHeight;
      carousel.style.transition = 'transform 500ms ease-in-out';
    }
  }, [cloneCount]);

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

  // Applique la position initiale après le chargement des concerts
  useLayoutEffect(() => {
    if (concerts.length > 0 && carouselRef.current) {
      applyTransform(indexRef.current, false);
    }
  }, [concerts.length, applyTransform]);

  return (
    <div className="text-white bg-black">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-6">
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
        <div className="relative z-10 max-w-6xl text-white">
          {/* Titre principal */}
          <h1 className="text-4xl md:text-6xl font-bold mt-18 mb-8">Concerts</h1>

          {/* Texte de description */}
          <p className="mt-8 mb-24 text-lg leading-relaxed px-4 md:px-0">
            Philmar participe à divers événements, concerts, mais aussi vernissages ou conférences, grâce à son expérience, 
            son talent d’improvisation et son interactivité. En solo ou avec son collectif, il propose une musique festive ou 
            d’ambiance, qui peut être liée à un thème ou une région du monde. Selon le projet, il peut s’entourer de musiciens 
            expérimentés. En lien avec des réseaux d’artistes, il est possible de donner des prestations artistiques complémentaires 
            à la musique de Philmar, telles que le théâtre, la danse ou les arts plastiques.
          </p>

          {/* Texte en gras */}
          <h2 className="mt-10 text-2xl md:text-3xl font-bold">
            Découvrez l’expérience d’un concert avec Philmar
          </h2>

          {/* Flèche cliquable pour scroller */}
          <button onClick={handleScrollToRecents} className="mt-12 animate-bounce focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
        <section id="recents" className="py-16 px-6 md:px-12 h-screen">
          <div className="flex justify-between items-center mt-8 mb-12">
            {/* Titre à gauche */}
            <h2 className="text-3xl md:text-4xl font-bold">Les plus récents</h2>

            {/* Bouton à droite */}
            <Link href="/spectacles" 
            onClick={(e) => {
              e.preventDefault();  // Empêcher le comportement Next.js par défaut
              window.location.href = "/spectacles"; // Forcer le reload
            }}
            className="inline-block border border-white px-6 py-3 text-lg rounded-full hover:bg-white hover:text-black transition">
              Checkez les spectacles de Philmar →
            </Link>
          </div>

        <div className="relative flex items-center px-16">
          {/* Bouton Précédent */}
          <button
            onClick={goToPrev}
            className="absolute -left-2 z-10 text-white text-4xl px-3 py-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-80 transition"
          >
            ‹
          </button>

          <div className="overflow-hidden w-full">
            <div
              ref={carouselRef}
              className="flex gap-6"
              style={{ transition: 'transform 500ms ease-in-out' }}
              onTransitionEnd={handleTransitionEnd}
            >
              {getExtendedConcerts().map((concert, index) => (
                <div key={index} className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg flex-shrink-0 w-[calc(25%-18px)]">

                  {/* Image + Étiquette du titre */}
                  <div className="relative">
                    <Image src={concert.image} alt={concert.title} width={400} height={250} className="w-full h-52 object-cover" />

                    {/* Étiquette du titre */}
                    <div className="absolute top-0 left-[-12] bg-[#621912] text-white px-4 py-2 text-lg font-bold uppercase">
                      {concert.title}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-4">
                    <p className="text-sm">{concert.description}</p>

                    {/* Lien "En savoir plus" */}
                    <div className="mt-4">
                      <Link href={concert.link} className="text-blue-400 font-medium hover:text-blue-500 flex items-center">
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
            className="absolute -right-2 z-10 text-white text-4xl px-3 py-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-80 transition"
          >
            ›
          </button>
        </div>
      
        
      </section>
      
      
      )}

      {/* Galerie */}
      {!loading && (
        <section className="py-16 px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Galerie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((src, index) => (
              <button key={index} onClick={() => setSelectedImage(src)} className="focus:outline-none">
                <Image src={src} alt={`Galerie ${index + 1}`} width={300} height={300} className="rounded-lg object-cover w-full h-60" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Overlay Image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          {/* Bouton Fermer */}
          <button className="absolute top-6 right-6 text-white text-3xl" onClick={() => setSelectedImage(null)}>
            ✕
          </button>

          {/* Bouton Précédent */}
          <button 
            className="absolute left-6 text-white text-6xl px-4 py-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-80"
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
            className="rounded-lg object-contain max-h-[80vh]"
          />

          {/* Bouton Suivant */}
          <button 
            className="absolute right-6 text-white text-6xl px-4 py-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-80"
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
