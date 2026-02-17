'use client';

import { useState, useEffect } from 'react';
import { FileText, ChevronDown } from 'lucide-react';
import { adminApi, DocumentMetadata } from '@/lib/admin-api';

interface DocumentPickerProps {
  label: string;
  value: string;
  onChange: (path: string) => void;
  helpText?: string;
}

export default function DocumentPicker({
  label,
  value,
  onChange,
  helpText,
}: DocumentPickerProps) {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const result = await adminApi.getDocuments();
      setDocuments(result.documents);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 pr-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="">-- Aucun document --</option>
          {documents.map((doc) => (
            <option key={doc.path} value={doc.path}>
              {doc.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      {value && (
        <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
          <FileText className="h-4 w-4" />
          <span>{value}</span>
        </div>
      )}
      {helpText && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
    </div>
  );
}
