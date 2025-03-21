'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useIntersectionObserver from '@/components/useIntersectionObserver';

export default function Concerts() {
  const [concerts, setConcerts] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

    // Ajoute un eventListener pour fermer l'overlay avec la touche Échap
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fonction pour scroller en douceur vers la section "Les plus récents"
  const handleScrollToRecents = () => {
    const recentsSection = document.getElementById('recents');
    if (recentsSection) {
      recentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // Use the intersection observer hook
  const [sectionRef, isSectionVisible] = useIntersectionObserver({
    threshold: 0.1, // Trigger when 10% of the section is visible
  });
  const [titleRef, isTitleVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [titleRef2, isTitleVisible2] = useIntersectionObserver({ threshold: 0.1 });
  const [galleryRef, isGalleryVisible] = useIntersectionObserver({ threshold: 0.1 });
  return (
    <div className="text-white bg-black">
      {/* Hero Section */}
      <section ref={sectionRef} className="relative min-h-[60vh] md:min-h-screen flex flex-col justify-center items-center text-center px-4 md:px-6 pt-24 md:pt-24">

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

        <div className="relative z-10 max-w-6xl text-white">
          <h1 className=
            {`text-3xl md:text-6xl font-bold mt-20 md:mt-18 mb-18 md:mb-24 ${isSectionVisible ? "animate-slideInFromTop" : "opacity-0"
              }`}>
            Concerts</h1>
          <p className=
            {`mt-4 md:mt-8 mb-12 md:mb-24 text-base md:text-lg leading-relaxed px-4 md:px-0 ${isSectionVisible ? "animate-slideInFromBottom" : "opacity-0"
              }`}
          >

            Philmar participe à divers événements, concerts, mais aussi vernissages ou conférences, grâce à son expérience,
            son talent d’improvisation et son interactivité. En solo ou avec son collectif, il propose une musique festive ou
            d’ambiance, qui peut être liée à un thème ou une région du monde. Selon le projet, il peut s’entourer de musiciens
            expérimentés. En lien avec des réseaux d’artistes, il est possible de donner des prestations artistiques complémentaires
            à la musique de Philmar, telles que le théâtre, la danse ou les arts plastiques.
          </p>
          <h2 className={`mt-6 md:mt-10 text-xl md:text-3xl font-bold 
  transition-all duration-1000 ease-in-out 
  ${isSectionVisible ? "animate-slideInFromBottom delay-200" : "opacity-0"}`}>
            Découvrez l’expérience d’un concert avec Philmar
          </h2>

          <button onClick={handleScrollToRecents}
            className={`mt-8 md:mt-12 focus:outline-none transition-all duration-1000 ease-in-out 
  ${isSectionVisible ? "animate-slideInFromBottom delay-300" : "opacity-0"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 text-white mx-auto"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
        <section id="recents" className="py-12 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24">
          <div
            ref={titleRef}
            className={`flex flex-col sm:flex-row justify-between items-center mt-8 mb-12 gap-6 sm:gap-0 ${isTitleVisible ? "animate-slideInFromLeft" : "opacity-0"
              }`}
          >
            {/* Titre à gauche */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:text-left">
              Les plus récents
            </h2>

            {/* Bouton à droite */}
            <Link
              href="/spectacles"
              onClick={(e) => {
                e.preventDefault(); // Empêcher le comportement Next.js par défaut
                window.location.href = "/spectacles"; // Forcer le reload
              }}
              className="inline-block border border-white px-5 py-2.5 text-sm sm:text-lg rounded-full hover:bg-white hover:text-black transition"
            >
              Checkez les spectacles de Philmar →
            </Link>
          </div>

          {/* Grille des concerts */}
          <div 
            ref={titleRef}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${isTitleVisible ? "animate-slideInFromRight" : "opacity-0"
              }`}
          
          >
            {concerts.map((concert, index) => (
              <div key={index} className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg transition transform hover:scale-105">

                {/* Image + Étiquette du titre */}
                <div className="relative">
                  <Image
                    src={concert.image}
                    alt={concert.title}
                    width={400}
                    height={250}
                    className="w-full h-48 sm:h-52 object-cover"
                  />

                  {/* Étiquette du titre */}
                  <div className="absolute top-2 left-2 bg-[#621912] text-white px-3 py-1 text-sm sm:text-base font-bold uppercase rounded">
                    {concert.title}
                  </div>
                </div>

                {/* Description */}
                <div className="p-4">
                  <p className="text-sm sm:text-base">{concert.description}</p>

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
        </section>
      )}


      {/* Galerie */}
      {!loading && (
        <section className="py-12 px-4 sm:px-6 md:px-12">
          <h2 ref={titleRef2}
            className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 ${
              isTitleVisible2 ? "animate-slideInFromTop" : "opacity-0"
            }`}
          
          >Galerie</h2>

          {/* Grille responsive */}
          <div 
          ref={galleryRef}
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ${
            isGalleryVisible ? "animate-slideInFromBottom" : "opacity-0"
          }`}
          >
            {galleryImages.map((src, index) => (
              <button key={index} onClick={() => setSelectedImage(src)} className="focus:outline-none">
                <Image
                  src={src}
                  alt={`Galerie ${index + 1}`}
                  width={300}
                  height={300}
                  className="rounded-lg object-cover w-full h-40 sm:h-48 md:h-60 transition-transform hover:scale-105"
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Overlay Image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          {/* Bouton Fermer */}
          <button className="absolute top-6 right-6 text-white text-3xl sm:text-4xl" onClick={() => setSelectedImage(null)}>
            ✕
          </button>

          {/* Bouton Précédent */}
          <button
            className="absolute left-4 sm:left-6 text-white text-4xl sm:text-6xl px-3 sm:px-4 py-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-80"
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
            className="rounded-lg object-contain max-w-[90%] max-h-[80vh]"
          />

          {/* Bouton Suivant */}
          <button
            className="absolute right-4 sm:right-6 text-white text-4xl sm:text-6xl px-3 sm:px-4 py-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-80"
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
