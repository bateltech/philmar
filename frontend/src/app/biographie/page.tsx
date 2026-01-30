'use client';

import { useEffect } from 'react';
import Image from 'next/image';

import AOS from 'aos';
import Link from 'next/link';
import 'aos/dist/aos.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';



export default function Biographie() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-black text-white">
      {/* Section 1 */}
      <section className="flex flex-col md:flex-row items-center gap-8 pr-4" data-aos="fade-up">
        <div className="md:w-1/2">
          <Image src="/images/biographie/hero.png" alt="Première expérience" width={700} height={500} className="rounded-lg w-full h-auto object-cover" />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-xl font-bold mb-8">Premières expériences musicales</h2>
          <p className="text-sm leading-relaxed ml-8">
            Philmar est né en 1965 dans les montagnes de Haute-Savoie, où il découvre la grandeur et la vivacité enchanteresse de la nature et la foi liturgique celtique. Outre la randonnée en forêt, les cloches et la voix gutturale sont venues, culture non cultivée, constituer les bases et la passion pure de ses éveils musicaux.

            </p>
          <p className="text-sm leading-relaxed mt-8 ml-16">
            Ayant commencé la guitare classique à l&apos;âge de 12 ans, Philmar est surtout joueur dans des groupes de rock à partir de l&apos;âge de 16 ans. Autodidacte dès le départ, il n’a jamais suivi de cours de musique. Sa soif d’aventure le pousse vers le monde, à propager et à faire propager les musiques du monde, guidé par ses rencontres et son évolution personnelle.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="relative px-6 md:px-12 py-20 text-white bg-black" data-aos="fade-up">
        <div className="w-[80%] mx-auto relative z-10 flex flex-col justify-center h-[400px] text-left">
          <h2 className="text-xl font-bold mb-6">Professionnalisation</h2>
          <p className="w-[70%] text-sm leading-relaxed mb-4 text-left">
            Ainsi, dès 1986, Philmar a tourné avec le groupe Courrier Sud (rock-reggae) en première partie de Manu Dibango, Bill Deraime, Jean-Jacques Milteau, entre autres, et a enregistré un 45T en souscription.
          </p>
          <p className="w-[70%] text-sm leading-relaxed">
            Après diverses formations de reprises et des projets de compositions, Philmar a notamment joué, dans les années 1990, au sein du groupe Genre Humain. Au travers de compositions ce projet s’ouvrait à une palette sonore assez large, à l’image de son nom. Ces musiciens ont d’ailleurs expérimenté, à plusieurs reprises, une forme d’improvisation interactive avec le public. Pour Philmar, la musique, plus que jamais, était un langage et un échange enthousiasmants.
          </p>
        </div>

        {/* Positionnement précis des 3 images */}
        <div className="hidden md:block absolute top-12 right-10 w-[400px] h-[400px] pointer-events-none">
          {/* Image du haut */}
          <div className="absolute top-0 left-0 w-[180px] z-20">
            <Image
              src="/images/biographie/pro-1.png"
              alt="Photo 1"
              width={100}
              height={100}
              className="object-cover w-full"
            />
          </div>

          {/* Image du milieu */}
          <div className="absolute top-[60px] right-[50px] w-[240px] z-10">
            <Image
              src="/images/biographie/pro-2.png"
              alt="Photo 2"
              width={160}
              height={160}
              className="object-cover w-full"
            />
          </div>

          {/* Image du bas */}
          <div className="absolute top-[340px] right-0 w-[160px] z-30">
            <Image
              src="/images/biographie/pro-3.png"
              alt="Photo 3"
              width={130}
              height={130}
              className="object-cover w-full"
            />
          </div>
        </div>
      </section>



      {/* Section 3 - Nouvelles Orientations + Slider */}
      <section className="flex flex-col md:flex-row items-center gap-8 px-6 md:px-12 py-12" data-aos="fade-up">
        {/* Swiper remplaçant l&apos;image statique */}
        <div className="md:w-1/2 w-full h-[400px] relative overflow-hidden rounded-lg">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="w-full h-full"
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <SwiperSlide key={i} className="w-full h-full relative">
                <Image
                  src={`/images/biographie/orient-${i + 1}.png`}
                  alt={`Diapo ${i + 1}`}
                  fill
                  className="object-cover"
                  style={{ objectFit: 'cover' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Texte */}
        <div className="md:w-1/2">
          <h2 className="text-xl font-bold mb-4">Nouvelles Orientations</h2>
          <p className="text-sm leading-relaxed">
            À partir des années 2000 Philmar individualise son activité musicale tout en la diversifiant. Continuant à jouer dans des groupes musicaux, il fait aussi des concerts, en solo ou en co-création avec divers artistes de disciplines que la musique : le conte, le théâtre, les arts plastiques, la danse, le yoga, le clown. L’album Mille et une Graines (2006), de poésie et d’improvisation, l’associent tant à des artistes plasticiens qu’à des chercheurs scientifiques.
            <br /><br />
            En parallèle il commence à enseigner pour divers projets (notamment la musique et le soufî) et lors de l’été au Festival de Musiques du Réel, plus de 1000 participants, compositeurs et improvisateurs du monde entier. Il réalise également de nombreux projets dans le cadre de l’éducation nationale, des hôpitaux, ou en lien avec la parentalité et la petite enfance. Il développe également des projets dans les festivals, en colonie et en accompagnement d’autres disciplines (la danse notamment).
          </p>
        </div>
      </section>

      {/* Section 4 - Instruments + Diapo */}
      <section className="grid md:grid-cols-2 gap-8 px-6 md:px-12 py-12 items-center" data-aos="fade-up">
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold mb-4">Instruments et Chants du Monde - Improvisation</h2>
          <p className="text-sm leading-relaxed">
            L’intérêt de Philmar pour les musiques traditionnelles dans le monde se développe en parallèle de ses questionnements sur l’humanité, l’anthropologie. Il voyage dans quelques pays et en rapporte des instruments de musique, s’appropriant ensuite leur pratique de manière autodidacte. D’autres instruments s’ajouteront par la suite à sa collection grandissante. Il ne néglige pas pour autant les instruments électriques selon les projets.
          </p>
        </div>
        <div className="w-full">
          <Image
            src="/images/biographie/instrus-1.png"
            alt="Instrument 1"
            width={800}
            height={400}
            className="w-full object-cover rounded-lg"
          />
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8 px-6 md:px-12 pb-12 items-start" data-aos="fade-up">
        {/* New Swiper on the left */}
        <div className="w-full h-[400px] relative overflow-hidden rounded-lg">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="w-full h-full"
          >
            {['2', '3', '4', '5', '6'].map((n) => (
              <SwiperSlide key={n} className="w-full h-full relative">
                <Image
                  src={`/images/biographie/instrus-${n}.png`}
                  alt={`Instrument ${n}`}
                  fill
                  className="object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Existing text on the right — unmodified */}
        <div>
          <p className="text-sm leading-relaxed">
            De plus en plus l’improvisation prend une part importante dans sa démarche musicale, en recherche sur la présence scénique, un instrumentarium de plus en plus insolite. Nomadisme en concert et en médiation. Il va être comédien en utilisant autant son chant que le cri profond en résonance avec le projet de territoire Féminité Multi et aussi acteur et metteur en scène pour 1001 chants pour la paix programmé au festival IN d’Avignon (2011), repris en 2012. Ses animations concerneront notamment vers les stages de Chant ou la Découverte des Instruments du Monde.
          </p>
          <div className="flex gap-4 mt-4 flex-wrap">
            <Link href="/instruments"
             onClick={(e) => {
              e.preventDefault();  // Empêcher le comportement Next.js par défaut
              window.location.href = "/instruments"; // Forcer le reload
            }}>
              <button className="border px-4 py-1 rounded-full transition duration-200 ease-out hover:bg-white hover:text-black">Instruments du Monde</button>
            </Link>
            <Link href="/voix"
             onClick={(e) => {
              e.preventDefault();  // Empêcher le comportement Next.js par défaut
              window.location.href = "/voix"; // Forcer le reload
            }}>
              <button className="border px-4 py-1 rounded-full transition duration-200 ease-out hover:bg-white hover:text-black">Chants du Monde</button>
            </Link>
          </div>
        </div>
      </section>


      {/* Section 5 */}
      <section className="flex flex-col md:flex-row items-center gap-8 px-6 md:px-12 py-12" data-aos="fade-up">
        <div className="md:w-1/2">
          <h2 className="text-xl font-bold mb-4">Un Parcours Vivant</h2>
          <p className="text-sm leading-relaxed">
            Philmar allie son désir d’authenticité à un aspect ludique de la musique, explorant sans cesse de nouveaux langages à l’oreille et spontanément et à l’écoute. Ses collaborations diversifiées et son goût pour l’improvisation, militant éthique, inspiration et recherche sonore, ont marqué son parcours, toujours en évolution.
          </p>
        </div>
        <div className="md:w-1/2">
          <Image src="/images/biographie/parcours.png" alt="Parcours vivant" width={600} height={400} className="rounded-lg w-full object-cover" />
        </div>
      </section>
    </div>
  );
}
