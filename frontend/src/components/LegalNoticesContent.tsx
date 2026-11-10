'use client';

import { useEffect, useRef, useState } from 'react';
import { CalendarClock, ExternalLink } from 'lucide-react';
import { getSectionIcon } from '@/lib/legal-notice-icons';
import { getContentWithUpdatedAt } from '@/lib/content';
import {
  DEFAULT_LEGAL_NOTICES,
  LegalNoticesContent as LegalNoticesData,
  normalizeLegalNotices,
  toRichTextHtml,
} from '@/lib/legal-notices';

interface SafeLegalNotices {
  intro: string;
  sections: Array<{ id: string; title: string; body: string; icon?: string }>;
}

const REFERENCES = [
  {
    href: 'https://entreprendre.service-public.gouv.fr/vosdroits/F37351',
    label: 'Mentions obligatoires sur le site internet d’une entreprise — Service-Public.fr',
  },
  { href: 'https://www.cnil.fr/fr/plaintes', label: 'CNIL' },
  { href: 'https://www.cloudflare.com/privacypolicy/', label: 'Confidentialité Cloudflare' },
];

/** Mise en forme du texte riche saisi dans l'admin (paragraphes, listes, liens, gras…). */
const RICH_TEXT =
  'legal-notice-content break-words ' +
  '[&_p]:mb-4 [&_p:last-child]:mb-0 ' +
  '[&_strong]:font-semibold [&_strong]:text-white [&_b]:font-semibold [&_b]:text-white ' +
  '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul:last-child]:mb-0 ' +
  '[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_ol:last-child]:mb-0 ' +
  '[&_li]:pl-1 [&_li::marker]:text-amber-400 [&_li_p]:mb-0 ' +
  '[&_a]:text-amber-300 [&_a]:underline [&_a]:decoration-amber-300/40 [&_a]:underline-offset-4 ' +
  '[&_a]:transition-colors [&_a:hover]:decoration-amber-300';

/**
 * Ancre d'une rubrique, basée sur sa position. On évite d'utiliser l'identifiant
 * de la rubrique : les bloqueurs de pub masquent tout élément dont l'id contient
 * « cookie » (ex. « mentions-cookies »), ce qui faisait disparaître la rubrique.
 */
const anchorId = (index: number) => `rubrique-${index + 1}`;

export default function LegalNoticesContent() {
  const [safeContent, setSafeContent] = useState<SafeLegalNotices | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const tocListRef = useRef<HTMLOListElement>(null);

  // Chargement du contenu enregistré dans l'admin (contenu par défaut en cas d'erreur)
  useEffect(() => {
    let active = true;

    getContentWithUpdatedAt<LegalNoticesData>('mentions_legales')
      .then(({ data, updatedAt }) => {
        if (active) setUpdatedAt(updatedAt);
        return normalizeLegalNotices(data);
      })
      .catch(() => DEFAULT_LEGAL_NOTICES)
      .then(async (content) => {
        const { default: DOMPurify } = await import('dompurify');
        if (!active) return;
        setSafeContent({
          intro: DOMPurify.sanitize(toRichTextHtml(content.intro)),
          sections: content.sections.map((section) => ({
            ...section,
            body: DOMPurify.sanitize(toRichTextHtml(section.body)),
          })),
        });
      });

    return () => {
      active = false;
    };
  }, []);

  // Met en évidence, dans le sommaire, la rubrique en cours de lecture
  useEffect(() => {
    if (!safeContent) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-25% 0px -65% 0px' },
    );
    safeContent.sections.forEach((_, index) => {
      const el = document.getElementById(anchorId(index));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [safeContent]);

  // Sur mobile, le sommaire défile horizontalement : on garde la rubrique active visible
  useEffect(() => {
    const list = tocListRef.current;
    if (!list || !activeId || list.scrollWidth <= list.clientWidth) return;
    const link = list.querySelector<HTMLElement>(`a[href="#${activeId}"]`);
    if (!link) return;
    list.scrollTo({ left: link.offsetLeft - list.clientWidth / 2 + link.offsetWidth / 2, behavior: 'smooth' });
  }, [activeId]);

  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-black px-5 pb-24 pt-28 text-white md:px-10">
      {/* Halo doré discret en haut de page */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] max-w-full -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-12 max-w-3xl animate-fadeIn md:mb-16">
          <p className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-amber-400">
            <span className="h-px w-8 bg-amber-400" />
            Philmar · Site officiel
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Mentions légales</h1>
          {safeContent ? (
            <div
              className={`${RICH_TEXT} mt-6 text-base leading-7 text-white/70 md:text-lg md:leading-8`}
              dangerouslySetInnerHTML={{ __html: safeContent.intro }}
            />
          ) : (
            <div className="mt-6 h-6 w-2/3 animate-pulse rounded bg-white/10" />
          )}
          {updatedAt && (
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-white/50">
              <CalendarClock className="h-4 w-4 text-amber-400/80" aria-hidden />
              Dernière mise à jour :{' '}
              <time dateTime={updatedAt} className="text-white/70">
                {new Date(updatedAt).toLocaleDateString('fr-FR', {
                  timeZone: 'Europe/Paris',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </p>
          )}
        </header>

        {!safeContent ? (
          <LoadingSkeleton />
        ) : (
          <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
            {/* Sommaire */}
            {safeContent.sections.length > 1 && (
              // Mobile : barre accrochée sous la navigation. Grand écran : colonne fixe à gauche.
              <nav
                aria-label="Sommaire"
                className="sticky top-16 z-20 -mx-5 md:top-[72px] mb-8 border-b border-white/10 bg-black/85 px-5 py-3 backdrop-blur-md md:-mx-10 md:px-10 lg:static lg:mx-0 lg:mb-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
              >
                <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
                  <p className="mb-3 hidden text-xs font-medium uppercase tracking-[0.2em] text-white/40 lg:block">Sommaire</p>
                  <ol
                    ref={tocListRef}
                    className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:gap-0 lg:overflow-visible lg:border-l lg:border-white/10"
                  >
                    {safeContent.sections.map((section, index) => {
                      const isActive = activeId === anchorId(index);
                      return (
                        <li key={section.id} className="shrink-0">
                          <a
                            href={`#${anchorId(index)}`}
                            onClick={(e) => scrollToSection(e, anchorId(index))}
                            aria-current={isActive ? 'location' : undefined}
                            className={`block whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors lg:-ml-px lg:whitespace-normal lg:rounded-none lg:border-0 lg:border-l-2 lg:px-4 lg:py-2 ${
                              isActive
                                ? 'border-amber-400 text-amber-300'
                                : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
                            }`}
                          >
                            <span className="mr-2 tabular-nums text-white/30">{String(index + 1).padStart(2, '0')}</span>
                            {section.title || 'Sans titre'}
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </nav>
            )}

            <div className="min-w-0 space-y-6">
              {safeContent.sections.map((section, index) => {
                const Icon = getSectionIcon(section);
                return (
                  <section
                    key={section.id}
                    id={anchorId(index)}
                    className="scroll-mt-36 rounded-2xl lg:scroll-mt-28 border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 md:p-8"
                  >
                    <div className="mb-5 flex items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium tabular-nums tracking-[0.2em] text-white/35">
                          {String(index + 1).padStart(2, '0')}
                        </p>
                        <h2 className="text-xl font-semibold text-amber-300 md:text-2xl">{section.title}</h2>
                      </div>
                    </div>
                    <div
                      className={`${RICH_TEXT} leading-7 text-white/75`}
                      dangerouslySetInnerHTML={{ __html: section.body }}
                    />
                  </section>
                );
              })}

              <footer className="pt-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/40">Références</p>
                <ul className="flex flex-wrap gap-2">
                  {REFERENCES.map((ref) => (
                    <li key={ref.href}>
                      <a
                        href={ref.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-amber-300/60 hover:text-amber-300"
                      >
                        {ref.label}
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </footer>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 lg:ml-[268px]" aria-label="Chargement…">
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-white/10" />
            <div className="h-6 w-48 rounded bg-white/10" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-4 w-11/12 rounded bg-white/10" />
            <div className="h-4 w-3/4 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
