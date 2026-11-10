import {
  Building2,
  Cookie,
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
  { key: 'cookie', label: 'Cookies', Icon: Cookie },
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
