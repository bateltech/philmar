export interface LegalNoticeSection {
  id: string;
  title: string;
  body: string;
  /** Clé d'icône choisie dans l'admin (voir legal-notice-icons.ts). */
  icon?: string;
}

export interface LegalNoticesContent {
  intro: string;
  sections: LegalNoticeSection[];
}

export const DEFAULT_LEGAL_NOTICES: LegalNoticesContent = {
  intro: 'Informations relatives à l’édition, à l’hébergement et à l’utilisation de ce site.',
  sections: [
    {
      id: 'edition',
      title: 'Édition du site',
      body: `Le présent site est le site officiel de Philmar.

Éditeur : nom et prénom, ou dénomination sociale, statut juridique et adresse du siège ou du domicile professionnel à compléter.

Immatriculation : numéro SIREN et, selon le statut, RCS ou répertoire applicable ; numéro de TVA intracommunautaire si l’éditeur y est assujetti. Informations à compléter selon la situation de l’éditeur.

Directeur de la publication : identité à compléter.

Contact : philmar @ lilo.org · 00 33 (0)6 28 06 07 56`,
    },
    {
      id: 'hosting',
      title: 'Hébergement',
      body: `Site web : Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis.

API : Render Services, Inc., 525 Brannan Street, Suite 300, San Francisco, CA 94107, États-Unis.

Vercel publie l’adresse e-mail privacy@vercel.com pour les questions relatives à sa notice de confidentialité. Render indique support@render.com pour l’assistance client. Aucun numéro de téléphone public des deux hébergeurs n’a pu être confirmé.`,
    },
    {
      id: 'intellectual-property',
      title: 'Propriété intellectuelle',
      body: 'Les textes, photographies, enregistrements, visuels et autres contenus présents sur ce site sont protégés par le droit de la propriété intellectuelle. Toute reproduction ou réutilisation nécessite l’autorisation préalable de leurs ayants droit, sauf exception prévue par la loi.',
    },
    {
      id: 'personal-data',
      title: 'Données personnelles',
      body: `Le formulaire de contact collecte le nom, l’adresse e-mail et le contenu du message afin de traiter les demandes et d’y répondre. Le responsable du traitement est l’éditeur du site, dont l’identité et les coordonnées doivent être renseignées dans la section « Édition du site ».

Les données sont accessibles à l’éditeur et peuvent être traitées par les prestataires techniques nécessaires au fonctionnement du formulaire et à la lutte contre les envois automatisés, notamment Cloudflare Turnstile. La base légale du traitement, les éventuels transferts hors de l’Union européenne et les durées de conservation doivent être précisés par le responsable du traitement selon la configuration effective des services.

Vous pouvez demander l’accès à vos données, leur rectification ou leur effacement, ainsi que la limitation du traitement ou vous y opposer dans les conditions prévues par la réglementation. Vous pouvez également introduire une réclamation auprès de la CNIL. Pour exercer vos droits, contactez l’éditeur aux coordonnées indiquées ci-dessus. Les modalités et délais de conservation doivent être complétés.`,
    },
    {
      id: 'cookies',
      title: 'Cookies et traceurs',
      body: 'Le formulaire charge le service anti-robot Cloudflare Turnstile. Les éventuels cookies ou autres traceurs déposés par ce service, leur finalité et les modalités de consentement applicables doivent être vérifiés avec la configuration utilisée. Les autres traceurs éventuellement déployés sur le site sont à recenser. Consultez également les informations de confidentialité de Cloudflare.',
    },
    {
      id: 'online-sales',
      title: 'Liens externes',
      icon: 'link',
      body: `Ce site contient des liens vers des sites tiers, notamment pour l’achat d’albums ou de billets de concerts. Ces achats sont effectués directement sur ces sites et sont régis par leurs propres conditions de vente.

Philmar n’exerce aucun contrôle sur ces sites et ne saurait être tenu responsable de leur contenu ni des transactions qui y sont réalisées.`,
    },
  ],
};

export function normalizeLegalNotices(value: unknown): LegalNoticesContent {
  if (!value || typeof value !== 'object') return DEFAULT_LEGAL_NOTICES;

  const content = value as Partial<LegalNoticesContent>;
  return {
    intro: typeof content.intro === 'string' ? content.intro : DEFAULT_LEGAL_NOTICES.intro,
    sections: Array.isArray(content.sections)
      ? content.sections.filter(
          (section): section is LegalNoticeSection =>
            !!section &&
            typeof section.id === 'string' &&
            typeof section.title === 'string' &&
            typeof section.body === 'string',
        )
      : DEFAULT_LEGAL_NOTICES.sections,
  };
}

export function toRichTextHtml(value: string): string {
  if (/<\/?[a-z][^>]*>/i.test(value)) return value;

  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) =>
      `<p>${paragraph
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>')}</p>`,
    )
    .join('');
}