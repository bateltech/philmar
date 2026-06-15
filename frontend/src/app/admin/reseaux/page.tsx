'use client';

import { useState, useEffect } from 'react';
import { AdminLayout, FormField } from '@/components/admin';
import { adminApi } from '@/lib/admin-api';
import { X, Globe, ExternalLink } from 'lucide-react';

interface SocialLink {
  id: string;
  label: string;
  url: string;
  active: boolean;
}

export default function ReseauxPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<SocialLink | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await adminApi.getContent<SocialLink[]>('social_links');
      setLinks(data);
    } catch {
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (index: number) => {
    const updated = links.map((link, i) =>
      i === index ? { ...link, active: !link.active } : link
    );
    try {
      await adminApi.updateContent('social_links', updated);
      setLinks(updated);
    } catch {
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleEdit = (item: SocialLink, index: number) => {
    setEditingItem({ ...item });
    setEditingIndex(index);
  };

  const handleSave = async () => {
    if (!editingItem || editingIndex === null) return;

    setIsSaving(true);
    setError(null);

    try {
      const updated = links.map((link, i) =>
        i === editingIndex ? editingItem : link
      );
      await adminApi.updateContent('social_links', updated);
      setLinks(updated);
      setEditingItem(null);
      setEditingIndex(null);
    } catch {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Réseaux sociaux">
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Réseaux sociaux">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-500">
            Activez ou désactivez les réseaux sociaux. Les réseaux désactivés disparaissent de tout le site.
          </p>
        </div>

        <ul className="divide-y divide-gray-200">
          {links.map((link, index) => (
            <li key={link.id} className="flex items-center gap-4 px-6 py-4">
              <Globe className="h-5 w-5 text-gray-400 shrink-0" />

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{link.label}</p>
                <p className="text-sm text-gray-500 truncate">{link.url}</p>
              </div>

              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 shrink-0"
                title="Ouvrir le lien"
              >
                <ExternalLink className="h-4 w-4" />
              </a>

              <button
                onClick={() => handleEdit(link, index)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 shrink-0"
              >
                Modifier
              </button>

              <button
                onClick={() => handleToggle(index)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                  link.active ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={link.active}
                aria-label={`${link.active ? 'Désactiver' : 'Activer'} ${link.label}`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    link.active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setEditingItem(null)} />
          <div className="relative z-10 mx-2 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Modifier {editingItem.label}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <FormField
                label="Nom"
                name="label"
                value={editingItem.label}
                onChange={(v) => setEditingItem({ ...editingItem, label: v as string })}
                required
              />
              <FormField
                label="URL"
                name="url"
                value={editingItem.url}
                onChange={(v) => setEditingItem({ ...editingItem, url: v as string })}
                required
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditingItem(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
