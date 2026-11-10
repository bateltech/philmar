import {
  Building2,
  createLucideIcon,
  Copyright,
  FileText,
  Globe,
  Info,
  Link2,
  Mail,
  Music,
  Scale,
  Server,
  ShieldCheck,
  ShoppingCart,
  User,
  type LucideIcon,
} from 'lucide-react';
import type { LegalNoticeSection } from './legal-notices';

/**
 * Icône « cookie » de Lucide recréée sous un nom neutre : les bloqueurs de pub
 * (Brave, uBlock…) masquent tout élément dont la classe contient « cookie »,
 * et Lucide ajoute automatiquement la classe « lucide-cookie ».
 */
const Biscuit = createLucideIcon('biscuit', [
  ['path', { d: 'M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5', key: 'a' }],
  ['path', { d: 'M8.5 8.5v.01', key: 'b' }],
  ['path', { d: 'M16 15.5v.01', key: 'c' }],
  ['path', { d: 'M12 12v.01', key: 'd' }],
  ['path', { d: 'M11 17v.01', key: 'e' }],
  ['path', { d: 'M7 14v.01', key: 'f' }],
]);

export interface LegalNoticeIconOption {
  key: string;
  label: string;
  Icon: LucideIcon;
}

/** Icônes proposées dans l'admin pour les rubriques des mentions légales. */
export const LEGAL_NOTICE_ICONS: LegalNoticeIconOption[] = [
  { key: 'file', label: 'Document', Icon: FileText },
  { key: 'building', label: 'Éditeur / entreprise', Icon: Building2 },
  { key: 'user', label: 'Personne', Icon: User },
  { key: 'server', label: 'Hébergement', Icon: Server },
  { key: 'copyright', label: 'Propriété intellectuelle', Icon: Copyright },
  { key: 'shield', label: 'Données personnelles', Icon: ShieldCheck },
  { key: 'cookie', label: 'Cookies', Icon: Biscuit },
  { key: 'cart', label: 'Vente', Icon: ShoppingCart },
  { key: 'link', label: 'Liens externes', Icon: Link2 },
  { key: 'globe', label: 'Site / Internet', Icon: Globe },
  { key: 'mail', label: 'Contact', Icon: Mail },
  { key: 'scale', label: 'Juridique', Icon: Scale },
  { key: 'info', label: 'Information', Icon: Info },
  { key: 'music', label: 'Musique', Icon: Music },
];

/** Icône utilisée par les rubriques d'origine tant qu'aucune icône n'a été choisie dans l'admin. */
const DEFAULT_ICON_BY_SECTION_ID: Record<string, string> = {
  edition: 'building',
  hosting: 'server',
  'intellectual-property': 'copyright',
  'personal-data': 'shield',
  cookies: 'cookie',
  'online-sales': 'cart',
};

export function getSectionIconKey(section: Pick<LegalNoticeSection, 'id' | 'icon'>): string {
  if (section.icon && LEGAL_NOTICE_ICONS.some((o) => o.key === section.icon)) return section.icon;
  return DEFAULT_ICON_BY_SECTION_ID[section.id] ?? 'file';
}

export function getSectionIcon(section: Pick<LegalNoticeSection, 'id' | 'icon'>): LucideIcon {
  const key = getSectionIconKey(section);
  return LEGAL_NOTICE_ICONS.find((o) => o.key === key)?.Icon ?? FileText;
}
