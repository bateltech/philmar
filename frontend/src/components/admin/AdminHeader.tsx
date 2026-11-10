'use client';

import { useAuth } from '@/lib/auth-context';
import { useAdminTheme } from '@/lib/admin-theme';
import { User, Menu, Sun, Moon } from 'lucide-react';
import NotificationBell from './NotificationBell';

interface AdminHeaderProps {
  title: string;
  onMenuToggle: () => void;
}

export default function AdminHeader({ title, onMenuToggle }: AdminHeaderProps) {
  const { username } = useAuth();
  const { theme, ready, toggleTheme } = useAdminTheme();
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg md:text-2xl font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 text-gray-600">
        <button
          type="button"
          onClick={toggleTheme}
          className="group rounded-lg p-2 transition-colors hover:bg-gray-100"
          title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          <span className="theme-toggle-icon relative block h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-active:scale-90">
            {/* Les deux icônes sont superposées : l'une tourne et disparaît pendant que l'autre apparaît */}
            <Sun
              className={`theme-toggle-icon absolute inset-0 h-5 w-5 text-amber-500 ${ready ? 'transition-all duration-500 ease-out' : ''} ${
                isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
              }`}
            />
            <Moon
              className={`theme-toggle-icon absolute inset-0 h-5 w-5 ${ready ? 'transition-all duration-500 ease-out' : ''} ${
                isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
          </span>
        </button>
        <NotificationBell />
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <span className="hidden sm:inline">{username}</span>
        </div>
      </div>
    </header>
  );
}
