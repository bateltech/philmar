'use client';

import { useState, useEffect } from 'react';
import { X, Search, Upload, Check } from 'lucide-react';
import { adminApi, ImageMetadata } from '@/lib/admin-api';
import ImageUploader from './ImageUploader';

interface ImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imagePath: string) => void;
  currentImage?: string;
  category?: string;
}

export default function ImagePicker({
  isOpen,
  onClose,
  onSelect,
  currentImage,
  category,
}: ImagePickerProps) {
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(category || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadImages();
    }
  }, [isOpen, selectedCategory]);

  const loadCategories = async () => {
    try {
      const result = await adminApi.getImageCategories();
      setCategories(result.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const result = await adminApi.getImages(selectedCategory || undefined);
      setImages(result.images);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (imagePath: string) => {
    onSelect(imagePath);
    onClose();
  };

  const handleUploadComplete = (imagePath: string) => {
    setShowUploader(false);
    loadImages();
    handleSelect(imagePath);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 flex h-[80vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Sélectionner une image</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 border-b px-6 py-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowUploader(!showUploader)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            Importer
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {showUploader ? (
            <div className="mb-6">
              <ImageUploader
                category={selectedCategory || 'uploads'}
                onUploadComplete={handleUploadComplete}
                multiple={false}
              />
            </div>
          ) : null}

          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-gray-500">
              <p>Aucune image trouvée</p>
              <button
                onClick={() => setShowUploader(true)}
                className="mt-2 text-blue-600 hover:underline"
              >
                Importer une image
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <button
                  key={image.path}
                  onClick={() => handleSelect(image.path)}
                  className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    currentImage === image.path
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.thumbnail || image.path}
                    alt={image.name}
                    className="h-full w-full object-cover"
                  />
                  {currentImage === image.path && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-30">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="truncate text-xs text-white">{image.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
