'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

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
      {children}
      {!isAdmin && footer}
    </>
  );
}
