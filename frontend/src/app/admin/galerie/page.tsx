'use client';

import { useState, useEffect } from 'react';
import { AdminLayout, ConfirmDialog, ImageUploader } from '@/components/admin';
import { adminApi } from '@/lib/admin-api';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';

type GalerieType = 'galerie' | 'galerie_spectacle';

export default function GaleriePage() {
  const [galerieImages, setGalerieImages] = useState<string[]>([]);
  const [spectacleImages, setSpectacleImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<GalerieType>('galerie');
  const [deleteImage, setDeleteImage] = useState<{ path: string; index: number } | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [galerie, spectacle] = await Promise.all([
        adminApi.getContent<string[]>('galerie'),
        adminApi.getContent<string[]>('galerie_spectacle'),
      ]);
      setGalerieImages(galerie);
      setSpectacleImages(spectacle);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const currentImages = activeTab === 'galerie' ? galerieImages : spectacleImages;
  const category = activeTab === 'galerie' ? 'galerie' : 'spectacles/galerie';

  const handleUploadComplete = async (imagePath: string) => {
    try {
      const newImages = [...currentImages, imagePath];
      await adminApi.updateContent(activeTab, newImages);
      await loadData();
      setShowUploader(false);
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'image');
    }
  };

  const handleDelete = async () => {
    if (!deleteImage) return;

    try {
      const newImages = currentImages.filter((_, i) => i !== deleteImage.index);
      await adminApi.updateContent(activeTab, newImages);
      await loadData();
      setDeleteImage(null);
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Galerie">
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Galerie">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex items-center justify-between">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-4">
            <button
              onClick={() => setActiveTab('galerie')}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'galerie'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Galerie Accueil ({galerieImages.length})
            </button>
            <button
              onClick={() => setActiveTab('galerie_spectacle')}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'galerie_spectacle'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Galerie Spectacles ({spectacleImages.length})
            </button>
          </nav>
        </div>

        <button
          onClick={() => setShowUploader(!showUploader)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Ajouter une image
        </button>
      </div>

      {/* Uploader */}
      {showUploader && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-medium">Ajouter une image à la galerie</h3>
          <ImageUploader
            category={category}
            onUploadComplete={handleUploadComplete}
          />
        </div>
      )}

      {/* Image Grid */}
      {currentImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-16">
          <ImageIcon className="h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">Aucune image dans cette galerie</p>
          <button
            onClick={() => setShowUploader(true)}
            className="mt-2 text-blue-600 hover:underline"
          >
            Ajouter des images
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {currentImages.map((imagePath, index) => (
            <div
              key={`${imagePath}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
            >
              <img
                src={imagePath}
                alt={`Image ${index + 1}`}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 transition-all group-hover:bg-opacity-30">
                <button
                  onClick={() => setDeleteImage({ path: imagePath, index })}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                <p className="text-xs text-white opacity-75">#{index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteImage !== null}
        title="Supprimer l'image"
        message="Êtes-vous sûr de vouloir retirer cette image de la galerie ?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteImage(null)}
        confirmText="Supprimer"
      />
    </AdminLayout>
  );
}
