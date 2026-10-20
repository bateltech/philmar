'use client';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import VoixCardsGrid from '@/components/VoixCardsGrid';
import AvisSliderVoix from '@/components/AvisSliderVoix';
import { getContent } from '@/lib/content';
import { DEFAULT_VOIX_PRESENTATION, type VoixPresentationSection } from '@/lib/voix-presentation';

export default function Voix() {
  const [sections, setSections] = useState<VoixPresentationSection[] | null>(null);

  useEffect(() => {
    let alive = true;
    getContent<VoixPresentationSection[]>('voix_presentation')
      .then((data) => {
        if (alive) setSections(Array.isArray(data) && data.length ? data : DEFAULT_VOIX_PRESENTATION);
      })
      .catch(() => { if (alive) setSections(DEFAULT_VOIX_PRESENTATION); });
    return () => { alive = false; };
  }, []);

  return (
    <main className="bg-black text-white overflow-x-hidden">
      {/* SECTION INTRO + CARTES */}
      <section className="pt-10 sm:pt-16 px-3 sm:px-4 md:px-4 lg:px-8 pb-10 sm:pb-16">
        {/* Intro */}
        <div className="max-w-5xl mx-auto text-center space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 mt-10 sm:mt-16 uppercase leading-tight">
            LE CHAMP DES VOIX - LA VOIE DU CHANT
          </h2>

          <p className="text-sm md:text-base leading-relaxed text-gray-200 px-1 sm:px-0">
            Pour participer à un stage, un atelier ou une séance individuelle,
            il n&apos;est pas nécessaire de connaître la musique, mais simplement
            de désirer se faire plaisir, partager et éveiller son mouvement intérieur de Vie.
          </p>

          <p className="text-sm md:text-base leading-relaxed text-gray-200 px-1 sm:px-0">
            La maîtrise vocale vient progressivement dans un perfectionnement musical.
          </p>

          <p className="text-sm md:text-base leading-relaxed text-gray-200 pb-8 sm:pb-12 px-1 sm:px-0">
            Cependant des professionnels du chant peuvent largement approfondir leur démarche
            vocale, découvrir des techniques particulières. De même, des professionnels de
            la parole (théâtre, conte, etc.) trouveront de quoi enrichir leur manière
            d&apos;appréhender la voix.
          </p>
        </div>

        {/* Cartes (modifiables depuis l'admin) */}
        <div className="max-w-7xl mx-auto mt-16 sm:mt-24 grid gap-8 sm:gap-12 md:grid-cols-3 px-1 sm:px-2 md:px-6 items-stretch">
          {(sections ?? []).map((section) => (
            <div key={section.key} className="flex flex-col items-stretch">
              <article
                className="relative rounded-xs bg-black/40 bg-blend-multiply h-full flex flex-col min-h-[400px] sm:min-h-0"
                style={{
                  backgroundImage: section.image ? `url("${section.image}")` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Soleil superposé */}
                <img
                  src="/images/voix/soleil.png"
                  alt=""
                  className="absolute -top-10 sm:-top-14 -left-6 sm:-left-10 w-16 h-20 sm:w-20 sm:h-24 md:w-28 md:h-28 pointer-events-none select-none z-20"
                />

                {/* Overlay + texte */}
                <div className="relative z-10 bg-gradient-to-b from-black/30 via-black/20 to-black/10 backdrop-blur-sm h-full p-3 sm:p-4 md:p-4 text-xs sm:text-sm leading-relaxed">
                  <h3 className="text-lg sm:text-xl font-bold text-yellow-500 mb-1 text-center">
                    {section.title}
                  </h3>
                  {section.subtitle && (
                    <p className="text-xs italic text-yellow-300 mb-3 sm:mb-5 text-center">
                      {section.subtitle}
                    </p>
                  )}

                  <div
                    className="[&_p]:mb-3 sm:[&_p]:mb-4 [&_p:last-child]:mb-0 [&_li_p]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 sm:[&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-4 sm:[&_ol]:pl-5 [&_ol]:space-y-1 [&_ol]:mb-3 [&_strong]:font-semibold [&_a]:underline [&_a]:text-yellow-300"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content) }}
                  />
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-12 sm:pt-20 px-3 sm:px-4 md:px-20 pb-6 sm:pb-10 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold pb-4 sm:pb-8 leading-tight">
          Vous seriez intéressé-e d&apos;expérimenter le Chant ?
        </h2>
        <p className="text-base sm:text-lg italic px-2 sm:px-0">
          Accompagné·e par un professionnel de la voix, découvrez les Stages, les Ateliers, les Cours !
        </p>
        <a
          href="#contact"
          className="inline-block mt-5 sm:mt-6 px-6 py-2 border border-yellow-500 text-yellow-500 font-semibold rounded-xs transition-colors hover:bg-yellow-500 hover:text-black"
        >
          Me contacter
        </a>
      </section>

      <section className="px-3 sm:px-4 md:px-20">
        <VoixCardsGrid />
      </section>

      <section className="pt-12 sm:pt-20 px-3 sm:px-4 md:px-20 pb-16 sm:pb-28">
        <h3 className="text-lg sm:text-xl font-semibold text-center mb-6 sm:mb-8">Avis des stagiaires</h3>
        <AvisSliderVoix />
      </section>
    </main>
  );
}
