'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Spectacle = {
  title: string;
  description: string;
  image: string;
  link: string;
};

export default function Spectacles() {
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const spectaclesRes = await fetch('/data/spectacles.json');
        const spectaclesData = await spectaclesRes.json();

        const galleryRes = await fetch('/data/galerie_spectacle.json');
        const galleryData = await galleryRes.json();
        
        setSpectacles(spectaclesData);
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

  // Créer les éléments dupliqués pour la boucle infinie
  const getExtendedSpectacles = () => {
    if (spectacles.length === 0) return [];
    const lastFour = spectacles.slice(-4);
    const firstFour = spectacles.slice(0, 4);
    return [...lastFour, ...spectacles, ...firstFour];
  };

  // Navigation du carrousel
  const handlePrevSpectacle = () => {
    if (!isTransitioning) return;
    setCarouselIndex((prev) => prev - 1);
  };

  const handleNextSpectacle = () => {
    if (!isTransitioning) return;
    setCarouselIndex((prev) => prev + 1);
  };

  // Gestion de la boucle infinie après la transition
  const handleTransitionEnd = () => {
    if (spectacles.length === 0) return;

    if (carouselIndex <= 0) {
      setIsTransitioning(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCarouselIndex(spectacles.length);
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        });
      });
    } else if (carouselIndex >= spectacles.length + 4) {
      setIsTransitioning(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCarouselIndex(4);
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        });
      });
    }
  };

  return (
    <div className="text-white bg-black">
      {/* Hero Section */} 
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-6">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <Image
            src="/images/spectacles/spectacle-hero.png"
            alt="Spectacles"
            layout="fill"
            objectFit="cover"
            className="absolute z-0"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        {/* Contenu de la Hero Section */}
        <div className="relative z-10 max-w-4xl text-white">
          {/* Titre principal */}
          <h1 className="text-4xl md:text-6xl font-bold mt-18 mb-8">Spectacles</h1> 

          {/* Texte de description */}
          <p className="mt-8 mb-24 text-lg leading-relaxed px-4 md:px-0">
          Dans ses spectacles, Philmar offre une expérience unique où la musique qu&apos;il compose s&apos;entrelace avec l&apos;art du mouvement et du conte. Il collabore avec des danseurs talentueux qui interprètent des chorégraphies envoûtantes, ainsi qu&apos;avec des conteurs qui partagent des histoires captivantes, créant ainsi un univers artistique où la musique et les arts se rencontrent et se complètent.
          </p>

          {/* Texte en gras */}
          <h2 className="mt-10 text-2xl md:text-3xl font-bold">
            Découvrez l’expérience d’un spectacle avec Philmar
          </h2>

          {/* Flèche cliquable pour scroller */}
          <button onClick={handleScrollToRecents} className="mt-12 animate-bounce focus:outline-none" aria-label="Faire défiler vers la section suivante">
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
            <Link href="/concerts" 
            onClick={(e) => {
              e.preventDefault();  // Empêcher le comportement Next.js par défaut
              window.location.href = "/concerts"; // Forcer le reload
            }}
            className="inline-block border border-white px-6 py-3 text-lg rounded-full hover:bg-white hover:text-black transition">
              Checkez les concerts de Philmar →
            </Link>
          </div>

        <div className="relative flex items-center px-16">
          {/* Bouton Précédent */}
          <button
            onClick={handlePrevSpectacle}
            className="absolute -left-2 z-10 text-white text-4xl px-3 py-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-80 transition"
          >
            ‹
          </button>

          <div className="overflow-hidden w-full">
            <div
              className={`flex gap-6 ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
              style={{ transform: `translateX(-${carouselIndex * (100 / 4 + 1.5)}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {getExtendedSpectacles().map((spectacle, index) => (
                <div key={index} className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg flex-shrink-0 w-[calc(25%-18px)]">

                  {/* Image + Étiquette du titre */}
                  <div className="relative">
                    <Image src={spectacle.image} alt={spectacle.title} width={400} height={250} className="w-full h-52 object-cover" />

                    {/* Étiquette du titre */}
                    <div className="absolute top-0 left-[-12] bg-[#621912] text-white px-4 py-2 text-lg font-bold uppercase">
                      {spectacle.title}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-4">
                    <p className="text-sm">{spectacle.description}</p>

                    {/* Lien "En savoir plus" */}
                    <div className="mt-4">
                      <Link href={spectacle.link} className="text-blue-400 font-medium hover:text-blue-500 flex items-center">
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
            onClick={handleNextSpectacle}
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
