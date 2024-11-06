'use client'
import FilterDropdown from '../../components/FilterDropdown';
import AlbumCard from '../../components/AlbumCard';
import { useState } from 'react';

export default function Discographie () {
    const [selectedGenre, setSelectedGenre] = useState<'all' | 'album' | 'enregistrement' | 'conte'>('all');

  return (
    <div className="min-h-screen bg-[length:100%_auto] bg-top bg-no-repeat" style={{ backgroundImage: "url('/images/sun_bg.png')" }}>
      <div className="container mx-auto py-24 px-4">
        <h1 className="text-4xl font-bold text-white mt-[8rem] mb-24 ml-12">Discographie</h1>
        
        {/* Filter Buttons */}
        <div className="flex justify-between mx-24">
            <div className="flex justify-center space-x-4 mb-8">
                <button
                onClick={() => setSelectedGenre('all')}
                className={`px-6 py-2 ${selectedGenre === 'all' ? 'bg-blue-950 border border-blue-950' : 'border border-white'}  text-white cursor-pointer hover:bg-blue-950 border hover:border-blue-950`}
                >
                Tout
                </button>
                <button
                onClick={() => setSelectedGenre('album')}
                className={`px-6 py-2 ${selectedGenre === 'album' ? 'bg-blue-950 border border-blue-950' : 'border border-white'}  text-white cursor-pointer hover:bg-blue-950 border hover:border-blue-950`}
                >
                Albums
                </button>
                <button
                onClick={() => setSelectedGenre('enregistrement')}
                className={`px-6 py-2 ${selectedGenre === 'enregistrement' ? 'bg-blue-950 border border-blue-950' : 'border border-white'}  text-white cursor-pointer hover:bg-blue-950 border hover:border-blue-950`}
                >
                Enregistrements
                </button>
                <button
                onClick={() => setSelectedGenre('conte')}
                className={`px-6 py-2 ${selectedGenre === 'conte' ? 'bg-blue-950 border border-blue-950' : 'border border-white'}  text-white cursor-pointer hover:bg-blue-950 border hover:border-blue-950`}
                >
                Contes
                </button>
            </div>

            <div className="flex justify-center space-x-4 mb-8">
                {/* Dropdown */}
                <FilterDropdown />
            </div>
        </div>

        {/* Albums Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 mx-24">

        {selectedGenre === 'all' || selectedGenre === 'album' ? (
          <AlbumCard title="Steppe by Steppe" imageSrc="/images/discographie/steppe_by_steppe.png" genre="album" forSale={true} 
          description="Un album ethno ou world par son appel au voyage et les instruments du monde, mais avec des sons bien rock, des inspirations classiques, des synthés aériens ou electro, des rythmes hip-hop, des harmonies jazz-funk, des chants gutturaux ou planants" />
        ) : null}
          
          {selectedGenre === 'all' || selectedGenre === 'album' ? (
          <AlbumCard title="ABRAXAS PROJEKT - Jérôme Paressant ''SHAKTI''" imageSrc="/images/discographie/shakti.png" genre="album" forSale={true} 
          description="Une musique où la clarinette, la voix, les instruments électriques, les percussions côtoient les sons ''échantillonnés'', les ''boucles'' électroniques… Musique à la fois tellurique, douce, tribale, onirique, incantatoire..." />
        ) : null}

        {selectedGenre === 'all' || selectedGenre === 'album' ? (
          <AlbumCard title="POLARIS" imageSrc="/images/discographie/polaris.png" genre="album" forSale={false} 
          description="Un duo d'improvisation piano-voix constitué par Matthieu Roussineau et Philippe Martin. C'est une musique spontanée, originale qui crée en temps réel ses mélodies et ses harmonies. Riches de leurs expériences musicales antérieures (classique, jazz, world,...), les 2 musiciens célèbrent en une écoute mutuelle et en empathie avec le public, la Musique de l'Instant." />
        ) : null}

        {selectedGenre === 'all' || selectedGenre === 'album' ? (
          <AlbumCard title="Sur le Chemin" imageSrc="/images/discographie/sur_le_chemin.png" genre="album" forSale={false} 
          description="C'est une musique libre et aérée quelque peu inspirée des éléments de la nature. Surtout acoustique, et fondée sur l'improvisation, cette  ''musique de l'Instant'' suscite rêverie ou méditation... Les chants répondent aux guitares ou aux flûtes, les sons et autres percussions impulsent des ambiances tranquilles, tour à tour légères ou profondes. Avec en bonus un remix électro d'un de ces morceaux par Abraxas et la clarinette de J. Paressant." />
        ) : null}

        {selectedGenre === 'all' || selectedGenre === 'album' ? (
          <AlbumCard title="ABRAXAS PROJEKT ''COSMIK''" imageSrc="/images/discographie/cosmik.jpg"  genre="album" forSale={false} 
          description="La rencontre des musiques électroniques et du jazz se nourrit d'influences ''transversales'', où Trip-Hop, Ambient, Dub, Musiques du Monde, Rock, Musiques Improvisées s'entrecroisent pour d'énergiques et contemplatives ''transes'' sonores." />
        ) : null}

        {selectedGenre === 'all' || selectedGenre === 'conte' ? (
          <AlbumCard title="Le Rêve d'Husky" imageSrc="/images/discographie/le_reve_dhusky.png" genre="conte" forSale={false}  
          description="Adaptation discographique du spectacle de marionnettes (Ti Mahot Marionnettes). Le petit chien Husky finit par s’endormir et plonge dans le monde du rêve. Il rencontre là toutes sortes de personnages amusants ou féériques qui le mèneront à l’oiseau des 7 couleurs." />
        ) : null}

        {selectedGenre === 'all' || selectedGenre === 'enregistrement' ? (
          <AlbumCard title="''STARMANIA'' Les Choucas" imageSrc="/images/discographie/les_choucas.png"  genre="enregistrement" forSale={false} 
          description="On ne présente plus le spectacle Starmania de M. Berger et L. Plamondon... Cette version du groupe régional pendant sa tournée en Rhône-Alpes est pleine de fraîcheur, avec une maîtrise vocale au service des chansons, des envolées guitaristiques, des moments d'émotion." />
        ) : null}

        {selectedGenre === 'all' || selectedGenre === 'enregistrement' ? (
          <AlbumCard title="GENRE HUMAIN - single ''LES PRETENDANTS''" imageSrc="/images/discographie/les_pretendants.png" genre="enregistrement" forSale={true} 
          description="Un single collector! Un marchand, un guerrier et un alchimiste prétendent chacun à leur manière conquérir la princesse… Avec des paroles d'inspiration médiévale, une voix théâtrale et une musique progressive, c'est une expression à la fois épique et humoristique de notre imaginaire d'une époque." />
        ) : null}

        {selectedGenre === 'all' || selectedGenre === 'album' ? (
          <AlbumCard title="PHILMAR L'instant" imageSrc="/images/discographie/linstant.png"  genre="album" forSale={false} 
          description="concert en solo ''free ethno ambiant'' Axée sur des improvisatons vocales sans paroles, une musique de l'instant nous enmène en voyage, nous fait danser. Sur le vif de l'inspiration, guitare, mix d'échantillonneur, percussions ou flûtes accompagnent les psalmodies mystiques, les mélopées chamaniques." />
        ) : null}

        {selectedGenre === 'all' || selectedGenre === 'conte' ? (
          <AlbumCard title="On fête Noël chez Mathilde et Renardeau (N°1)" imageSrc="/images/discographie/on_fete_noel.jpg" genre="conte" forSale={true} 
          description="Ce sont 6 histoires (4 conteurs dont Philmar font les voix des personnages) et 6 chansons (Philmar a arrangé et interprété des musiques traditionnelles, et des chansons ont été interprétées par des chorales d'enfants). Mathilde et Renardeau vivent en paroles et en musiques de multiples aventures avec leurs amis. Tour à tour drôles, inquiétantes et poétiques, ces histoires font plonger les enfants dans le monde enchanteur de la Vallée. Une ambiance d'hiver et de Noël pour cet album." />
        ) : null}

        {selectedGenre === 'all' || selectedGenre === 'conte' ? (
          <AlbumCard title="Retour en fanfare pour Mathilde et Renardeau (N°2)" imageSrc="/images/discographie/retour_en_fanfare.jpg" genre="conte"forSale={true} 
          description="Ce sont 6 histoires (4 conteurs dont Philmar font les voix des personnages) et 6 chansons (Philmar a arrangé et interprété des musiques traditionnelles, et des chansons ont été interprétées par des chorales d'enfants). Mathilde et Renardeau vivent en paroles et en musiques de multiples aventures avec leurs amis. Tour à tour drôles, inquiétantes et poétiques, ces histoires font plonger les enfants dans le monde enchanteur de la Vallée. Une ambiance légère et printanière pour cet album." />
        ) : null}

        {selectedGenre === 'all' || selectedGenre === 'conte' ? (
          <AlbumCard title=" Mathilde et Renardeau À la rescousse (N°3)" imageSrc="/images/discographie/a_la_rescousse.jpg" genre="conte" forSale={true} 
          description="Ce sont 6 histoires (4 conteurs dont Philmar font les voix des personnages) et 6 chansons (Philmar a arrangé et interprété des musiques traditionnelles, et des chansons ont été interprétées par des chorales d'enfants). Mathilde et Renardeau vivent en paroles et en musiques de multiples aventures avec leurs amis. Tour à tour drôles, inquiétantes et poétiques, ces histoires font plonger les enfants dans le monde enchanteur de la Vallée. Aventures et fêtes amusantes dans cet album." />
        ) : null}

          {selectedGenre === 'all' || selectedGenre === 'conte' ? (
          <AlbumCard title="Saint Nicolas frappe chez Mathilde et Renardeau (N°4)" imageSrc="/images/discographie/saint_nicolas.jpg" genre="conte" forSale={true} 
          description="Ce sont 6 histoires (4 conteurs dont Philmar font les voix des personnages) et 6 chansons (Philmar a arrangé et interprété des musiques traditionnelles, et des chansons ont été interprétées par des chorales d'enfants). Mathilde et Renardeau vivent en paroles et en musiques de multiples aventures avec leurs amis. Tour à tour drôles, inquiétantes et poétiques, ces histoires font plonger les enfants dans le monde enchanteur de la Vallée. Dans l'ambiance des Fêtes de fin d'année pour cet album, toujours de l'humour et de l'aventure avec Mathilde et Renardeau et leurs amis...." />
        ) : null}

          {selectedGenre === 'all' || selectedGenre === 'conte' ? (
          <AlbumCard title=" Mathilde et Renardeau Champions d'Europe (N°5)" imageSrc="/images/discographie/champions_deurope.jpg" genre="conte" forSale={true} 
          description="Ce sont 6 histoires (4 conteurs dont Philmar font les voix des personnages) et 4 chansons (des musiques des chansons traditionnelles interprétées par Philmar et d'autres musiciens, et des chorales d'enfants). Mathilde et Renardeau vivent en paroles et en musiques de multiples aventures avec leurs amis. Tour à tour drôles, inquiétantes et poétiques, ces histoires font plonger les enfants dans le monde enchanteur de la Vallée. Pour cet album, un regard humoristique sur le sport de compétition autour de l'équipe du sensationnel crapaud Scipio. Et bien sûr aventures et chansons qui attendent nos amis Mathilde et Renardeau...." />
          ) : null}

          {selectedGenre === 'all' || selectedGenre === 'enregistrement' ? (
          <AlbumCard title="GENRE HUMAIN ''HOMO MUTABILIS''" imageSrc="/images/discographie/the_shamanic_groove.jpg" genre="enregistrement" forSale={true} 
          description="A l'écoute des courants qui coulent dans le monde et au fond d'eux, ces ''humains'' expriment la Terre de l'humanité et de la nature. Ajoutant quelques enregistrements inédits de répétition à ceux de studio, ces divers morceaux offrent une palette large des inspirations du groupe... (chansons rock, groove, quelques envolées lyriques ou rock progressif, et des ambiances world, des percussions...)" />
          ) : null}

        {selectedGenre === 'all' || selectedGenre === 'enregistrement' ? (
          <AlbumCard title="ZIA ''ATMAN / TCHAÏ''" imageSrc="/images/discographie/zia.png" genre="enregistrement" forSale={false} 
          description="Une Quête du Son primordial, d'une authentique Transe libératrice, en parcourant tambours et cordes, voix et vents, paysages et peuples, dans une géographie imaginaire qui nous ramène au plus profond de nous-même. Instruments traditionnels et parfois électriques se répondent, et construisent l'architecture sonore éphémère propre à l'improvisation." />
        ) : null}

        {selectedGenre === 'all' || selectedGenre === 'album' ? (
          <AlbumCard title="PHILMAR/FLUCTUS ''RENCONTRE''" imageSrc="/images/discographie/rencontre.png"  genre="album" forSale={true} 
          description="C’est un mélange d'instruments ethniques et de machines électro, dans une approche plutôt planante même s’il y a souvent des rythmes. Les voix de ce duo prennent aussi une place importante au coeur de ces voyages sonores vivants. Car tout cela est mené par des improvisations (en enregistrement, sur scène) sur la base de quelques échantillons ou séquences choisis sur le vif. " />
        ) : null}

        </div>
      </div>
    </div>
  );
};

