'use client';

import { useState, useEffect } from 'react';
import { AdminLayout, DataTable, ConfirmDialog, FormField, ImagePicker } from '@/components/admin';
import { adminApi } from '@/lib/admin-api';
import { X, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface Album {
  title: string;
  imageSrc: string;
  genre: string;
  year: number;
  forSale: boolean;
  purchaseLink?: string;
  soundcloudLink?: string;
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
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingIndex === -1 ? 'Ajouter un album' : 'Modifier l\'album'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  label="Lien SoundCloud"
                  name="soundcloudLink"
                  type="url"
                  value={editingItem.soundcloudLink || ''}
                  onChange={(v) => setEditingItem({ ...editingItem, soundcloudLink: v as string })}
                  placeholder="https://soundcloud.com/..."
                />
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
