'use client';
import { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import VoixCard from './VoixCard';
import { getContent } from '../lib/content';

interface VoixSection {
  label: string;
  content: string;
}

interface VoixItem {
  type: 'stage' | 'atelier' | 'cours';
  title: string;
  image: string;
  description?: string;
  objectifs?: string;
  moyens?: string;
  contenu?: string;
  horaires?: string;
  sections?: VoixSection[];
  link?: string;
}

export default function VoixCardsGrid() {
  const [data, setData] = useState<VoixItem[]>([]);
  const [filter, setFilter] = useState<'stage' | 'atelier' | 'cours'>('stage');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    getContent<VoixItem[]>('voix_data')
      .then(setData)
      .catch(() => setData([]));
  }, []);

  const filtered = data.filter((item) => item.type === filter);

  const buildViewerUrl = (raw: string) => {
    const addParams = (u: string) =>
      u.includes('#') ? u : `${u}#toolbar=1&navpanes=0&view=FitH`;
    if (raw.startsWith('/')) return addParams(raw);
    const absolute = new URL(raw, window.location.origin).toString();
    return addParams(`/api/pdf-proxy?url=${encodeURIComponent(absolute)}`);
  };

  const openPdf = (url: string) => {
    try {
      setPdfUrl(buildViewerUrl(url));
    } catch {
      setPdfUrl(null);
    }
  };

  const closePdf = useCallback(() => setPdfUrl(null), []);

  useEffect(() => {
    if (!pdfUrl) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (ev: KeyboardEvent) => { if (ev.key === 'Escape') closePdf(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [pdfUrl, closePdf]);

  return (
    <div className="w-full overflow-hidden">
      {/* Filter buttons */}
      <div className="flex flex-wrap justify-start ml-0 sm:ml-12 gap-2 sm:gap-4 mt-8 sm:mt-12 mb-4">
        {['stage', 'atelier', 'cours'].map((category) => (
          <button
            key={category}
            className={`border px-3 sm:px-6 py-2 uppercase text-xs sm:text-sm ${
              filter === category ? 'bg-blue-950 border-blue-950' : 'border-white'
            } text-white hover:bg-blue-950 transition`}
            onClick={() => setFilter(category as 'stage' | 'atelier' | 'cours')}
          >
            {category === 'stage' ? 'Stages' : category === 'atelier' ? 'Ateliers' : 'Cours'}
          </button>
        ))}
      </div>

      {/* Subtitle */}
      <p className="italic text-left ml-0 sm:ml-12 text-sm text-white mb-6 sm:mb-8 mt-6 sm:mt-8">
        {filter === 'stage' && '(Journée, weekend,...)'}
        {filter === 'atelier' && '(Ponctuel ou en série)'}
        {filter === 'cours' && '(Individuel ou régulier)'}
      </p>

      {/* Cards */}
      <div className="flex flex-wrap justify-start ml-0 sm:ml-6 gap-4 sm:gap-6 px-0 sm:px-6">
        {filtered.map((item, index) => (
          <VoixCard key={index} {...item} onOpenPdf={openPdf} />
        ))}
      </div>

      {/* Modale PDF */}
      {!!pdfUrl && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={closePdf} />
          <div className="relative z-10 w-[92vw] h-[88vh] max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black">
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <span className="text-white text-xs sm:text-sm opacity-80 truncate pr-2">{pdfUrl}</span>
              <div className="flex items-center gap-2">
                <a href={pdfUrl} target="_blank" rel="noopener" className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white">
                  Ouvrir dans un nouvel onglet
                </a>
                <button onClick={closePdf} aria-label="Fermer" className="p-2 rounded hover:bg-white/10 active:scale-95 transition" type="button">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <div className="w-full h-[calc(88vh-44px)] bg-neutral-900 flex items-center justify-center">
              <iframe src={pdfUrl} title="PDF" className="w-full h-full bg-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
