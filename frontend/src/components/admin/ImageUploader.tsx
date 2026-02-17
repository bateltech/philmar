'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';

interface ImageUploaderProps {
  category: string;
  onUploadComplete?: (imagePath: string) => void;
  multiple?: boolean;
}

export default function ImageUploader({
  category,
  onUploadComplete,
  multiple = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );

      if (files.length === 0) {
        setError('Veuillez déposer des fichiers images uniquement');
        return;
      }

      await uploadFiles(files);
    },
    [category]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    await uploadFiles(files);
    e.target.value = '';
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setError(null);

    try {
      if (multiple) {
        const result = await adminApi.uploadImages(files, category);
        if (result.images.length > 0 && onUploadComplete) {
          result.images.forEach((img) => onUploadComplete(img.path));
        }
      } else {
        const result = await adminApi.uploadImage(files[0], category);
        setPreview(result.image.path);
        if (onUploadComplete) {
          onUploadComplete(result.image.path);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du téléchargement');
    } finally {
      setIsUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-lg border border-gray-200 p-2">
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-full rounded object-cover"
          />
          <button
            onClick={clearPreview}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileSelect}
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Téléchargement...</p>
            </div>
          ) : (
            <>
              <div className="rounded-full bg-gray-100 p-3">
                {isDragging ? (
                  <ImageIcon className="h-8 w-8 text-blue-500" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {isDragging
                  ? 'Déposez vos images ici'
                  : 'Glissez-déposez ou cliquez pour sélectionner'}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                PNG, JPG, GIF, WebP (max 10MB)
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
