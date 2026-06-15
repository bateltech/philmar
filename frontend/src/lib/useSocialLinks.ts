'use client';

import { useState, useEffect, ReactNode, createElement } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faYoutube,
  faFacebookF,
  faInstagram,
  faSoundcloud,
  faBandcamp,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';

import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  active: boolean;
}

export interface SocialLinkWithIcon extends SocialLink {
  icon: IconDefinition | null;
  renderIcon: (className?: string) => ReactNode;
}

const ICON_MAP: Record<string, IconDefinition> = {
  youtube: faYoutube,
  facebook: faFacebookF,
  instagram: faInstagram,
  soundcloud: faSoundcloud,
  bandcamp: faBandcamp,
  linkedin: faLinkedinIn,
  email: faEnvelope,
};

function LinktreeIcon({ className }: { className?: string }) {
  return createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      className: className || 'w-[1em] h-[1em]',
      'aria-hidden': true,
    },
    createElement('path', {
      d: 'm13.73635 5.85251 4.00467-4.11665 2.3248 2.3808-4.20064 4.00466h5.9085v3.30473h-5.9365l4.22865 4.10766-2.3248 2.3338L12.0005 12.099l-5.74052 5.76852-2.3248-2.3248 4.22864-4.10766h-5.9375V8.12132h5.9085L3.93417 4.11666l2.3248-2.3808 4.00468 4.11665V0h3.4727zm-3.4727 10.30614h3.4727V24h-3.4727z',
    })
  );
}

export function useSocialLinks() {
  const [links, setLinks] = useState<SocialLinkWithIcon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/data/social_links.json')
      .then((res) => res.json())
      .then((data: SocialLink[]) => {
        const active = data
          .filter((link) => link.active)
          .map((link) => ({
            ...link,
            icon: ICON_MAP[link.id] || null,
            renderIcon: (className?: string) => {
              if (link.id === 'linktree') {
                return createElement(LinktreeIcon, { className });
              }

              const icon = ICON_MAP[link.id];
              if (icon) {
                return createElement(FontAwesomeIcon, {
                  icon,
                  className,
                });
              }

              return null;
            },
          }));

        setLinks(active);
      })
      .catch(() => setLinks([]))
      .finally(() => setIsLoading(false));
  }, []);

  return { links, isLoading };
}