'use client';

import { useRef, useState } from 'react';
import { DatabaseBackup, Download, Upload } from 'lucide-react';
import { adminApi, BackupFile } from '@/lib/admin-api';
import ConfirmDialog from './ConfirmDialog';

/** Libellés lisibles des types de contenu (pour le message de confirmation). */
const CONTENT_LABELS: Record<string, string> = {
  concerts: 'Concerts',
  spectacles: 'Spectacles',
  discographie: 'Discographie',
  instruments: 'Instruments',
  voix_data: 'Ateliers voix',
  ateliers_instruments: 'Ateliers instruments',
  avis_instruments: 'Avis instruments',
  avis_voix: 'Avis voix',
  dernier_album: 'Dernier album / lecteur',
  galerie: 'Galerie concerts',
  galerie_spectacle: 'Galerie spectacles',
  social_links: 'Réseaux sociaux',
  page_404: 'Page introuvable',
  voix_presentation: 'Présentation voix',
  mentions_legales: 'Mentions légales',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function BackupSection() {
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [pending, setPending] = useState<BackupFile | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setMessage(null);
    try {
      const backup = await adminApi.exportBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sauvegarde-philmar-${backup.exportedAt.slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Sauvegarde téléchargée.' });
    } catch {
      setMessage({ type: 'error', text: 'Échec de la sauvegarde. Vérifiez la connexion puis réessayez.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChosen = async (file: File | undefined) => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!file) return;
    setMessage(null);
    try {
      const parsed = JSON.parse(await file.text()) as BackupFile;
      if (parsed?.format !== 'philmar-backup' || !parsed.content) throw new Error();
      setPending(parsed);
    } catch {
      setMessage({ type: 'error', text: "Ce fichier n'est pas une sauvegarde de l'admin Philmar." });
    }
  };

  const handleRestore = async () => {
    if (!pending) return;
    const backup = pending;
    setPending(null);
    setIsRestoring(true);
    try {
      const { restored } = await adminApi.restoreBackup(backup);
      setMessage({
        type: 'success',
        text: `Contenu restauré (${restored.length} rubrique${restored.length > 1 ? 's' : ''}). Rechargez les pages de l'admin pour voir le résultat.`,
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error && err.message ? err.message : 'Échec de la restauration.',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const pendingSections = pending ? Object.keys(pending.content).map((k) => CONTENT_LABELS[k] ?? k) : [];

  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <DatabaseBackup className="h-5 w-5 text-blue-600" /> Sauvegarde
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        Téléchargez régulièrement une copie de tout le contenu du site (textes, concerts, albums, avis,
        mentions légales…) et des messages reçus. Gardez ce fichier en lieu sûr : il permet de tout
        remettre en place en cas d&apos;erreur. Les images, audios et PDF ne sont pas inclus : ils restent
        stockés séparément.
      </p>

      {message && (
        <div
          role={message.type === 'error' ? 'alert' : 'status'}
          className={`mb-4 rounded-lg p-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting || isRestoring}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Préparation…' : 'Télécharger une sauvegarde'}
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isExporting || isRestoring}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {isRestoring ? 'Restauration…' : 'Restaurer une sauvegarde'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => handleFileChosen(e.target.files?.[0])}
        />
      </div>

      <ConfirmDialog
        isOpen={pending !== null}
        title="Restaurer cette sauvegarde ?"
        message={
          pending
            ? `Sauvegarde du ${formatDate(pending.exportedAt)}. Le contenu actuel de ces rubriques sera remplacé : ${pendingSections.join(', ')}. Les messages reçus ne seront pas modifiés. Pensez à télécharger une sauvegarde de l'état actuel avant de continuer.`
            : ''
        }
        confirmText="Restaurer"
        variant="warning"
        onConfirm={handleRestore}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
