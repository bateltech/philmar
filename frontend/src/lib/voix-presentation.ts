/**
 * Les 3 cartes de présentation de la page Voix (La méthode, Les objectifs, Les moyens).
 * Stockées dans la table `content` sous le type `voix_presentation`.
 * `content` est du HTML produit par l'éditeur de texte de l'admin.
 */
export interface VoixPresentationSection {
  key: string;
  title: string;
  subtitle: string;
  content: string;
  image: string;
}

// Contenu d'origine, utilisé tant que rien n'a été enregistré depuis l'admin
export const DEFAULT_VOIX_PRESENTATION: VoixPresentationSection[] = [
  {
    key: 'methode',
    title: 'La méthode',
    subtitle: '"Le Champ des Voix - la Voie du Chant"',
    image: '/images/voix/methode.jpg',
    content:
      "<p>C'est une approche qui repose sur une série d'exercices ludiques destinés à retrouver le naturel de sa voix, et ainsi son expressivité. L'exploration vocale et l'improvisation en sont les piliers : chanter sans paroles, jouer avec les sons et laisser place au jeu et à l'échange.</p>" +
      "<p>L'objectif est de développer une musicalité naturelle en s'affranchissant de la technique au profit d'une perception intuitive des intentions vocales et sonores. L'improvisation, abordée sous un angle ludique, favorise l'expression des émotions et la connexion avec l'essentiel de chacun. Des jeux simples permettent d'expérimenter la relation entre intérieur et extérieur, facilitant l'écoute, la communication et l'ouverture aux autres.</p>",
  },
  {
    key: 'objectifs',
    title: 'Les objectifs',
    subtitle: "(Le formateur s'adapte selon la demande ou les besoins du contexte et du public)",
    image: '/images/voix/objectifs.jpg',
    content:
      "<p>À qui s'adresse un atelier ponctuel ou une série d'ateliers&nbsp;?</p>" +
      '<ul>' +
      '<li><p><strong>Privé&nbsp;:</strong> Artistes, entreprises, musicothérapie.</p></li>' +
      '<li><p><strong>Public&nbsp;:</strong> Particuliers, centres culturels, développement personnel, associations, festivals.</p></li>' +
      '</ul>' +
      "<p><strong><u>Cohésion de groupe</u></strong> – développer un esprit d'équipe et un engagement collectif.</p>" +
      '<p><strong><u>Expression artistique</u></strong> – explorer les sonorités et stimuler la créativité vocale.</p>' +
      "<p><strong><u>Développement personnel</u></strong> – libérer sa voix pour favoriser l'épanouissement individuel.</p>" +
      "<p>L'improvisation en groupe encourage naturellement l'empathie et la co-création, permettant de retrouver une perception ludique des sons et d'expérimenter un chant libre et spontané. S'en suit naturellement un plaisir de l'échange et un sentiment de partage qui ouvrent à la confiance en la coopération.</p>",
  },
  {
    key: 'moyens',
    title: 'Les moyens',
    subtitle: 'selon les objectifs ou le choix du stage/atelier/cours',
    image: '/images/voix/moyens.jpg',
    content:
      '<ul>' +
      '<li><p>Échauffements physiques et énergétiques (Do In, Qi-Gong, danse libre…).</p></li>' +
      '<li><p>Préparation vocale ludique (rire, théâtre sonore…).</p></li>' +
      "<li><p>Jeux sur l'expression corporelle et vocale (souffle, percussions corporelles, mélodies…).</p></li>" +
      '<li><p>Exploration stylistique et vocale (tessitures, yodel, chant diphonique, phonèmes, élocution…).</p></li>' +
      '<li><p>Pratique interactive (chants en cercle, dialogues, improvisations collectives…) sur toutes sortes de jeux vocaux.</p></li>' +
      "<li><p>Utilisation d'instruments simples par les participants (maracas, tambourins, flûtes harmoniques…) et accompagnement d'instruments par l'animateur (guitare, harmonium, tambour sur cadre, djembé, esraj…).</p></li>" +
      '<li><p>Informations didactiques adaptées aux demandes, au contexte.</p></li>' +
      '</ul>',
  },
];
