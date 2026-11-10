'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Mail, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useUnreadMessages } from '@/lib/unread-messages-context';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { unreadCount, newSinceLastCheck, dismissNew } = useUnreadMessages();

  // Le toast n'a pas lieu d'être si on est déjà sur la page Messages
  useEffect(() => {
    if (pathname === '/admin/messages' && newSinceLastCheck > 0) dismissNew();
  }, [pathname, newSinceLastCheck, dismissNew]);

  // Compteur dans l'onglet du navigateur : "(2) Messages"
  useEffect(() => {
    document.title = unreadCount > 0 ? `(${unreadCount}) ${title} – Philmar Admin` : `${title} – Philmar Admin`;
  }, [unreadCount, title]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="admin-root flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-root min-h-screen bg-gray-100 text-gray-900">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-64">
        <AdminHeader title={title} onMenuToggle={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6">{children}</main>
      </div>

      {newSinceLastCheck > 0 && (
        <div
          role="status"
          className="fixed bottom-4 right-4 z-50 flex max-w-sm items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 text-white shadow-lg"
        >
          <Mail className="h-5 w-5 shrink-0 text-blue-400" />
          <Link href="/admin/messages" onClick={dismissNew} className="text-sm hover:underline">
            {newSinceLastCheck > 1
              ? `${newSinceLastCheck} nouveaux messages reçus`
              : 'Nouveau message reçu'}
          </Link>
          <button
            onClick={dismissNew}
            className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
