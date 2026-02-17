'use client';

import { useAuth } from '@/lib/auth-context';
import { User } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const { username } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center gap-2 text-gray-600">
        <User className="h-5 w-5" />
        <span>{username}</span>
      </div>
    </header>
  );
}
