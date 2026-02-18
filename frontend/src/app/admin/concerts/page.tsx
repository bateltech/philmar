'use client';

import { useState, useEffect } from 'react';
import { AdminLayout, DataTable, ConfirmDialog, FormField, ImagePicker } from '@/components/admin';
import { adminApi } from '@/lib/admin-api';
import { X, Image as ImageIcon } from 'lucide-react';

interface Concert {
  title: string;
  description: string;
  image: string;
  link?: string;
}

export default function ConcertsPage() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Concert | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await adminApi.getContent<Concert[]>('concerts');
      setConcerts(data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem({ title: '', description: '', image: '', link: '' });
    setEditingIndex(-1);
  };

  const handleEdit = (item: Concert, index: number) => {
    setEditingItem({ ...item });
    setEditingIndex(index);
  };

  const handleDelete = async () => {
    if (deleteIndex === null) return;

    try {
      await adminApi.deleteItem('concerts', deleteIndex);
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
        await adminApi.addItem('concerts', editingItem);
      } else if (editingIndex !== null) {
        await adminApi.updateItem('concerts', editingIndex, editingItem);
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
      key: 'image',
      label: 'Image',
      width: '80px',
      render: (item: Concert) => (
        <div className="h-12 w-12 overflow-hidden rounded bg-gray-100">
          {item.image ? (
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
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
      key: 'description',
      label: 'Description',
      render: (item: Concert) => (
        <span className="line-clamp-2 text-sm text-gray-600">{item.description}</span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Concerts">
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Concerts">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}

      <DataTable
        data={concerts}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(_, index) => setDeleteIndex(index)}
        addLabel="Ajouter un concert"
        showIndex
      />

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setEditingItem(null)} />
          <div className="relative z-10 mx-2 w-full max-w-full md:max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-white p-4 md:p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingIndex === -1 ? 'Ajouter un concert' : 'Modifier le concert'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <FormField
              label="Titre"
              name="title"
              value={editingItem.title}
              onChange={(v) => setEditingItem({ ...editingItem, title: v as string })}
              required
            />

            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={editingItem.description}
              onChange={(v) => setEditingItem({ ...editingItem, description: v as string })}
              required
            />

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">Image</label>
              <div className="flex items-center gap-4">
                {editingItem.image && (
                  <img src={editingItem.image} alt="" className="h-16 w-16 rounded object-cover" />
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
              label="Lien"
              name="link"
              type="text"
              value={editingItem.link || ''}
              onChange={(v) => setEditingItem({ ...editingItem, link: v as string })}
              placeholder="/concerts/nom-du-concert"
            />

            <div className="flex justify-end gap-3">
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
            setEditingItem({ ...editingItem, image: path });
          }
        }}
        currentImage={editingItem?.image}
        category="concerts"
      />

      <ConfirmDialog
        isOpen={deleteIndex !== null}
        title="Supprimer le concert"
        message="Êtes-vous sûr de vouloir supprimer ce concert ? Cette action est irréversible."
        onConfirm={handleDelete}
        onCancel={() => setDeleteIndex(null)}
        confirmText="Supprimer"
      />
    </AdminLayout>
  );
}
