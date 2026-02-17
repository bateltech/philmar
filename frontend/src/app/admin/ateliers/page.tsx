'use client';

import { useState, useEffect } from 'react';
import { AdminLayout, DataTable, ConfirmDialog, FormField, ImagePicker, DocumentPicker } from '@/components/admin';
import { adminApi } from '@/lib/admin-api';
import { X, Image as ImageIcon, FileText } from 'lucide-react';

interface Atelier {
  nom: string;
  image: string;
  description?: string;
  objectifs?: string;
  approche?: string;
  deroulement?: string;
  pdf?: string;
}

export default function AteliersPage() {
  const [ateliers, setAteliers] = useState<Atelier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Atelier | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await adminApi.getContent<Atelier[]>('ateliers_instruments');
      setAteliers(data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem({
      nom: '',
      image: '/images/ateliers/no_atelier.png',
      description: '',
      objectifs: '',
      approche: '',
      deroulement: '',
      pdf: '',
    });
    setEditingIndex(-1);
  };

  const handleEdit = (item: Atelier, index: number) => {
    setEditingItem({ ...item });
    setEditingIndex(index);
  };

  const handleDelete = async () => {
    if (deleteIndex === null) return;

    try {
      await adminApi.deleteItem('ateliers_instruments', deleteIndex);
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
        await adminApi.addItem('ateliers_instruments', editingItem);
      } else if (editingIndex !== null) {
        await adminApi.updateItem('ateliers_instruments', editingIndex, editingItem);
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
      render: (item: Atelier) => (
        <div className="h-12 w-12 overflow-hidden rounded bg-gray-100">
          {item.image ? (
            <img src={item.image} alt={item.nom} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      ),
    },
    { key: 'nom', label: 'Nom' },
    {
      key: 'pdf',
      label: 'PDF',
      render: (item: Atelier) => (
        item.pdf ? (
          <a href={item.pdf} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
            <FileText className="h-4 w-4" />
            <span className="text-sm">Voir</span>
          </a>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        )
      ),
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Ateliers">
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Ateliers">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}

      <DataTable
        data={ateliers}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(_, index) => setDeleteIndex(index)}
        addLabel="Ajouter un atelier"
        showIndex
      />

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setEditingItem(null)} />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingIndex === -1 ? 'Ajouter un atelier' : 'Modifier l\'atelier'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <FormField
              label="Nom"
              name="nom"
              value={editingItem.nom}
              onChange={(v) => setEditingItem({ ...editingItem, nom: v as string })}
              required
            />

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">Image</label>
              <div className="flex items-center gap-4">
                {editingItem.image && (
                  <img src={editingItem.image} alt="" className="h-20 w-20 rounded object-cover" />
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
              label="Description"
              name="description"
              type="textarea"
              value={editingItem.description || ''}
              onChange={(v) => setEditingItem({ ...editingItem, description: v as string })}
              rows={3}
            />

            <FormField
              label="Objectifs"
              name="objectifs"
              type="textarea"
              value={editingItem.objectifs || ''}
              onChange={(v) => setEditingItem({ ...editingItem, objectifs: v as string })}
              rows={2}
            />

            <FormField
              label="Approche"
              name="approche"
              type="textarea"
              value={editingItem.approche || ''}
              onChange={(v) => setEditingItem({ ...editingItem, approche: v as string })}
              rows={3}
            />

            <FormField
              label="Déroulement"
              name="deroulement"
              type="textarea"
              value={editingItem.deroulement || ''}
              onChange={(v) => setEditingItem({ ...editingItem, deroulement: v as string })}
              rows={2}
            />

            <DocumentPicker
              label="Document PDF"
              value={editingItem.pdf || ''}
              onChange={(v) => setEditingItem({ ...editingItem, pdf: v })}
              helpText="Sélectionnez un document parmi ceux uploadés"
            />

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
            setEditingItem({ ...editingItem, image: path });
          }
        }}
        currentImage={editingItem?.image}
        category="ateliers"
      />

      <ConfirmDialog
        isOpen={deleteIndex !== null}
        title="Supprimer l'atelier"
        message="Êtes-vous sûr de vouloir supprimer cet atelier ? Cette action est irréversible."
        onConfirm={handleDelete}
        onCancel={() => setDeleteIndex(null)}
        confirmText="Supprimer"
      />
    </AdminLayout>
  );
}
