"use client"; // Mark this page as a Client Component
import { useState } from 'react';
import useIntersectionObserver from '@/components/useIntersectionObserver';
import Image from 'next/image';
import Link from 'next/link';
import SoundCloudPlayer from '@/components/SoundCloudPlayer';
import usePlayerConfig from '@/components/usePlayerConfig';

export default function Accueil() {
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const { config } = usePlayerConfig();
    const playlistUrl = config?.soundcloud?.playlistUrl ?? 'https://soundcloud.com/philmarzic/sets/steppe-by-steppe';
    
    const [heroRef, isHeroVisible] = useIntersectionObserver();
    const [textRef, isTextVisible] = useIntersectionObserver({ threshold: 0.1 });
    const [textRef2, isTextVisible2] = useIntersectionObserver({ threshold: 0.1 });
    const [imageRef, isImageVisible] = useIntersectionObserver({ threshold: 0.1 });
    // Use the intersection observer hook
    const [sectionRef, isSectionVisible] = useIntersectionObserver({
        threshold: 0.1, // Trigger when 10% of the section is visible
    });
    // Use the intersection observer hook
    const [sectionRef2, isSectionVisible2] = useIntersectionObserver({
        threshold: 0.1, // Trigger when 10% of the section is visible
    });
    const [sectionRef3, isSectionVisible3] = useIntersectionObserver({
        threshold: 0.1, // Trigger when 10% of the section is visible
    });
    return (
        <div role='main' className="min-h-screen flex flex-col">

            {/* Le lecteur est monté une fois ici pour rester présent partout */}
            {/* <SoundCloudPlayer isOpen={isPlayerOpen} onClose={() => setIsPlayerOpen(false)} /> */}
            <SoundCloudPlayer isOpen={isPlayerOpen} onClose={() => setIsPlayerOpen(false)} url={playlistUrl} />
            {/* Section 1: Hero */}
            <section
                ref={heroRef}
                className="relative min-h-screen bg-cover bg-left bg-no-repeat"
                style={{ backgroundImage: "url('/images/home_phil.png')",}}
            >
                <div

                    className={`relative z-10 min-h-screen flex items-center justify-center md:justify-end text-white px-6 sm:px-10  ${isHeroVisible ? "animate-slideInFromRight" : "opacity-0"
                        }`}
                >
                    <div className="flex flex-col items-start md:mr-10 max-w-xl animate-slideInFromRight">
                        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-white">
                            Philmar - Philippe Martin
                        </h1>
                        <p className="max-w-lg text-lg mb-6 text-white">
                            Musicien dans l&apos;âme et professionnel depuis plus de 30 ans, Philmar vibre et fait vibrer de ses chants et instruments, nous faisant ainsi voyager vers de lointains horizons et jusqu&apos;au cœur de nous-même.
                        </p>
                        <button 
                        onClick={() => setIsPlayerOpen(true)} 
                        className="bg-blue-950 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-between">
                            Écoutez mon dernier album
                            <svg className="ml-8" xmlns="http://www.w3.org/2000/svg" width="23" height="23" style={{ transform: "rotate(90deg)" }}>
                                <path
                                    stroke="none"
                                    fill="white"
                                    d="M8.9019237886467 4.1076951545867a3 3 0 0 1 5.1961524227066 0l6.8038475772934 11.784609690827a3 3 0 0 1 -2.5980762113533 4.5l-13.607695154587 0a3 3 0 0 1 -2.5980762113533 -4.5"
                                ></path>
                            </svg>
                        </button>
                        {/* <SoundCloudPlayer /> */}
                    </div>
                </div>
            </section>
            {/* Section 2: Biographie */}
            <section className="py-24 my-24 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/biographie.png')" }}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col md:flex-row items-center justify-center">
                    {/* Text Section */}
                    <div ref={textRef}
                        className={`md:w-3/5 px-6 py-10 sm:px-10 lg:p-16 ${isTextVisible ? "animate-slideInFromLeft" : ""}`}>
                        <h2 className="text-4xl font-bold mb-8 text-white">Biographie</h2>
                        <p className="text-lg text-white text-justify mb-4">
                            Musicien depuis plus de 30 ans, j&apos;ai eu la chance de jouer dans de nombreux groupes, explorant des genres variés comme le rock, la variété, le jazz, l&apos;ethnique, l&apos;électro et le folk.
                            J&apos;ai également enregistré plusieurs albums et collaboré avec des conteurs, des comédiens, des danseuses et des plasticiens pour des spectacles et des performances.
                        </p>
                        <p className="text-lg text-white text-justify mb-4">
                            J&apos;ai commencé avec la guitare, tant acoustique qu&apos;électrique, mais je me suis rapidement tourné vers le chant, qui est devenu mon instrument de prédilection. Aujourd&apos;hui, je joue divers instruments du monde (cordes, vent, percussions) et je chante dans de nombreux styles, allant du yodel au chant oriental, en passant par le chant de gorge et le joik, sans oublier le scat jazz et d&apos;autres chants occidentaux.
                            J&apos;anime également des ateliers et des stages sur l&apos;exploration de la voix et la découverte des instruments du monde.
                        </p>
                        {/* <button className="mt-4 border border-blue-800 text-blue-800 font-semibold py-2 px-6 rounded-lg hover:bg-white">
                            Lire plus sur Philmar...
                        </button> */}
                        <Link
                            href="/biographie"
                            className="mt-4 inline-block border border-blue-800 text-blue-800 font-semibold py-2 px-6 rounded-lg hover:bg-white"
                            >
                            Lire plus sur Philmar...
                        </Link>
                    </div>

                    {/* Image Section with Decorative Squares */}
                    <div ref={imageRef}
                        className={`md:w-2/5 px-6 py-10 sm:px-10 lg:p-16 relative flex justify-center ${isImageVisible ? "animate-slideInFromRight" : ""}`}>
                        {/* Portrait Image as an element inside the div */}
                        <div className="relative w-[260px] sm:w-[320px] md:w-[360px] h-[460px] sm:h-[560px] md:h-[640px] bg-cover bg-center shadow-lg z-10" style={{ backgroundImage: "url('/images/biographie_image.jpg')" }}>

                            {/* Actual img element for better control and accessibility */}
                            <img src="/images/biographie_image.jpg" alt="Biographie" className="w-full h-full object-cover" />
                            {/* Decorative Squares under the image */}
                            {/* <div className="absolute top-[-8px] left-[-8px] w-16 h-16 border-t-2 border-l-2 border-black z-0"></div>
                    <div className="absolute bottom-[-8px] right-[-8px] w-16 h-16 border-b-2 border-r-2 border-black z-0"></div> */}

                        </div>

                    </div>

                </div>
            </section>


            {/* Section 3: Performances */}

            <section
                ref={sectionRef} // Attach the ref to the section
                className="relative py-12 md:py-16 bg-cover bg-center bg-contain h-auto md:h-[50rem] w-full text-white flex items-center"
                style={{ backgroundImage: "url('/images/performances-bg.jpg')" }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-[2px]"></div>

                {/* Content Container */}
                <div className="relative z-10 container mx-auto text-center px-4">
                    {/* Title with Slide-In from Top Animation */}
                    <h2
                        className={`text-3xl md:text-4xl font-bold mb-6 md:mb-12 ${isSectionVisible ? "animate-slideInFromTop" : "opacity-0"
                            }`}
                    >
                        Performances
                    </h2>

                    {/* Cards Container */}
                    <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 lg:gap-16 px-4 sm:px-8 lg:px-16 md:p-4 lg:p-16">
                        {/* Spectacles Card with Slide-In from Bottom Animation */}
                        <div
                            className={`w-full md:w-1/2 lg:w-150 bg-white text-black bg-opacity-55 p-6 sm:p-8 md:p-6 lg:p-8 shadow-lg flex flex-row items-start gap-4 ${isSectionVisible ? "animate-slideInFromBottom" : "opacity-0"
                                }`}
                        >
                            {/* Image Container */}
                            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-orange-950 rounded-full border-4 border-orange-950">
                                <img
                                    src="images/spectacles.svg"
                                    alt="Spectacles Icon"
                                    className="w-8 h-8 md:w-12 md:h-12" // Responsive icon size
                                />
                            </div>

                            {/* Text Content */}
                            <div className="flex flex-col text-left">
                                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Spectacles</h3>
                                <p className="text-sm md:text-base text-justify">
                                    Dans mes spectacles, j&apos;aime fusionner différentes formes d&apos;art pour créer une expérience unique.
                                    Que ce soit à travers le théâtre, la danse ou des contes musicaux, chaque représentation est une aventure immersive...
                                </p>
                                <Link href="/spectacles">
                                    <button className="mt-2 md:mt-4 text-blue-700 font-semibold text-sm md:text-base py-1 md:py-2 rounded">
                                        En savoir plus →
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Concerts Card with Slide-In from Bottom Animation */}
                        <div
                            className={`w-full md:w-1/2 lg:w-150 bg-white text-black bg-opacity-55 p-6 sm:p-8 md:p-6 lg:p-8 shadow-lg flex flex-row items-start gap-4 ${isSectionVisible ? "animate-slideInFromBottom" : "opacity-0"
                                }`}
                        >
                            {/* Image Container */}
                            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-orange-950 rounded-full border-4 border-orange-950">
                                <img
                                    src="images/concerts.svg"
                                    alt="Concerts Icon"
                                    className="w-8 h-8 md:w-12 md:h-12" // Responsive icon size
                                />
                            </div>

                            {/* Text Content */}
                            <div className="flex flex-col text-left">
                                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Concerts</h3>
                                <p className="text-sm md:text-base text-justify">
                                    En concert, j&apos;explore la profondeur de la musique, que ce soit en solo ou avec d&apos;autres artistes.
                                    Chaque performance est une occasion de partager des moments intimes et authentiques avec le public...
                                </p>
                                <Link href="/spectacles">
                                    <button className="mt-2 md:mt-4 text-blue-700 font-semibold text-sm md:text-base py-1 md:py-2 rounded">
                                        En savoir plus →
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Formations */}
            <section
    ref={sectionRef2} // Attach the ref to the section
    className="relative py-12 md:py-16 bg-cover bg-center bg-contain h-auto md:h-[50rem] w-full text-white flex items-center"
    style={{ backgroundImage: "url('/images/formations-bg.jpg')" }}
>
    {/* Overlay */}
    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-[2px]"></div>

    {/* Content Container */}
    <div className="relative z-10 container mx-auto text-center px-4">
        {/* Title with Slide-In from Top Animation */}
        <h2
            className={`text-4xl font-bold mb-8 md:mb-12 ${isSectionVisible2 ? "animate-slideInFromTop" : "opacity-0"
                }`}
        >
            Formations
        </h2>

        {/* Cards Container */}
        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 lg:gap-16 px-4 sm:px-8 lg:px-16 md:p-4 lg:p-16">
            {/* Voix Card with Slide-In from Bottom Animation */}
            <div
                className={`w-full md:w-1/2 lg:w-150 bg-white text-black bg-opacity-55 p-6 sm:p-8 md:p-6 lg:p-8 shadow-lg flex flex-row items-start gap-4 ${isSectionVisible2 ? "animate-slideInFromBottom" : "opacity-0"
                    }`}
            >
                {/* Image Container */}
                <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-orange-950 rounded-full border-4 border-orange-950">
                    <img
                        src="images/voix.svg"
                        alt="Voix Icon"
                        className="w-8 h-8 md:w-12 md:h-12" // Responsive icon size
                    />
                </div>

                {/* Text Content */}
                <div className="flex flex-col text-left">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Voix</h3>
                    <p className="text-sm md:text-base text-justify">
                        La voix et le chant sont peu abordés techniquement, mais par des jeux musicaux, en partant du principe
                        que chanter est totalement naturel, que nous avons plus à lâcher nos barrières (tensions physiques,
                        émotions cristallisées), qu&apos;à développer des moyens (techniques) que nous avons déjà dès la naissance.
                    </p>
                    <Link href="/voix">
                        <button className="mt-2 md:mt-4 text-blue-700 font-semibold text-sm md:text-base py-1 md:py-2 rounded">
                            En savoir plus →
                        </button>
                    </Link>
                </div>
            </div>

            {/* Instruments du monde Card with Slide-In from Bottom Animation */}
            <div
                className={`w-full md:w-1/2 lg:w-150 bg-white text-black bg-opacity-55 p-6 sm:p-8 md:p-6 lg:p-8 shadow-lg flex flex-row items-start gap-4 ${isSectionVisible2 ? "animate-slideInFromBottom" : "opacity-0"
                    }`}
            >
                {/* Image Container */}
                <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-orange-950 rounded-full border-4 border-orange-950">
                    <img
                        src="images/instruments.svg"
                        alt="Instruments Icon"
                        className="w-8 h-8 md:w-12 md:h-12" // Responsive icon size
                    />
                </div>

                {/* Text Content */}
                <div className="flex flex-col text-left">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Instruments du monde</h3>
                    <p className="text-sm md:text-base text-justify">
                        Ce sont des ateliers qui présentent de manière interactive toutes les sortes d&apos;instruments utilisés dans
                        les traditions culturelles. S&apos;adressant à différentes collectivités locales, il se décline en plusieurs
                        approches suivant le public concerné.
                    </p>
                    <Link href="/instruments">
                        <button className="mt-2 md:mt-4 text-blue-700 font-semibold text-sm md:text-base py-1 md:py-2 rounded">
                            En savoir plus →
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
</section>


    {/* Section 5: Autres Passions */}
    <section ref={sectionRef3} id="projets" className="relative py-20 bg-fill bg-center text-white flex items-center min-h-screen w-full" style={{ backgroundImage: "url('/images/passion.png')" }}>
    {/*<div className="absolute inset-0 bg-black bg-opacity-80"></div>*/}
    {/* Overlay */}

    <div className={`relative z-10 container mx-auto text-center ${isSectionVisible3 ? "animate-slideInFromTop" : "opacity-0"} `}>
        <h2 className="text-4xl font-bold mb-12">Autres Passions</h2>
        <p className="text-base sm:text-lg max-w-4xl mx-auto mb-12 px-6 sm:px-12">
        Au-delà des mélodies et des harmonies, j’ai également une passion pour l’écriture et la nature. En tant qu’auteur, j’aime partager des histoires qui résonnent avec la même intensité que ma musique. Mon amour pour la nature m’a aussi conduit à créer un éco-lieu, un projet qui reflète mon désir de vivre en harmonie avec notre environnement.
        </p>

        <div ref={textRef2} className={`flex flex-col md:flex-row justify-evenly gap-10 ${isTextVisible2 ? "animate-slideInFromBottom" : "opacity-0"}`}>
        
        {/* Eco Lieu Card */}
        <div className="bg-transparent text-white text-left p-6 shadow-lg flex flex-col w-full md:w-1/3 relative">
            {/* Card Title */}
            <div className="absolute top-[20px] px-6 left-0 bg-[#6B1F1A] text-white text-center font-semibold py-2 px-4 w-max text-xl">
            Eco Lieu
            </div>
            {/* Image */}
            <div className="overflow-hidden mt-4">
            <img src="/images/eco-lieu.png" alt="Eco Lieu" className="w-full h-auto" />
            </div>
            {/* Text Content */}
            <p className="mt-4 text-sm">
            L’écolieu Art-Terre est situé au fort de Lestal dans la commune de Marthod en Savoie (vers Albertville).
            A 700m d’altitude en montagne, avec 7ha de terrain et 3800m2 de salles. Un beau potentiel et beaucoup de
            travaux en perspective! Le projet est de réhabiliter le lieu dans le respect du patrimoine. Nous avons pour
            objectif de lui donner une nouvelle vie axée spécifiquement sur la reconnexion à la nature et la création
            artistique.
            </p>
            <Link href="/eco-lieu" className="text-blue-500 mt-4 inline-block">
            En savoir plus →
            </Link>
        </div>

        {/* Ouvrages Card */}
        <div className="bg-transparent text-white text-left p-6 shadow-lg flex flex-col w-full md:w-1/3 relative">
            {/* Card Title */}
            <div className="absolute top-[20px] px-6 left-0 bg-[#6B1F1A] text-white text-center font-semibold py-2 px-4 w-max text-xl">
            Ouvrages
            </div>
            {/* Image */}
            <div className="overflow-hidden mt-4">
            <img src="/images/ouvrages.png" alt="Ouvrages" className="w-full h-auto" />
            </div>
            {/* Text Content */}
            <p className="mt-4 text-sm">
            Êtes-vous prêts à voyager dans les contrées inconnues, les univers étranges et l’humour insolite d’un ouvrage
            déroulant avec moult couleurs, dialogues, descriptions et réflexions? Si vous êtes intrigués, vous serez
            conquis, envoûtés par Les Humains adorent les Histoires.
            </p>
            <Link href="/ouvrages" className="text-blue-500 mt-4 inline-block">
            En savoir plus →
            </Link>
        </div>

        </div>
    </div>
    </section>
        </div>
    );
}