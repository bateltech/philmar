import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// L'admin est servi sur son propre sous-domaine, le site public sur le domaine principal.
// Les autres adresses (localhost, philmar.vercel.app) gardent /admin tel quel.
const ADMIN_HOST = 'admin.philmarzic.com';
const PUBLIC_HOSTS = ['philmarzic.com', 'www.philmarzic.com'];
const PUBLIC_ORIGIN = 'https://www.philmarzic.com';

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').split(':')[0].toLowerCase();
  const { pathname, search } = request.nextUrl;
  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/');

  if (host === ADMIN_HOST) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Le sous-domaine admin ne sert que l'admin : le reste part sur le site public
    if (!isAdminPath) {
      return NextResponse.redirect(`${PUBLIC_ORIGIN}${pathname}${search}`);
    }
  }

  if (PUBLIC_HOSTS.includes(host) && isAdminPath) {
    return NextResponse.redirect(`https://${ADMIN_HOST}${pathname}${search}`);
  }

  return NextResponse.next();
}

export const config = {
  // Pages uniquement : pas les fichiers statiques, les images ni les routes /api
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
};
