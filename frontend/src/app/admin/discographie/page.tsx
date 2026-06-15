'use client';

import { useState, useEffect } from 'react';
import { AdminLayout, DataTable, ConfirmDialog, FormField, ImagePicker } from '@/components/admin';
import { adminApi } from '@/lib/admin-api';
import { X, Image as ImageIcon, ExternalLink, Music, Trash2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';

interface AudioTrack {
  src: string;
  title: string;
}

interface Album {
  title: string;
  imageSrc: string;
  genre: string;
  year: number;
  forSale: boolean;
  purchaseLink?: string;
  soundcloudLink?: string;
  audioTracks?: AudioTrack[];
  description: string;
}

const genreOptions = [
  { value: 'album', label: 'Album' },
  { value: 'enregistrement', label: 'Enregistrement' },
  { value: 'conte', label: 'Conte' },
];

export default function DiscographiePage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Album | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await adminApi.getContent<Album[]>('discographie');
      setAlbums(data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem({
      title: '',
      imageSrc: '',
      genre: 'album',
      year: new Date().getFullYear(),
      forSale: false,
      purchaseLink: '',
      soundcloudLink: '',
      audioTracks: [],
      description: '',
    });
    setEditingIndex(-1);
  };

  const handleEdit = (item: Album, index: number) => {
    setEditingItem({ ...item });
    setEditingIndex(index);
  };

  const handleDelete = async () => {
    if (deleteIndex === null) return;

    try {
      await adminApi.deleteItem('discographie', deleteIndex);
      await loadData();
      setDeleteIndex(null);
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const handleAudioUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !editingItem) return;

    setIsUploadingAudio(true);
    setError(null);

    try {
      const { audio } = await adminApi.uploadAudio(Array.from(files), 'discographie');
      const newTracks: AudioTrack[] = audio.map((a) => ({ src: a.path, title: a.title }));
      setEditingItem((prev) =>
        prev ? { ...prev, audioTracks: [...(prev.audioTracks || []), ...newTracks] } : prev
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload du fichier audio');
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const updateTrack = (index: number, patch: Partial<AudioTrack>) => {
    setEditingItem((prev) => {
      if (!prev) return prev;
      const tracks = [...(prev.audioTracks || [])];
      tracks[index] = { ...tracks[index], ...patch };
      return { ...prev, audioTracks: tracks };
    });
  };

  const removeTrack = async (index: number) => {
    if (!editingItem) return;
    const track = editingItem.audioTracks?.[index];
    setEditingItem((prev) => {
      if (!prev) return prev;
      const tracks = [...(prev.audioTracks || [])];
      tracks.splice(index, 1);
      return { ...prev, audioTracks: tracks };
    });
    // Best-effort: supprime le fichier côté serveur
    if (track?.src) {
      try {
        await adminApi.deleteAudio(track.src);
      } catch {
        // Le fichier sera retiré de l'album à l'enregistrement même si la suppression échoue
      }
    }
  };

  const moveTrack = (index: number, direction: -1 | 1) => {
    setEditingItem((prev) => {
      if (!prev) return prev;
      const tracks = [...(prev.audioTracks || [])];
      const target = index + direction;
      if (target < 0 || target >= tracks.length) return prev;
      [tracks[index], tracks[target]] = [tracks[target], tracks[index]];
      return { ...prev, audioTracks: tracks };
    });
  };

  const handleSave = async () => {
    if (!editingItem) return;

    setIsSaving(true);
    setError(null);

    try {
      if (editingIndex === -1) {
        await adminApi.addItem('discographie', editingItem);
      } else if (editingIndex !== null) {
        await adminApi.updateItem('discographie', editingIndex, editingItem);
      }
      await loadData();
      setEditingItem(null);
      setEditingIndex(null);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      key: 'imageSrc',
      label: 'Image',
      width: '80px',
      render: (item: Album) => (
        <div className="h-12 w-12 overflow-hidden rounded bg-gray-100">
          {item.imageSrc ? (
            <img src={item.imageSrc} alt={item.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      ),
    },
    { key: 'title', label: 'Titre' },
    {
      key: 'genre',
      label: 'Genre',
      render: (item: Album) => (
        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs capitalize">
          {item.genre}
        </span>
      ),
    },
    { key: 'year', label: 'Année' },
    {
      key: 'forSale',
      label: 'En vente',
      render: (item: Album) => (
        <span className={`rounded-full px-2 py-1 text-xs ${item.forSale ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          {item.forSale ? 'Oui' : 'Non'}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Discographie">
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Discographie">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}

      <DataTable
        data={albums}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(_, index) => setDeleteIndex(index)}
        addLabel="Ajouter un album"
        showIndex
      />

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setEditingItem(null)} />
          <div className="relative z-10 mx-2 w-full max-w-full md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-4 md:p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingIndex === -1 ? 'Ajouter un album' : 'Modifier l\'album'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormField
                  label="Titre"
                  name="title"
                  value={editingItem.title}
                  onChange={(v) => setEditingItem({ ...editingItem, title: v as string })}
                  required
                />
              </div>

              <div className="col-span-2 mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">Image</label>
                <div className="flex items-center gap-4">
                  {editingItem.imageSrc && (
                    <img src={editingItem.imageSrc} alt="" className="h-20 w-20 rounded object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(true)}
                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
                  >
                    Choisir une image
                  </button>
                </div>
              </div>

              <FormField
                label="Genre"
                name="genre"
                type="select"
                value={editingItem.genre}
                onChange={(v) => setEditingItem({ ...editingItem, genre: v as string })}
                options={genreOptions}
              />

              <FormField
                label="Année"
                name="year"
                type="number"
                value={editingItem.year}
                onChange={(v) => setEditingItem({ ...editingItem, year: v as number })}
                required
              />

              <div className="col-span-2">
                <FormField
                  label="Description"
                  name="description"
                  type="textarea"
                  value={editingItem.description}
                  onChange={(v) => setEditingItem({ ...editingItem, description: v as string })}
                  rows={4}
                  required
                />
              </div>

              <div className="col-span-2">
                <FormField
                  label="En vente"
                  name="forSale"
                  type="toggle"
                  value={editingItem.forSale}
                  onChange={(v) => setEditingItem({ ...editingItem, forSale: v as boolean })}
                />
              </div>

              {editingItem.forSale && (
                <div className="col-span-2">
                  <FormField
                    label="Lien d'achat"
                    name="purchaseLink"
                    type="url"
                    value={editingItem.purchaseLink || ''}
                    onChange={(v) => setEditingItem({ ...editingItem, purchaseLink: v as string })}
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="col-span-2">
                <FormField
                  label="Lien d'écoute (SoundCloud, Bandcamp ou Spotify)"
                  name="soundcloudLink"
                  type="url"
                  value={editingItem.soundcloudLink || ''}
                  onChange={(v) => setEditingItem({ ...editingItem, soundcloudLink: v as string })}
                  placeholder="https://soundcloud.com/... · https://open.spotify.com/... · code iframe Bandcamp"
                  helpText={<>SoundCloud : collez l&apos;URL de la playlist ou du morceau.<br />Spotify : collez l&apos;URL de partage de l&apos;album/playlist/titre (ex : https://open.spotify.com/album/...).<br />Bandcamp : sur la page de l&apos;album, cliquez Partager/Intégrer, copiez le code embed complet (&lt;iframe ...&gt;) et collez-le ici.</>}
                />
              </div>

              {/* Fichiers MP3 */}
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Fichiers MP3
                </label>
                <p className="mb-2 text-xs text-gray-500">
                  Utilisés comme lecteur de secours quand aucun lien d&apos;écoute n&apos;est renseigné.
                  Plusieurs fichiers sont lus à la suite, dans l&apos;ordre de la liste.
                </p>

                {editingItem.audioTracks && editingItem.audioTracks.length > 0 && (
                  <ul className="mb-3 space-y-2">
                    {editingItem.audioTracks.map((track, i) => (
                      <li
                        key={track.src}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2"
                      >
                        <Music className="h-4 w-4 shrink-0 text-gray-400" />
                        <input
                          type="text"
                          value={track.title}
                          onChange={(e) => updateTrack(i, { title: e.target.value })}
                          placeholder="Titre du morceau"
                          className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => moveTrack(i, -1)}
                          disabled={i === 0}
                          className="rounded p-1 text-gray-500 hover:bg-gray-200 disabled:opacity-30"
                          title="Monter"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveTrack(i, 1)}
                          disabled={i === editingItem.audioTracks!.length - 1}
                          className="rounded p-1 text-gray-500 hover:bg-gray-200 disabled:opacity-30"
                          title="Descendre"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTrack(i)}
                          className="rounded p-1 text-red-500 hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
                  {isUploadingAudio ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Music className="h-4 w-4" />
                  )}
                  {isUploadingAudio ? 'Envoi en cours...' : 'Ajouter des MP3'}
                  <input
                    type="file"
                    accept="audio/mpeg,.mp3"
                    multiple
                    disabled={isUploadingAudio}
                    onChange={(e) => {
                      handleAudioUpload(e.target.files);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                </label>
              </div>
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

      <ImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={(path) => {
          if (editingItem) {
            setEditingItem({ ...editingItem, imageSrc: path });
          }
        }}
        currentImage={editingItem?.imageSrc}
        category="discographie"
      />

      <ConfirmDialog
        isOpen={deleteIndex !== null}
        title="Supprimer l'album"
        message="Êtes-vous sûr de vouloir supprimer cet album ? Cette action est irréversible."
        onConfirm={handleDelete}
        onCancel={() => setDeleteIndex(null)}
        confirmText="Supprimer"
      />
    </AdminLayout>
  );
}
