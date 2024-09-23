import Image from 'next/image';
import Link from 'next/link';

export default function Accueil() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Section 1: Hero */}
      <section className="relative h-screen bg-contain bg-left bg-no-repeat" style={{ backgroundImage: "url('/images/hero_philmar.png')" }}>
        {/*<div className="absolute inset-0 bg-black bg-opacity-30"></div>*/} {/* Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-center items-end text-white px-8">
            <div className="flex flex-col items-start mr-10">
                <h1 className="text-3xl font-semibold mb-4 text-black">Philmar - Philippe Martin</h1>
                <p className="max-w-lg text-lg mb-6 text-black">
                    Musicien dans l'âme et professionnel depuis plus de 30 ans, Philmar vibre et fait vibrer de ses chants et instruments, nous faisant ainsi voyager vers de lointains horizons et jusqu'au cœur de nous-même.
                </p>
                <button className="bg-blue-950 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-between">
                    Écoutez mon dernier album        
                    {/* Triangle avec coins arrondis et rotation */}
                    <svg className="ml-8" xmlns="http://www.w3.org/2000/svg" width="23" height="23" style={{ transform: 'rotate(90deg)' }}>
                    <path stroke="none" fill="white" d="M8.9019237886467 4.1076951545867a3 3 0 0 1 5.1961524227066 0l6.8038475772934 11.784609690827a3 3 0 0 1 -2.5980762113533 4.5l-13.607695154587 0a3 3 0 0 1 -2.5980762113533 -4.5">

                    </path>
                    </svg>
                </button>
            </div>
        </div>
      </section>

        {/* Section 2: Biographie */}
        <section className="py-16 bg-white">
            <div className="container mx-auto h-full flex flex-col md:flex-row items-center">
                {/* Text Section */}
                <div className="md:w-1/2 p-8">
                <h2 className="text-4xl font-bold mb-4 text-black">Biographie</h2>
                <p className="text-lg text-black mb-4">
                    Musicien depuis plus de 30 ans, j’ai eu la chance de jouer dans de nombreux groupes, explorant des genres variés comme le rock, la variété, le jazz, l’ethnique, l’électro et le folk. J’ai également enregistré plusieurs albums et collaboré avec des conteurs, des comédiens, des danseuses et des plasticiens pour des spectacles et des performances.
                </p>
                <p className="text-lg text-black mb-4">
                    J’ai commencé avec la guitare, tant acoustique qu’électrique, mais je me suis rapidement tourné vers le chant, qui est devenu mon instrument de prédilection...
                </p>
                <button className="mt-4 border border-black text-black font-semibold py-2 px-6 rounded-lg hover:bg-black hover:text-white transition">
                    Lire plus sur Philmar...
                </button>
                </div>

            {/* Image Section with Decorative Squares */}
            <div className="md:w-1/2 p-4 relative">
                {/* Decorative Squares */}
                <div className="relative flex flex-col items-center justify-center">
                
                    {/* Portrait Image as an element inside the div */}
                    <div 
                        className="relative w-[360px] h-[640px] bg-cover bg-center shadow-lg z-10"
                        style={{ backgroundImage: "url('/images/biographie_image.jpg')" }}>
                        {/* Actual img element for better control and accessibility */}
                        <img src="/images/biographie_image.jpg" alt="Biographie" className="w-full h-full object-cover" />
                        {/* Decorative Squares under the image */}
                    <div className="absolute top-[-8px] left-[-8px] w-16 h-16 border-t-2 border-l-2 border-black z-0"></div>
                    <div className="absolute bottom-[-8px] right-[-8px] w-16 h-16 border-b-2 border-r-2 border-black z-0"></div>

                    </div>
                </div>
            </div>

            </div>
        </section>



      {/* Section 3: Performances */}
      <section className="relative py-16 bg-cover bg-center text-white" style={{ backgroundImage: "url('/images/performances-bg.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div> {/* Overlay */}
        <div className="relative z-10 container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Performances</h2>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
            {/* Spectacles Card */}
            <div className="bg-white text-black p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold">Spectacles</h3>
              <p className="mt-2">
                Des spectacles variés, basés sur l'improvisation, offrant une expérience unique...
              </p>
              <Link href="/spectacles">
                <button className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded">
                  En savoir plus
                </button>
              </Link>
            </div>
            {/* Concerts Card */}
            <div className="bg-white text-black p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold">Concerts</h3>
              <p className="mt-2">
                Profondeur de la musique, exploration musicale à travers différents instruments...
              </p>
              <Link href="/concerts">
                <button className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded">
                  En savoir plus
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Formations */}
      <section className="relative py-16 bg-cover bg-center text-white" style={{ backgroundImage: "url('/images/formations-bg.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div> {/* Overlay */}
        <div className="relative z-10 container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Formations</h2>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
            {/* Voix Card */}
            <div className="bg-white text-black p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold">Voix</h3>
              <p className="mt-2">
                L'art du chant avec des techniques vocales uniques, ateliers immersifs...
              </p>
              <Link href="/voix">
                <button className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded">
                  En savoir plus
                </button>
              </Link>
            </div>
            {/* Instruments du monde Card */}
            <div className="bg-white text-black p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold">Instruments du monde</h3>
              <p className="mt-2">
                Exploration des instruments du monde, techniques anciennes, partage musical...
              </p>
              <Link href="/instruments">
                <button className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded">
                  En savoir plus
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Autres Passions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Autres Passions</h2>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
            {/* Eco Lieu Card */}
            <div className="bg-gray-100 text-black p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold">Eco lieu</h3>
              <p className="mt-2">
                Un lieu éco-responsable, ancré dans la nature et la préservation de l'environnement...
              </p>
              <Link href="/eco-lieu">
                <button className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded">
                  En savoir plus
                </button>
              </Link>
            </div>
            {/* Ouvrages Card */}
            <div className="bg-gray-100 text-black p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold">Ouvrages</h3>
              <p className="mt-2">
                Des livres et créations artistiques, partages culturels à travers les âges...
              </p>
              <Link href="/ouvrages">
                <button className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded">
                  En savoir plus
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
