'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { getContent } from '@/lib/content';
import {
  DEFAULT_LEGAL_NOTICES,
  LegalNoticesContent as LegalNoticesData,
  normalizeLegalNotices,
  toRichTextHtml,
} from '@/lib/legal-notices';

export default function LegalNoticesContent() {
  const [content, setContent] = useState(DEFAULT_LEGAL_NOTICES);
  const [safeContent, setSafeContent] = useState<{
    intro: string;
    publicationNote: string;
    sections: Array<{ id: string; title: string; body: string }>;
  } | null>(null);

  useEffect(() => {
    let active = true;
    getContent<LegalNoticesData>('mentions_legales')
      .then((data) => setContent(normalizeLegalNotices(data)))
      .catch(() => setContent(DEFAULT_LEGAL_NOTICES));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    import('dompurify').then(({ default: DOMPurify }) => {
      if (!active) return;
      setSafeContent({
        intro: DOMPurify.sanitize(toRichTextHtml(content.intro)),
        publicationNote: DOMPurify.sanitize(toRichTextHtml(content.publicationNote)),
        sections: content.sections.map((section) => ({
          ...section,
          body: DOMPurify.sanitize(toRichTextHtml(section.body)),
        })),
      });
    });
    return () => { active = false; };
  }, [content]);

  return (
    <main className="min-h-screen bg-black px-5 pb-20 pt-28 text-white md:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 border-b border-white/20 pb-8">
          <p className="mb-3 text-sm uppercase tracking-widest text-amber-400">Philmar · Site officiel</p>
          <h1 className="text-4xl font-bold md:text-5xl">Mentions légales</h1>
          <div
            className="legal-notice-content mt-5 max-w-2xl leading-7 text-white/75"
            dangerouslySetInnerHTML={{ __html: safeContent?.intro ?? '' }}
          />
        </header>

        {content.publicationNote.trim() && (
          <div className="mb-10 border-l-2 border-amber-400 bg-white/5 px-5 py-4 text-sm leading-6 text-white/80">
            <div
              className="legal-notice-content"
              dangerouslySetInnerHTML={{ __html: safeContent?.publicationNote ?? '' }}
            />
          </div>
        )}

        <div className="space-y-10">
          {(safeContent?.sections ?? content.sections.map((section) => ({ ...section, body: '' }))).map((section) => (
            <section key={section.id} className="border-b border-white/10 pb-8 last:border-0">
              <h2 className="mb-4 text-xl font-semibold text-amber-300">{section.title}</h2>
              <div
                className="legal-notice-content leading-7 text-white/80"
                dangerouslySetInnerHTML={{ __html: section.body }}
              />
            </section>
          ))}
        </div>

        <p className="mt-8 text-sm text-white/60">
          Référence :{' '}
          <a href="https://entreprendre.service-public.gouv.fr/vosdroits/F37351" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-amber-300">
            Mentions obligatoires sur le site internet d’une entreprise — Service-Public.fr
          </a>
          {' · '}
          <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-amber-300">CNIL</a>
          {' · '}
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-amber-300">Confidentialité Cloudflare</a>
        </p>
      </div>
    </main>
  );
}