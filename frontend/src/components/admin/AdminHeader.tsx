'use client';

import { useAuth } from '@/lib/auth-context';
import { User, Menu } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  onMenuToggle: () => void;
}

export default function AdminHeader({ title, onMenuToggle }: AdminHeaderProps) {
  const { username } = useAuth();

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

      <div className="flex items-center gap-2 text-gray-600">
        <User className="h-5 w-5" />
        <span className="hidden sm:inline">{username}</span>
      </div>
    </header>
  );
}
