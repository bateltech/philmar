'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { adminApi } from '@/lib/admin-api';
import {
  DEFAULT_LEGAL_NOTICES,
  LegalNoticesContent,
  LegalNoticeSection,
  normalizeLegalNotices,
  toRichTextHtml,
} from '@/lib/legal-notices';
import { Plus, Save, Trash2 } from 'lucide-react';

export default function AdminMentionsLegalesPage() {
  const [content, setContent] = useState<LegalNoticesContent>(DEFAULT_LEGAL_NOTICES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getContent<LegalNoticesContent>('mentions_legales')
      .then((data) => setContent(normalizeLegalNotices(data)))
      .catch(() => setContent(DEFAULT_LEGAL_NOTICES))
      .finally(() => setIsLoading(false));
  }, []);

  const updateSection = (index: number, patch: Partial<LegalNoticeSection>) => {
    setContent((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, ...patch } : section,
      ),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaved(false);
    try {
      const savedContent = await adminApi.updateContent('mentions_legales', content);
      setContent(normalizeLegalNotices(savedContent));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Échec de l’enregistrement. Vérifiez la connexion puis réessayez.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Mentions légales">
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Mentions légales">
      {error && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}
      {saved && <div role="status" className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">Modifications enregistrées.</div>}

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Vérifiez les informations juridiques avant publication. Les modifications sont visibles sur
        la page publique après leur enregistrement.
      </div>

      <div className="max-w-4xl space-y-6">
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Introduction et note</h2>
          <RichTextEditor
            label="Introduction"
            value={toRichTextHtml(content.intro)}
            onChange={(html) => setContent({ ...content, intro: html })}
          />
          <RichTextEditor
            label="Note de vérification"
            value={toRichTextHtml(content.publicationNote)}
            onChange={(html) => setContent({ ...content, publicationNote: html })}
          />
        </section>

        {content.sections.map((section, index) => (
          <section key={section.id} className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Rubrique {index + 1}</h2>
              <button type="button" onClick={() => setContent({ ...content, sections: content.sections.filter((_, i) => i !== index) })} aria-label={`Supprimer la rubrique ${section.title || index + 1}`} title="Supprimer cette rubrique" className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor={`legal-title-${section.id}`}>Titre</label>
            <input id={`legal-title-${section.id}`} value={section.title} onChange={(event) => updateSection(index, { title: event.target.value })} className="mb-5 w-full rounded-md border border-gray-300 p-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            <RichTextEditor
              label="Texte"
              value={toRichTextHtml(section.body)}
              onChange={(html) => updateSection(index, { body: html })}
            />
          </section>
        ))}

        <div className="flex flex-wrap justify-between gap-3">
          <button type="button" onClick={() => setContent({ ...content, sections: [...content.sections, { id: `section-${Date.now()}`, title: '', body: '' }] })} className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Plus className="h-4 w-4" /> Ajouter une rubrique
          </button>
          <button type="button" onClick={handleSave} disabled={isSaving} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            <Save className="h-4 w-4" /> {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}