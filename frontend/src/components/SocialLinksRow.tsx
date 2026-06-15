'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSocialLinks } from '@/lib/useSocialLinks';

export default function SocialLinksRow() {
  const { links, isLoading } = useSocialLinks();

  if (isLoading) return null;

  return (
    <div className="flex flex-wrap justify-center gap-5">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="text-white/50 hover:text-amber-500 transition-colors text-2xl"
        >
          {link.icon ? <FontAwesomeIcon icon={link.icon} /> : link.renderIcon('w-[1em] h-[1em]')}
        </Link>
      ))}
    </div>
  );
}
