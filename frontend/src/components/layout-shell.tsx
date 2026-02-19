'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { PlayerProvider } from '@/lib/player-context';
import VinylPlayer from '@/components/VinylPlayer';

export default function LayoutShell({
  navbar,
  footer,
  children,
}: {
  navbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && navbar}
      {isAdmin ? (
        children
      ) : (
        <PlayerProvider>
          {children}
          <VinylPlayer />
        </PlayerProvider>
      )}
      {!isAdmin && footer}
    </>
  );
}
