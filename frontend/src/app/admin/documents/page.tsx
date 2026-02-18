'use client';

import { useState, useEffect } from 'react';
import { AdminLayout, ConfirmDialog, DocumentUploader } from '@/components/admin';
import { adminApi, DocumentMetadata } from '@/lib/admin-api';
import { FileText, Trash2, Download, Plus, ExternalLink } from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDoc, setDeleteDoc] = useState<DocumentMetadata | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await adminApi.getDocuments();
      setDocuments(result.documents);
    } catch (err) {
      setError('Erreur lors du chargement des documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = () => {
    loadData();
    setShowUploader(false);
  };

  const handleDelete = async () => {
    if (!deleteDoc) return;

    try {
      await adminApi.deleteDocument(deleteDoc.name);
      await loadData();
      setDeleteDoc(null);
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <AdminLayout title="Documents">
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Documents">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-gray-600">{documents.length} document(s) PDF</p>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Ajouter un document
        </button>
      </div>

      {/* Uploader */}
      {showUploader && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-medium">Ajouter un document PDF</h3>
          <DocumentUploader onUploadComplete={handleUploadComplete} />
        </div>
      )}

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-16">
          <FileText className="h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">Aucun document</p>
          <button
            onClick={() => setShowUploader(true)}
            className="mt-2 text-blue-600 hover:underline"
          >
            Ajouter un document
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <div
                key={doc.path}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <div className="shrink-0 rounded-lg bg-red-100 p-2 md:p-3">
                    <FileText className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {formatFileSize(doc.size)} - {doc.path}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={doc.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                    title="Ouvrir"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                  <a
                    href={doc.path}
                    download
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                    title="Télécharger"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                  <button
                    onClick={() => setDeleteDoc(doc)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDoc !== null}
        title="Supprimer le document"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteDoc?.name}" ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDoc(null)}
        confirmText="Supprimer"
      />
    </AdminLayout>
  );
}
