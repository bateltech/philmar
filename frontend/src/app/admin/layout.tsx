'use client';

import './admin-dark.css';
import { AuthProvider } from '@/lib/auth-context';
import { UnreadMessagesProvider } from '@/lib/unread-messages-context';
import { AdminThemeProvider, adminThemeInitScript } from '@/lib/admin-theme';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminThemeProvider>
      {/* Applique le thème sombre avant l'affichage pour éviter un flash blanc */}
      <script dangerouslySetInnerHTML={{ __html: adminThemeInitScript }} />
      <AuthProvider>
        <UnreadMessagesProvider>{children}</UnreadMessagesProvider>
      </AuthProvider>
    </AdminThemeProvider>
  );
}
