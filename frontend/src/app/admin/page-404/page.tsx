'use client';

import { useState, useEffect } from 'react';
import { AdminLayout, FormField } from '@/components/admin';
import { adminApi } from '@/lib/admin-api';

interface Page404Content {
  title: string;
  message: string;
}

const DEFAULTS: Page404Content = {
  title: '',
  message: '',
};

export default function Page404Admin() {
  const [content, setContent] = useState<Page404Content>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await adminApi.getContent<Page404Content>('page_404');
      setContent({ ...DEFAULTS, ...data });
    } catch {
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await adminApi.updateContent('page_404', content);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Page introuvable (404)">
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Page introuvable (404)">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">
          Modifications enregistrées avec succès.
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-500">
            Cette page s&apos;affiche lorsqu&apos;un visiteur arrive sur une adresse
            qui n&apos;existe pas. Personnalisez le texte affiché sur la page.
          </p>
        </div>

        <div className="p-6">
          <FormField
            label="Titre"
            name="title"
            value={content.title}
            onChange={(v) => setContent({ ...content, title: v as string })}
            placeholder="Vous voilà sur un horizon lointain"
            required
          />
          <FormField
            label="Message"
            name="message"
            type="textarea"
            rows={5}
            value={content.message}
            onChange={(v) => setContent({ ...content, message: v as string })}
            placeholder="Texte affiché sous le titre"
            helpText="Astuce : appuyez sur Entrée pour créer un saut de ligne / un nouveau paragraphe."
            required
          />

          <div className="mt-6 flex justify-end">
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
    </AdminLayout>
  );
}
