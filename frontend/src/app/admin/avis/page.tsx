'use client';

import { useState, useEffect } from 'react';
import { AdminLayout, DataTable, ConfirmDialog, FormField } from '@/components/admin';
import { adminApi } from '@/lib/admin-api';
import { X, MessageSquare } from 'lucide-react';

interface Avis {
  texte: string;
  auteur: string;
  lieu?: string;
}

type AvisType = 'avis_instruments' | 'avis_voix';

export default function AvisPage() {
  const [avisInstruments, setAvisInstruments] = useState<Avis[]>([]);
  const [avisVoix, setAvisVoix] = useState<Avis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AvisType>('avis_instruments');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Avis | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [instruments, voix] = await Promise.all([
        adminApi.getContent<Avis[]>('avis_instruments'),
        adminApi.getContent<Avis[]>('avis_voix'),
      ]);
      setAvisInstruments(instruments);
      setAvisVoix(voix);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const currentData = activeTab === 'avis_instruments' ? avisInstruments : avisVoix;

  const handleAdd = () => {
    setEditingItem({ texte: '', auteur: '', lieu: '' });
    setEditingIndex(-1);
  };

  const handleEdit = (item: Avis, index: number) => {
    setEditingItem({ ...item });
    setEditingIndex(index);
  };

  const handleDelete = async () => {
    if (deleteIndex === null) return;

    try {
      await adminApi.deleteItem(activeTab, deleteIndex);
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
        await adminApi.addItem(activeTab, editingItem);
      } else if (editingIndex !== null) {
        await adminApi.updateItem(activeTab, editingIndex, editingItem);
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
      key: 'texte',
      label: 'Avis',
      render: (item: Avis) => (
        <div className="flex items-start gap-3">
          <MessageSquare className="mt-1 h-5 w-5 shrink-0 text-gray-400" />
          <span className="line-clamp-3 text-sm text-gray-700">{item.texte}</span>
        </div>
      ),
    },
    { key: 'auteur', label: 'Auteur', width: '150px' },
    {
      key: 'lieu',
      label: 'Lieu',
      width: '150px',
      render: (item: Avis) => (
        <span className="text-sm text-gray-500">{item.lieu || '-'}</span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Avis">
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Avis">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex gap-4">
          <button
            onClick={() => setActiveTab('avis_instruments')}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'avis_instruments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Avis Instruments ({avisInstruments.length})
          </button>
          <button
            onClick={() => setActiveTab('avis_voix')}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'avis_voix'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Avis Voix ({avisVoix.length})
          </button>
        </nav>
      </div>

      <DataTable
        data={currentData}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(_, index) => setDeleteIndex(index)}
        addLabel="Ajouter un avis"
        showIndex
      />

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setEditingItem(null)} />
          <div className="relative z-10 mx-2 w-full max-w-full md:max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-white p-4 md:p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingIndex === -1 ? 'Ajouter un avis' : 'Modifier l\'avis'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <FormField
              label="Texte de l'avis"
              name="texte"
              type="textarea"
              value={editingItem.texte}
              onChange={(v) => setEditingItem({ ...editingItem, texte: v as string })}
              rows={5}
              required
            />

            <FormField
              label="Auteur"
              name="auteur"
              value={editingItem.auteur}
              onChange={(v) => setEditingItem({ ...editingItem, auteur: v as string })}
              required
            />

            <FormField
              label="Lieu"
              name="lieu"
              value={editingItem.lieu || ''}
              onChange={(v) => setEditingItem({ ...editingItem, lieu: v as string })}
              helpText="Optionnel"
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

      <ConfirmDialog
        isOpen={deleteIndex !== null}
        title="Supprimer l'avis"
        message="Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible."
        onConfirm={handleDelete}
        onCancel={() => setDeleteIndex(null)}
        confirmText="Supprimer"
      />
    </AdminLayout>
  );
}
