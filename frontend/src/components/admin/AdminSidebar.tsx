'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Music,
  Theater,
  Disc3,
  Guitar,
  Mic2,
  Users,
  MessageSquare,
  Image,
  FileText,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const menuItems = [
  { href: '/admin', icon: Home, label: 'Dashboard' },
  { href: '/admin/concerts', icon: Music, label: 'Concerts' },
  { href: '/admin/spectacles', icon: Theater, label: 'Spectacles' },
  { href: '/admin/discographie', icon: Disc3, label: 'Discographie' },
  { href: '/admin/instruments', icon: Guitar, label: 'Instruments' },
  { href: '/admin/voix', icon: Mic2, label: 'Voix' },
  { href: '/admin/ateliers', icon: Users, label: 'Ateliers' },
  { href: '/admin/avis', icon: MessageSquare, label: 'Avis' },
  { href: '/admin/galerie', icon: Image, label: 'Galerie' },
  { href: '/admin/documents', icon: FileText, label: 'Documents' },
  { href: '/admin/parametres', icon: Settings, label: 'Paramètres' },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 text-white transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">
            <h1 className="text-xl font-bold">Philmar Admin</h1>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="border-t border-gray-700 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
