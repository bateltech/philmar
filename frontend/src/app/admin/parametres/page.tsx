'use client';

import { useState, useEffect } from 'react';
import { AdminLayout, FormField } from '@/components/admin';
import { adminApi } from '@/lib/admin-api';
import { Save, Check } from 'lucide-react';

interface DernierAlbum {
  soundcloud: {
    playlistUrl: string;
  };
  vinyl?: {
    playlistUrl: string;
  };
}

export default function ParametresPage() {
  const [dernierAlbum, setDernierAlbum] = useState<DernierAlbum | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await adminApi.getContent<DernierAlbum>('dernier_album');
      setDernierAlbum(data);
    } catch (err) {
      setError('Erreur lors du chargement des paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!dernierAlbum) return;

    setIsSaving(true);
    setError(null);

    try {
      await adminApi.updateContent('dernier_album', dernierAlbum);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Paramètres">
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Paramètres">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}

      <div className="max-w-2xl">
        {/* Dernier Album Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Dernier Album (Page d&apos;accueil)</h2>
          <p className="mb-6 text-sm text-gray-600">
            Configurez le lecteur SoundCloud affiché sur la page d&apos;accueil.
          </p>

          {dernierAlbum && (
            <FormField
              label="URL de la playlist SoundCloud"
              name="playlistUrl"
              type="url"
              value={dernierAlbum.soundcloud.playlistUrl}
              onChange={(v) =>
                setDernierAlbum({
                  ...dernierAlbum,
                  soundcloud: { ...dernierAlbum.soundcloud, playlistUrl: v as string },
                })
              }
              placeholder="https://soundcloud.com/... ou https://bandcamp.com/EmbeddedPlayer/album=..."
              helpText="SoundCloud : collez l'URL de la playlist. Bandcamp : sur la page de l'album, cliquez Partager/Intégrer, copiez le code embed, et collez uniquement l'URL du src (celle qui commence par https://bandcamp.com/EmbeddedPlayer/album=...)"
            />
          )}
        </div>

        {/* Lecteur Vinyle Section */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Lecteur Vinyle</h2>
          <p className="mb-6 text-sm text-gray-600">
            Configurez la playlist SoundCloud jouée par le disque vinyle (visible sur toutes les pages).
          </p>

          {dernierAlbum && (
            <FormField
              label="URL de la playlist SoundCloud (Vinyle)"
              name="vinylPlaylistUrl"
              type="url"
              value={dernierAlbum.vinyl?.playlistUrl ?? ''}
              onChange={(v) =>
                setDernierAlbum({
                  ...dernierAlbum,
                  vinyl: { playlistUrl: v as string },
                })
              }
              placeholder="https://soundcloud.com/username/sets/playlist-name"
              helpText="Copiez l'URL de la playlist à jouer sur le lecteur vinyle"
            />
          )}
        </div>

        {/* Bouton Enregistrer */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Enregistrement...
              </>
            ) : saved ? (
              <>
                <Check className="h-4 w-4" />
                Enregistré
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Enregistrer
              </>
            )}
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-2 font-medium text-gray-900">Informations</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <strong>Types de contenu gérés :</strong> Concerts, Spectacles, Discographie,
              Instruments, Voix, Ateliers, Avis, Galeries
            </li>
            <li>
              <strong>Formats d&apos;images :</strong> PNG, JPG, GIF, WebP (max 10MB)
            </li>
            <li>
              <strong>Formats de documents :</strong> PDF (max 20MB)
            </li>
          </ul>
        </div>

        {/* Credentials reminder */}
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <h3 className="mb-2 font-medium text-yellow-800">Sécurité</h3>
          <p className="text-sm text-yellow-700">
            Pour modifier les identifiants de connexion, modifiez les variables
            d&apos;environnement dans le fichier <code className="rounded bg-yellow-100 px-1">.env</code> du backend :
          </p>
          <ul className="mt-2 space-y-1 text-sm text-yellow-700">
            <li><code className="rounded bg-yellow-100 px-1">ADMIN_USERNAME</code> - Nom d&apos;utilisateur</li>
            <li><code className="rounded bg-yellow-100 px-1">ADMIN_PASSWORD_HASH</code> - Hash bcrypt du mot de passe</li>
          </ul>
          <p className="mt-2 text-sm text-yellow-700">
            Utilisez <code className="rounded bg-yellow-100 px-1">npm run hash-password &lt;password&gt;</code> pour générer un hash.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
