'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin';
import { adminApi } from '@/lib/admin-api';
import {
  Music,
  Theater,
  Disc3,
  Guitar,
  Mic2,
  Users,
  MessageSquare,
  Image,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

interface ContentStats {
  concerts: number;
  spectacles: number;
  discographie: number;
  instruments: number;
  voix_data: number;
  ateliers_instruments: number;
  avis_instruments: number;
  avis_voix: number;
  galerie: number;
}

const statCards = [
  { key: 'concerts', label: 'Concerts', icon: Music, href: '/admin/concerts', color: 'bg-blue-500' },
  { key: 'spectacles', label: 'Spectacles', icon: Theater, href: '/admin/spectacles', color: 'bg-purple-500' },
  { key: 'discographie', label: 'Albums', icon: Disc3, href: '/admin/discographie', color: 'bg-green-500' },
  { key: 'instruments', label: 'Instruments', icon: Guitar, href: '/admin/instruments', color: 'bg-orange-500' },
  { key: 'voix_data', label: 'Voix', icon: Mic2, href: '/admin/voix', color: 'bg-pink-500' },
  { key: 'ateliers_instruments', label: 'Ateliers', icon: Users, href: '/admin/ateliers', color: 'bg-yellow-500' },
  { key: 'avis_instruments', label: 'Avis Instruments', icon: MessageSquare, href: '/admin/avis', color: 'bg-teal-500' },
  { key: 'avis_voix', label: 'Avis Voix', icon: MessageSquare, href: '/admin/avis', color: 'bg-indigo-500' },
  { key: 'galerie', label: 'Images Galerie', icon: Image, href: '/admin/galerie', color: 'bg-red-500' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [
        concerts,
        spectacles,
        discographie,
        instruments,
        voix_data,
        ateliers_instruments,
        avis_instruments,
        avis_voix,
        galerie,
      ] = await Promise.all([
        adminApi.getContent<unknown[]>('concerts'),
        adminApi.getContent<unknown[]>('spectacles'),
        adminApi.getContent<unknown[]>('discographie'),
        adminApi.getContent<unknown[]>('instruments'),
        adminApi.getContent<unknown[]>('voix_data'),
        adminApi.getContent<unknown[]>('ateliers_instruments'),
        adminApi.getContent<unknown[]>('avis_instruments'),
        adminApi.getContent<unknown[]>('avis_voix'),
        adminApi.getContent<unknown[]>('galerie'),
      ]);

      setStats({
        concerts: concerts.length,
        spectacles: spectacles.length,
        discographie: discographie.length,
        instruments: instruments.length,
        voix_data: voix_data.length,
        ateliers_instruments: ateliers_instruments.length,
        avis_instruments: avis_instruments.length,
        avis_voix: avis_voix.length,
        galerie: galerie.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="mb-8">
        <h2 className="text-lg text-gray-600">
          Bienvenue dans l'interface d'administration Philmar
        </h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            const count = stats?.[card.key as keyof ContentStats] ?? 0;

            return (
              <Link
                key={card.key}
                href={card.href}
                className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg p-3 ${card.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-500">{card.label}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-12">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Actions rapides</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/discographie"
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300 hover:bg-blue-50"
          >
            <Disc3 className="h-5 w-5 text-blue-600" />
            <span className="text-blue-600">Ajouter un album</span>
          </Link>
          <Link
            href="/admin/galerie"
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300 hover:bg-blue-50"
          >
            <Image className="h-5 w-5 text-blue-600" />
            <span className="text-blue-600">Gérer la galerie</span>
          </Link>
          <Link
            href="/admin/documents"
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300 hover:bg-blue-50"
          >
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="text-blue-600">Gérer les documents</span>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
