'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';

interface DocumentUploaderProps {
  onUploadComplete?: (documentPath: string) => void;
}

export default function DocumentUploader({
  onUploadComplete,
}: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === 'application/pdf'
    );

    if (files.length === 0) {
      setError('Veuillez déposer des fichiers PDF uniquement');
      return;
    }

    await uploadFile(files[0]);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
    e.target.value = '';
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await adminApi.uploadDocument(file);
      setUploadedFile(result.document.name);
      if (onUploadComplete) {
        onUploadComplete(result.document.path);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du téléchargement');
    } finally {
      setIsUploading(false);
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
  };

  return (
    <div className="w-full">
      {uploadedFile ? (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-red-500" />
            <span className="text-sm text-gray-700">{uploadedFile}</span>
          </div>
          <button
            onClick={clearUpload}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
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
            accept="application/pdf"
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
                  <FileText className="h-8 w-8 text-blue-500" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {isDragging
                  ? 'Déposez votre PDF ici'
                  : 'Glissez-déposez ou cliquez pour sélectionner'}
              </p>
              <p className="mt-1 text-xs text-gray-400">PDF uniquement (max 20MB)</p>
            </>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
