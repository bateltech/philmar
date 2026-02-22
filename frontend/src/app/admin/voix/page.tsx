'use client';

import { useState, useEffect } from 'react';
import { AdminLayout, DataTable, ConfirmDialog, FormField, ImagePicker } from '@/components/admin';
import { adminApi } from '@/lib/admin-api';
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface VoixSection {
  label: string;
  content: string;
}

interface VoixItem {
  type: string;
  title: string;
  image: string;
  description?: string;
  objectifs?: string;
  moyens?: string;
  contenu?: string;
  horaires?: string;
  sections?: VoixSection[];
}

const typeOptions = [
  { value: 'cours', label: 'Cours' },
  { value: 'atelier', label: 'Atelier' },
  { value: 'stage', label: 'Stage' },
];

export default function VoixPage() {
  const [voixData, setVoixData] = useState<VoixItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<VoixItem | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await adminApi.getContent<VoixItem[]>('voix_data');
      setVoixData(data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem({
      type: 'cours',
      title: '',
      image: '',
      description: '',
    });
    setEditingIndex(-1);
  };

  const handleEdit = (item: VoixItem, index: number) => {
    setEditingItem({ ...item });
    setEditingIndex(index);
  };

  const handleDelete = async () => {
    if (deleteIndex === null) return;

    try {
      await adminApi.deleteItem('voix_data', deleteIndex);
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
        await adminApi.addItem('voix_data', editingItem);
      } else if (editingIndex !== null) {
        await adminApi.updateItem('voix_data', editingIndex, editingItem);
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
      render: (item: VoixItem) => (
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
      key: 'type',
      label: 'Type',
      render: (item: VoixItem) => {
        const colors: Record<string, string> = {
          cours: 'bg-blue-100 text-blue-700',
          atelier: 'bg-green-100 text-green-700',
          stage: 'bg-purple-100 text-purple-700',
        };
        return (
          <span className={`rounded-full px-2 py-1 text-xs capitalize ${colors[item.type] || 'bg-gray-100'}`}>
            {item.type}
          </span>
        );
      },
    },
    {
      key: 'description',
      label: 'Description',
      render: (item: VoixItem) => (
        <span className="line-clamp-2 text-sm text-gray-600">{item.description}</span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Voix">
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Voix">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}

      <DataTable
        data={voixData}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(_, index) => setDeleteIndex(index)}
        addLabel="Ajouter une offre"
        showIndex
      />

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setEditingItem(null)} />
          <div className="relative z-10 mx-2 w-full max-w-full md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-4 md:p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingIndex === -1 ? 'Ajouter une offre' : 'Modifier l\'offre'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Type"
                name="type"
                type="select"
                value={editingItem.type}
                onChange={(v) => setEditingItem({ ...editingItem, type: v as string })}
                options={typeOptions}
              />

              <div></div>

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

              <div className="col-span-2">
                <FormField
                  label="Description"
                  name="description"
                  type="textarea"
                  value={editingItem.description || ''}
                  onChange={(v) => setEditingItem({ ...editingItem, description: v as string })}
                  rows={3}
                  required
                />
              </div>

              {/* Cours & Ateliers : sections dynamiques */}
              {(editingItem.type === 'atelier' || editingItem.type === 'cours') && (
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Sections</label>
                    <button
                      type="button"
                      onClick={() => setEditingItem({
                        ...editingItem,
                        sections: [...(editingItem.sections || []), { label: '', content: '' }],
                      })}
                      className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" /> Ajouter
                    </button>
                  </div>
                  {(editingItem.sections || []).map((section, i) => (
                    <div key={i} className="mb-3 rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Section {i + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(editingItem.sections || [])];
                            updated.splice(i, 1);
                            setEditingItem({ ...editingItem, sections: updated });
                          }}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <FormField
                        label="Label"
                        name={`section-label-${i}`}
                        value={section.label}
                        onChange={(v) => {
                          const updated = [...(editingItem.sections || [])];
                          updated[i] = { ...updated[i], label: v as string };
                          setEditingItem({ ...editingItem, sections: updated });
                        }}
                        required
                      />
                      <FormField
                        label="Contenu"
                        name={`section-content-${i}`}
                        type="textarea"
                        value={section.content}
                        onChange={(v) => {
                          const updated = [...(editingItem.sections || [])];
                          updated[i] = { ...updated[i], content: v as string };
                          setEditingItem({ ...editingItem, sections: updated });
                        }}
                        rows={2}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Stages : champs fixes */}
              {editingItem.type === 'stage' && (
                <>
                  <div className="col-span-2">
                    <FormField
                      label="Objectifs"
                      name="objectifs"
                      type="textarea"
                      value={editingItem.objectifs || ''}
                      onChange={(v) => setEditingItem({ ...editingItem, objectifs: v as string })}
                      rows={2}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      label="Moyens"
                      name="moyens"
                      type="textarea"
                      value={editingItem.moyens || ''}
                      onChange={(v) => setEditingItem({ ...editingItem, moyens: v as string })}
                      rows={2}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      label="Contenu"
                      name="contenu"
                      type="textarea"
                      value={editingItem.contenu || ''}
                      onChange={(v) => setEditingItem({ ...editingItem, contenu: v as string })}
                      rows={3}
                    />
                  </div>

                  <FormField
                    label="Horaires"
                    name="horaires"
                    value={editingItem.horaires || ''}
                    onChange={(v) => setEditingItem({ ...editingItem, horaires: v as string })}
                    helpText="Ex: 10h-13h et 14h30-17h30"
                  />
                </>
              )}

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
            setEditingItem({ ...editingItem, image: path });
          }
        }}
        currentImage={editingItem?.image}
        category="voix"
      />

      <ConfirmDialog
        isOpen={deleteIndex !== null}
        title="Supprimer l'offre"
        message="Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible."
        onConfirm={handleDelete}
        onCancel={() => setDeleteIndex(null)}
        confirmText="Supprimer"
      />
    </AdminLayout>
  );
}
