'use client';
import VoixCardsGrid from '@/components/VoixCardsGrid';
import AvisSliderVoix from '@/components/AvisSliderVoix';

export default function Voix() {
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

        {/* Cartes */}
        <div className="max-w-7xl mx-auto mt-16 sm:mt-24 grid gap-8 sm:gap-12 md:grid-cols-3 px-1 sm:px-2 md:px-6 items-stretch">
          {/* Carte : La méthode */}
          <div className="flex flex-col items-stretch">
            <article
              className="relative rounded-xs bg-black/40 bg-blend-multiply h-full flex flex-col min-h-[400px] sm:min-h-0"
              style={{
                backgroundImage: "url('/images/voix/methode.jpg')",
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
                  La méthode
                </h3>
                <p className="text-xs italic text-yellow-300 mb-3 sm:mb-5 text-center">
                  &quot;Le Champ des Voix - la Voie du Chant&quot;
                </p>

                <p className="mb-3 sm:mb-4">
                  C&apos;est une approche qui repose sur une série d&apos;exercices
                  ludiques destinés à retrouver le naturel de sa voix, et ainsi son
                  expressivité. L&apos;exploration vocale et l&apos;improvisation en
                  sont les piliers : chanter sans paroles, jouer avec les sons et
                  laisser place au jeu et à l&apos;échange.
                </p>
                <p>
                  L&apos;objectif est de développer une musicalité naturelle en
                  s&apos;affranchissant de la technique au profit d&apos;une
                  perception intuitive des intentions vocales et sonores.
                  L&apos;improvisation, abordée sous un angle ludique, favorise
                  l&apos;expression des émotions et la connexion avec l&apos;essentiel
                  de chacun. Des jeux simples permettent d&apos;expérimenter la
                  relation entre intérieur et extérieur, facilitant l&apos;écoute,
                  la communication et l&apos;ouverture aux autres.
                </p>
              </div>
            </article>
          </div>

          {/* Carte : Les objectifs */}
          <div className="flex flex-col items-stretch">
            <article
              className="relative rounded-xs bg-black/40 bg-blend-multiply h-full flex flex-col min-h-[450px] sm:min-h-0"
              style={{
                backgroundImage: "url('/images/voix/objectifs.jpg')",
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
                  Les objectifs
                </h3>
                <p className="text-xs italic text-yellow-300 mb-3 sm:mb-5 text-center">
                  (Le formateur s&apos;adapte selon la demande ou les besoins
                  du contexte et du public)
                </p>

                <p className="mb-2 sm:mb-3">
                  À qui s&apos;adresse un atelier ponctuel ou une série d&apos;ateliers&nbsp;?
                </p>

                <ul className="list-disc pl-4 sm:pl-5 space-y-1 mb-3 sm:mb-4">
                  <li>
                    <span className="font-semibold">Privé&nbsp;:</span> Artistes,
                    entreprises, musicothérapie.
                  </li>
                  <li>
                    <span className="font-semibold">Public&nbsp;:</span> Particuliers,
                    centres culturels, développement personnel, associations, festivals.
                  </li>
                </ul>

                <p className="mb-1">
                  <span className="font-semibold underline">Cohésion de groupe</span> – développer un esprit d&apos;équipe et un engagement collectif.
                </p>
                <p className="mb-1">
                  <span className="font-semibold underline">Expression artistique</span> – explorer les sonorités et stimuler la créativité vocale.
                </p>
                <p className="mb-2 sm:mb-3">
                  <span className="font-semibold underline">Développement personnel</span> – libérer sa voix pour favoriser
                  l&apos;épanouissement individuel.
                </p>

                <p>
                  L&apos;improvisation en groupe encourage naturellement l&apos;empathie
                  et la co-création, permettant de retrouver une perception ludique
                  des sons et d&apos;expérimenter un chant libre et spontané. S&apos;en
                  suit naturellement un plaisir de l&apos;échange et un sentiment de
                  partage qui ouvrent à la confiance en la coopération.
                </p>
              </div>
            </article>
          </div>

          {/* Carte : Les moyens */}
          <div className="flex flex-col items-stretch">
            <article
              className="relative rounded-xs bg-black/40 bg-blend-multiply h-full flex flex-col min-h-[400px] sm:min-h-0"
              style={{
                backgroundImage: "url('/images/voix/moyens.jpg')",
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
                  Les moyens
                </h3>
                <p className="text-xs italic text-yellow-300 mb-3 sm:mb-5 text-center">
                  selon les objectifs ou le choix du stage/atelier/cours
                </p>

                <ul className="list-disc pl-4 sm:pl-5 space-y-1">
                  <li>
                    Échauffements physiques et énergétiques
                    (Do In, Qi-Gong, danse libre…).
                  </li>
                  <li>
                    Préparation vocale ludique (rire, théâtre sonore…).
                  </li>
                  <li>
                    Jeux sur l&apos;expression corporelle et vocale
                    (souffle, percussions corporelles, mélodies…).
                  </li>
                  <li>
                    Exploration stylistique et vocale (tessitures, yodel,
                    chant diphonique, phonèmes, élocution…).
                  </li>
                  <li>
                    Pratique interactive (chants en cercle, dialogues,
                    improvisations collectives…) sur toutes sortes de jeux vocaux.
                  </li>
                  <li>
                    Utilisation d&apos;instruments simples par les participants
                    (maracas, tambourins, flûtes harmoniques…) et accompagnement
                    d&apos;instruments par l&apos;animateur (guitare, harmonium,
                    tambour sur cadre, djembé, esraj…).
                  </li>
                  <li>
                    Informations didactiques adaptées aux demandes, au contexte.
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="pt-12 sm:pt-20 px-3 sm:px-4 md:px-20 pb-6 sm:pb-10 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold pb-4 sm:pb-8 leading-tight">
          Vous seriez intéressé-e d&apos;expérimenter le Chant?
        </h2>
        <p className="text-base sm:text-lg italic px-2 sm:px-0">
          Accompagné·e par un professionnel de la voix, découvrez les Stages, les Ateliers, les Cours !
        </p>
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
