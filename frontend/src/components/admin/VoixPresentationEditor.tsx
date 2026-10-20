'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import { DEFAULT_VOIX_PRESENTATION, type VoixPresentationSection } from '@/lib/voix-presentation';
import FormField from './FormField';
import ImagePicker from './ImagePicker';
import RichTextEditor from './RichTextEditor';

/** Édition des 3 cartes de présentation de la page Voix (La méthode, Les objectifs, Les moyens). */
export default function VoixPresentationEditor() {
  const [sections, setSections] = useState<VoixPresentationSection[]>(DEFAULT_VOIX_PRESENTATION);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Pas encore enregistré en base → on garde le contenu par défaut
    adminApi
      .getContent<VoixPresentationSection[]>('voix_presentation')
      .then((data) => { if (Array.isArray(data) && data.length) setSections(data); })
      .catch(() => {});
  }, []);

  const update = (index: number, patch: Partial<VoixPresentationSection>) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
    setMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await adminApi.updateContent('voix_presentation', sections);
      setMessage({ type: 'success', text: 'Présentation enregistrée.' });
    } catch {
      setMessage({ type: 'error', text: "Erreur lors de l'enregistrement de la présentation." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mb-8 rounded-lg bg-white p-4 shadow md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Présentation de la page Voix</h2>
          <p className="text-sm text-gray-500">La méthode, Les objectifs, Les moyens</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer la présentation'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 rounded-lg p-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-3">
        {sections.map((section, i) => {
          const isOpen = openKey === section.key;
          return (
            <div key={section.key} className="rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={() => setOpenKey(isOpen ? null : section.key)}
                className="flex w-full items-center gap-3 p-3 text-left hover:bg-gray-50"
              >
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                  {section.image ? (
                    <img src={section.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <span className="flex-1 font-medium">{section.title || 'Sans titre'}</span>
                {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>

              {isOpen && (
                <div className="border-t border-gray-200 p-3 md:p-4">
                  <FormField
                    label="Titre"
                    name={`${section.key}-title`}
                    value={section.title}
                    onChange={(v) => update(i, { title: v as string })}
                  />
                  <FormField
                    label="Sous-titre (en italique, sous le titre)"
                    name={`${section.key}-subtitle`}
                    value={section.subtitle}
                    onChange={(v) => update(i, { subtitle: v as string })}
                  />

                  <RichTextEditor
                    label="Texte"
                    value={section.content}
                    onChange={(html) => update(i, { content: html })}
                  />

                  <label className="mb-1 block text-sm font-medium text-gray-700">Image de fond</label>
                  <div className="flex items-center gap-4">
                    {section.image && (
                      <img src={section.image} alt="" className="h-20 w-32 rounded object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => setPickerIndex(i)}
                      className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
                    >
                      Choisir / importer une image
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ImagePicker
        isOpen={pickerIndex !== null}
        onClose={() => setPickerIndex(null)}
        onSelect={(path) => { if (pickerIndex !== null) update(pickerIndex, { image: path }); }}
        currentImage={pickerIndex !== null ? sections[pickerIndex]?.image : undefined}
        category="voix"
      />
    </section>
  );
}
