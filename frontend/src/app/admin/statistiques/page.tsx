'use client';

import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Eye,
  FileText,
  Globe2,
  Layers,
  Link2,
  Monitor,
  MousePointerClick,
  RefreshCw,
  Search,
  Share2,
  Smartphone,
  Tablet,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin';
import { adminApi, StatsSummary } from '@/lib/admin-api';

/* ------------------------------------------------------------------ */
/* Libellés                                                            */
/* ------------------------------------------------------------------ */

const PERIODS = [
  { days: 7, label: '7 jours' },
  { days: 30, label: '30 jours' },
  { days: 90, label: '3 mois' },
  { days: 365, label: '12 mois' },
];

const PAGE_LABELS: Record<string, string> = {
  '/': 'Accueil',
  '/accueil': 'Accueil',
  '/biographie': 'Biographie',
  '/concerts': 'Concerts',
  '/spectacles': 'Spectacles',
  '/discographie': 'Discographie',
  '/instruments': 'Instruments du monde',
  '/voix': 'Voix',
  '/mentions-legales': 'Mentions légales',
};

type SourceKind = 'search' | 'social' | 'music' | 'direct' | 'site';

/** Regroupe les adresses d'origine sous un nom lisible (« l.instagram.com » → « Instagram »). */
const SOURCES: [RegExp, string, SourceKind][] = [
  [/(^|\.)google\./, 'Google', 'search'],
  [/(^|\.)bing\.com$/, 'Bing', 'search'],
  [/(^|\.)duckduckgo\.com$/, 'DuckDuckGo', 'search'],
  [/(^|\.)qwant\.com$/, 'Qwant', 'search'],
  [/(^|\.)ecosia\.org$/, 'Ecosia', 'search'],
  [/(^|\.)yahoo\./, 'Yahoo', 'search'],
  [/(^|\.)instagram\.com$/, 'Instagram', 'social'],
  [/(^|\.)facebook\.com$|^fb\.me$/, 'Facebook', 'social'],
  [/(^|\.)youtube\.com$|^youtu\.be$/, 'YouTube', 'social'],
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, 'LinkedIn', 'social'],
  [/^t\.co$|(^|\.)twitter\.com$|(^|\.)x\.com$/, 'X (Twitter)', 'social'],
  [/(^|\.)whatsapp\.com$/, 'WhatsApp', 'social'],
  [/(^|\.)soundcloud\.com$/, 'SoundCloud', 'music'],
  [/(^|\.)bandcamp\.com$/, 'Bandcamp', 'music'],
  [/(^|\.)spotify\.com$/, 'Spotify', 'music'],
];

const SOURCE_ICONS: Record<SourceKind, LucideIcon> = {
  search: Search,
  social: Share2,
  music: Globe2,
  direct: MousePointerClick,
  site: Link2,
};

const sourceOf = (host: string): { name: string; kind: SourceKind } => {
  if (host === 'direct') return { name: 'Accès direct', kind: 'direct' };
  const match = SOURCES.find(([re]) => re.test(host));
  return match ? { name: match[1], kind: match[2] } : { name: host, kind: 'site' };
};

/** Ordre et couleur fixes des appareils (la couleur suit l'appareil, jamais son rang). */
const DEVICES: { key: string; label: string; icon: LucideIcon; color: string }[] = [
  { key: 'desktop', label: 'Ordinateur', icon: Monitor, color: 'var(--stats-c1)' },
  { key: 'mobile', label: 'Mobile', icon: Smartphone, color: 'var(--stats-c2)' },
  { key: 'tablet', label: 'Tablette', icon: Tablet, color: 'var(--stats-c3)' },
];

const regionNames =
  typeof Intl !== 'undefined' && 'DisplayNames' in Intl ? new Intl.DisplayNames(['fr'], { type: 'region' }) : null;

const countryLabel = (code: string) => {
  if (code === 'inconnu') return 'Inconnu';
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
};

const nf = new Intl.NumberFormat('fr-FR');
const fmtDay = (day: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${day}T12:00:00`).toLocaleDateString('fr-FR', opts);

/* ------------------------------------------------------------------ */
/* Préparation des données                                             */
/* ------------------------------------------------------------------ */

interface Point {
  key: string;
  label: string;
  title: string;
  visitors: number;
  pageViews: number;
}

/** Jour par jour jusqu'à 3 mois, mois par mois au-delà. */
const toPoints = (daily: StatsSummary['daily'], days: number): Point[] => {
  if (days <= 90) {
    return daily.map((d) => ({
      key: d.day,
      label: fmtDay(d.day, { day: 'numeric', month: 'short' }),
      title: fmtDay(d.day, { weekday: 'long', day: 'numeric', month: 'long' }),
      visitors: d.visitors,
      pageViews: d.pageViews,
    }));
  }
  const months = new Map<string, Point>();
  for (const d of daily) {
    const key = d.day.slice(0, 7);
    if (!months.has(key)) {
      months.set(key, {
        key,
        label: fmtDay(`${key}-01`, { month: 'short' }),
        title: fmtDay(`${key}-01`, { month: 'long', year: 'numeric' }),
        visitors: 0,
        pageViews: 0,
      });
    }
    const m = months.get(key)!;
    m.visitors += d.visitors;
    m.pageViews += d.pageViews;
  }
  return Array.from(months.values());
};

/** Additionne les valeurs portant le même libellé, puis trie. */
function groupRows<T>(items: T[], label: (item: T) => string, value: (item: T) => number) {
  const map = new Map<string, number>();
  for (const it of items) map.set(label(it), (map.get(label(it)) ?? 0) + value(it));
  return Array.from(map.entries())
    .map(([name, v]) => ({ name, value: v }))
    .sort((a, b) => b.value - a.value);
}

/** Graduation « ronde » de l'axe (1, 2, 5, 10, 20, 50…). */
const niceMax = (max: number) => {
  if (max <= 4) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow >= max / 4)! * pow;
  return Math.ceil(max / step) * step;
};

/* ------------------------------------------------------------------ */
/* Petits composants                                                   */
/* ------------------------------------------------------------------ */

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

function Trend({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) {
    return (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
        {current > 0 ? 'Nouveau' : 'Pas de visite avant'}
      </span>
    );
  }
  const change = Math.round(((current - previous) / previous) * 100);
  const up = change >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
        up ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}
      title="Par rapport à la période précédente de même durée"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {up ? '+' : ''}
      {change} %
    </span>
  );
}

/** Mini-courbe de tendance dans les cartes de chiffres. */
function Sparkline({ values }: { values: number[] }) {
  const id = useId();
  if (values.length < 2) return null;
  const max = Math.max(1, ...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * 100, 28 - (v / max) * 24] as const);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-8 w-full" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--stats-c1)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--stats-c1)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L100,30 L0,30 Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke="var(--stats-c1)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  trend,
  spark,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: React.ReactNode;
  spark?: number[];
  hint?: string;
}) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {trend}
      </div>
      <p className="mt-4 text-sm text-gray-600">{label}</p>
      <p className="mt-0.5 text-3xl font-semibold tracking-tight tabular-nums text-gray-900">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
      {spark && <div className="mt-3">{<Sparkline values={spark} />}</div>}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Graphique principal : visiteurs et pages vues                       */
/* ------------------------------------------------------------------ */

const SERIES = [
  { key: 'pageViews' as const, label: 'Pages vues', color: 'var(--stats-c2)' },
  { key: 'visitors' as const, label: 'Visiteurs', color: 'var(--stats-c1)' },
];

function VisitsChart({ points }: { points: Point[] }) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  const top = niceMax(Math.max(1, ...points.map((p) => p.pageViews)));
  const n = points.length;
  const x = (i: number) => (n === 1 ? 50 : (i / (n - 1)) * 100);
  const y = (v: number) => 100 - (v / top) * 100;
  const path = (key: 'visitors' | 'pageViews') =>
    points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p[key])}`).join(' ');
  const labelEvery = Math.max(1, Math.ceil(n / 7));
  const active = hover !== null ? points[hover] : null;
  const ticks = [top, (top * 3) / 4, top / 2, top / 4, 0];

  return (
    <div>
      {/* Légende */}
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        {[...SERIES].reverse().map((s) => (
          <span key={s.key} className="inline-flex items-center gap-2 text-gray-700">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} aria-hidden="true" />
            {s.label}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        {/* Axe vertical */}
        <div className="relative h-64 w-8 shrink-0 text-right text-xs tabular-nums text-gray-500">
          {ticks.map((t, i) => (
            <span key={i} className="absolute right-0 -translate-y-1/2" style={{ top: `${(i / 4) * 100}%` }}>
              {nf.format(Math.round(t))}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-64" onMouseLeave={() => setHover(null)}>
            {/* Grille discrète */}
            {ticks.map((_, i) => (
              <div
                key={i}
                className={`pointer-events-none absolute inset-x-0 border-t ${i === 4 ? 'border-gray-300' : 'border-dashed border-gray-200'}`}
                style={{ top: `${(i / 4) * 100}%` }}
              />
            ))}

            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              <defs>
                {SERIES.map((s) => (
                  <linearGradient key={s.key} id={`${id}-${s.key}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity={s.key === 'visitors' ? 0.3 : 0.15} />
                    <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>
              {SERIES.map((s) => (
                <g key={s.key}>
                  <path d={`${path(s.key)} L${x(n - 1)},100 L${x(0)},100 Z`} fill={`url(#${id}-${s.key})`} />
                  <path
                    d={path(s.key)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}
            </svg>

            {/* Repère vertical + points au survol */}
            {active && hover !== null && (
              <>
                <div
                  className="pointer-events-none absolute inset-y-0 border-l border-gray-400"
                  style={{ left: `${x(hover)}%` }}
                />
                {SERIES.map((s) => (
                  <span
                    key={s.key}
                    className="stats-dot pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ left: `${x(hover)}%`, top: `${y(active[s.key])}%`, background: s.color }}
                  />
                ))}
                <div
                  className={`pointer-events-none absolute top-2 z-10 w-44 rounded-lg border border-gray-200 bg-white p-3 text-xs shadow-lg ${
                    x(hover) > 60 ? '-translate-x-[calc(100%+12px)]' : 'translate-x-3'
                  }`}
                  style={{ left: `${x(hover)}%` }}
                  role="status"
                >
                  <p className="mb-2 font-medium capitalize text-gray-900">{active.title}</p>
                  {[...SERIES].reverse().map((s) => (
                    <p key={s.key} className="flex items-center justify-between gap-3 text-gray-700">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                        {s.label}
                      </span>
                      <span className="font-semibold tabular-nums text-gray-900">{nf.format(active[s.key])}</span>
                    </p>
                  ))}
                </div>
              </>
            )}

            {/* Zones de survol (plus larges que les points) */}
            <div className="absolute inset-0 flex">
              {points.map((p, i) => (
                <div key={p.key} className="h-full flex-1" onMouseEnter={() => setHover(i)} />
              ))}
            </div>
          </div>

          {/* Axe horizontal */}
          <div className="relative mt-2 h-4 text-[11px] text-gray-500">
            {points.map((p, i) =>
              i % labelEvery === 0 || i === n - 1 ? (
                <span
                  key={p.key}
                  className="absolute -translate-x-1/2 whitespace-nowrap"
                  style={{ left: `${x(i)}%` }}
                >
                  {i === n - 1 || i % labelEvery === 0 ? p.label : null}
                </span>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Classements                                                         */
/* ------------------------------------------------------------------ */

interface RankRow {
  name: string;
  value: number;
  icon?: LucideIcon;
  badge?: string;
}

function RankedList({ title, icon: TitleIcon, unit, rows }: { title: string; icon: LucideIcon; unit: string; rows: RankRow[] }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 50);
    return () => clearTimeout(t);
  }, []);
  const total = rows.reduce((s, r) => s + r.value, 0);
  const max = Math.max(1, ...rows.map((r) => r.value));

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900">
          <TitleIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
          {title}
        </h3>
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">Aucune donnée sur cette période.</p>
      ) : (
        <ul className="space-y-1">
          {rows.map((r) => {
            const RowIcon = r.icon;
            return (
              <li key={r.name} className="relative overflow-hidden rounded-md px-3 py-2">
                {/* Barre en arrière-plan, proportionnelle à la valeur */}
                <div
                  className="stats-bar absolute inset-y-0 left-0 rounded-md transition-[width] duration-700 ease-out"
                  style={{ width: shown ? `${(r.value / max) * 100}%` : 0 }}
                  aria-hidden="true"
                />
                <div className="relative flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2 text-gray-800">
                    {RowIcon && <RowIcon className="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />}
                    {r.badge && (
                      <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-gray-600">
                        {r.badge}
                      </span>
                    )}
                    <span className="truncate">{r.name}</span>
                  </span>
                  <span className="shrink-0 tabular-nums">
                    <span className="font-semibold text-gray-900">{nf.format(r.value)}</span>
                    <span className="ml-2 inline-block w-9 text-right text-xs text-gray-500">
                      {Math.round((r.value / total) * 100)} %
                    </span>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

/** Anneau de répartition des appareils, avec légende chiffrée. */
function DevicesCard({ devices }: { devices: StatsSummary['devices'] }) {
  const counts = DEVICES.map((d) => ({ ...d, value: devices.find((x) => x.device === d.key)?.visitors ?? 0 }));
  const total = counts.reduce((s, d) => s + d.value, 0);
  const r = 40;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <Card>
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
        <Monitor className="h-4 w-4 text-gray-500" aria-hidden="true" />
        Appareils
      </h3>
      {total === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">Aucune donnée sur cette période.</p>
      ) : (
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative h-36 w-36 shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="50" cy="50" r={r} fill="none" strokeWidth="12" className="stats-ring-track" />
              {counts
                .filter((d) => d.value > 0)
                .map((d) => {
                  const len = (d.value / total) * c;
                  const seg = (
                    <circle
                      key={d.key}
                      cx="50"
                      cy="50"
                      r={r}
                      fill="none"
                      stroke={d.color}
                      strokeWidth="12"
                      strokeDasharray={`${Math.max(0, len - (total === d.value ? 0 : 1.5))} ${c}`}
                      strokeDashoffset={-offset}
                    />
                  );
                  offset += len;
                  return seg;
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold tabular-nums text-gray-900">{nf.format(total)}</span>
              <span className="text-xs text-gray-500">visiteurs</span>
            </div>
          </div>
          <ul className="w-full space-y-3">
            {counts.map((d) => (
              <li key={d.key} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-gray-800">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} aria-hidden="true" />
                  <d.icon className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  {d.label}
                </span>
                <span className="tabular-nums">
                  <span className="font-semibold text-gray-900">{Math.round((d.value / total) * 100)} %</span>
                  <span className="ml-2 text-xs text-gray-500">({nf.format(d.value)})</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function StatistiquesPage() {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (period: number) => {
    setIsLoading(true);
    setError(null);
    try {
      setStats(await adminApi.getStats(period));
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Impossible de charger les statistiques.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(days);
  }, [days, load]);

  const points = useMemo(() => (stats ? toPoints(stats.daily, stats.days) : []), [stats]);

  const derived = useMemo(() => {
    if (!stats) return null;
    const best = stats.daily.reduce((b, d) => (d.visitors > b.visitors ? d : b), stats.daily[0]);
    const today = stats.daily[stats.daily.length - 1];
    return {
      best: best && best.visitors > 0 ? best : null,
      today,
      pagesPerVisit: stats.totals.visitors ? stats.totals.pageViews / stats.totals.visitors : 0,
      prevPagesPerVisit: stats.previous.visitors ? stats.previous.pageViews / stats.previous.visitors : 0,
      pages: groupRows(stats.pages, (p) => PAGE_LABELS[p.path] ?? p.path, (p) => p.pageViews).map(
        (r): RankRow => ({ ...r, icon: FileText }),
      ),
      referrers: groupRows(stats.referrers, (r) => sourceOf(r.source).name, (r) => r.visitors).map(
        (r): RankRow => {
          const kind = stats.referrers.map((x) => sourceOf(x.source)).find((s) => s.name === r.name)?.kind ?? 'site';
          return { ...r, icon: SOURCE_ICONS[kind] };
        },
      ),
      countries: stats.countries.map(
        (c): RankRow => ({
          name: countryLabel(c.country),
          value: c.visitors,
          badge: c.country === 'inconnu' ? '??' : c.country,
        }),
      ),
    };
  }, [stats]);

  const periodLabel = PERIODS.find((p) => p.days === days)?.label ?? `${days} jours`;

  return (
    <AdminLayout title="Statistiques">
      <div className="stats-page space-y-6">
        {/* En-tête : résumé + filtres sur une ligne */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Fréquentation du site</h2>
            {stats && (
              <p className="mt-1 text-sm text-gray-600">
                Du {fmtDay(stats.from, { day: 'numeric', month: 'long' })} au{' '}
                {fmtDay(stats.to, { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg bg-gray-100 p-1" role="group" aria-label="Période">
              {PERIODS.map((p) => (
                <button
                  key={p.days}
                  type="button"
                  onClick={() => setDays(p.days)}
                  aria-pressed={days === p.days}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    days === p.days ? 'bg-white font-medium text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => load(days)}
              disabled={isLoading}
              title="Actualiser"
              aria-label="Actualiser"
              className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 shadow-sm hover:text-gray-900 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            </button>
          </div>
        </div>

        {error && <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}

        {!stats && isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {stats && derived && (
          <div className={`space-y-6 transition-opacity ${isLoading ? 'opacity-60' : ''}`}>
            {/* Chiffres clés */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile
                icon={Users}
                label="Visiteurs"
                value={nf.format(stats.totals.visitors)}
                trend={<Trend current={stats.totals.visitors} previous={stats.previous.visitors} />}
                spark={points.map((p) => p.visitors)}
              />
              <StatTile
                icon={Eye}
                label="Pages vues"
                value={nf.format(stats.totals.pageViews)}
                trend={<Trend current={stats.totals.pageViews} previous={stats.previous.pageViews} />}
                spark={points.map((p) => p.pageViews)}
              />
              <StatTile
                icon={Layers}
                label="Pages par visite"
                value={derived.pagesPerVisit.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}
                trend={<Trend current={derived.pagesPerVisit} previous={derived.prevPagesPerVisit} />}
                hint="Nombre moyen de pages consultées"
              />
              <StatTile
                icon={CalendarDays}
                label="Aujourd'hui"
                value={nf.format(derived.today?.visitors ?? 0)}
                hint={`visiteur${(derived.today?.visitors ?? 0) > 1 ? 's' : ''} · ${nf.format(derived.today?.pageViews ?? 0)} page${(derived.today?.pageViews ?? 0) > 1 ? 's' : ''} vue${(derived.today?.pageViews ?? 0) > 1 ? 's' : ''}`}
              />
            </div>

            {/* Courbe */}
            <Card>
              <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Évolution {stats.days > 90 ? 'mois par mois' : 'jour par jour'}</h3>
                  <p className="text-sm text-gray-500">{periodLabel}</p>
                </div>
                {derived.best && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-900">
                    <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                    Meilleur jour : {fmtDay(derived.best.day, { day: 'numeric', month: 'long' })} (
                    {nf.format(derived.best.visitors)} visiteur{derived.best.visitors > 1 ? 's' : ''})
                  </span>
                )}
              </div>
              {stats.totals.pageViews === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Eye className="mb-3 h-8 w-8 text-gray-500" aria-hidden="true" />
                  <p className="text-sm text-gray-600">Aucune visite enregistrée sur cette période.</p>
                </div>
              ) : (
                <VisitsChart points={points} />
              )}
            </Card>

            {/* Classements */}
            <div className="grid gap-4 lg:grid-cols-2">
              <RankedList title="Pages les plus vues" icon={FileText} unit="pages vues" rows={derived.pages} />
              <RankedList title="Provenance" icon={Link2} unit="visiteurs" rows={derived.referrers} />
              <RankedList title="Pays" icon={Globe2} unit="visiteurs" rows={derived.countries} />
              <DevicesCard devices={stats.devices} />
            </div>

            <p className="text-xs leading-relaxed text-gray-500">
              Statistiques anonymes, sans cookie : un visiteur ne peut pas être reconnu d&apos;un jour à l&apos;autre.
              Les robots et les pages de l&apos;admin ne sont pas comptés. « Accès direct » regroupe les visiteurs
              arrivés en tapant l&apos;adresse, par un favori ou par un lien sans provenance (e-mail, application…).
              Les visites sont effacées au bout de 13 mois.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
