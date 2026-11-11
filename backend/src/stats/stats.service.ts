import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PageViewDto } from './page-view.dto';

const TABLE = 'page_views';
/** Les visites sont supprimées au bout de 13 mois (recommandation CNIL pour la mesure d'audience). */
const RETENTION_DAYS = 395;
const PAGE_SIZE = 1000;
const TOP_LIMIT = 10;

export const STATS_PERIODS = [7, 30, 90, 365] as const;

interface PageViewRow {
  day: string;
  path: string;
  referrer: string | null;
  country: string | null;
  device: string;
  visitor: string;
}

export interface StatsSummary {
  days: number;
  from: string;
  to: string;
  totals: { visitors: number; pageViews: number };
  previous: { visitors: number; pageViews: number };
  daily: { day: string; visitors: number; pageViews: number }[];
  pages: { path: string; pageViews: number; visitors: number }[];
  referrers: { source: string; visitors: number }[];
  countries: { country: string; visitors: number }[];
  devices: { device: string; visitors: number }[];
}

/** Date (AAAA-MM-JJ) à l'heure de Paris, décalée de `offset` jours par rapport à aujourd'hui. */
export const parisDay = (offset = 0) =>
  new Date(Date.now() + offset * 86_400_000).toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' });

const increment = (map: Map<string, number>, key: string) => map.set(key, (map.get(key) ?? 0) + 1);

const top = (counts: Map<string, number>, limit = TOP_LIMIT) =>
  [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(private supabaseService: SupabaseService) {}

  private get db() {
    return this.supabaseService.getClient();
  }

  async record(view: PageViewDto): Promise<void> {
    const { error } = await this.db.from(TABLE).insert({
      day: parisDay(),
      path: view.path,
      referrer: view.referrer || null,
      country: view.country || null,
      device: view.device,
      visitor: view.visitor,
    });
    if (error) this.logger.error(`Enregistrement d'une visite impossible : ${error.message}`);
  }

  /** Toutes les visites entre deux jours inclus (lues par paquets de 1000 lignes). */
  private async fetchRows(from: string, to: string): Promise<PageViewRow[]> {
    const rows: PageViewRow[] = [];
    for (let start = 0; ; start += PAGE_SIZE) {
      const { data, error } = await this.db
        .from(TABLE)
        .select('day, path, referrer, country, device, visitor')
        .gte('day', from)
        .lte('day', to)
        .order('id')
        .range(start, start + PAGE_SIZE - 1);
      if (error) throw new Error(`Lecture des statistiques impossible : ${error.message}`);
      rows.push(...((data ?? []) as PageViewRow[]));
      if (!data || data.length < PAGE_SIZE) return rows;
    }
  }

  /** Un « visiteur » = une empreinte sur une journée (l'empreinte change chaque jour). */
  private visitorKey(r: PageViewRow) {
    return `${r.day}|${r.visitor}`;
  }

  async summary(days: number): Promise<StatsSummary> {
    await this.purgeOld();

    const to = parisDay();
    const from = parisDay(-(days - 1));
    const [rows, prevRows] = await Promise.all([
      this.fetchRows(from, to),
      this.fetchRows(parisDay(-(2 * days - 1)), parisDay(-days)),
    ]);

    // Courbe jour par jour (les jours sans visite valent 0)
    const perDay = new Map<string, { visitors: Set<string>; pageViews: number }>();
    for (let i = days - 1; i >= 0; i--) perDay.set(parisDay(-i), { visitors: new Set(), pageViews: 0 });

    const pageViews = new Map<string, number>();
    const pageVisitors = new Map<string, Set<string>>();
    // Provenance, pays et appareil : une seule valeur par visiteur
    const firstRow = new Map<string, PageViewRow>();
    const referrerOf = new Map<string, string>();

    for (const r of rows) {
      const key = this.visitorKey(r);
      const d = perDay.get(r.day);
      if (d) {
        d.pageViews++;
        d.visitors.add(r.visitor);
      }
      increment(pageViews, r.path);
      if (!pageVisitors.has(r.path)) pageVisitors.set(r.path, new Set());
      pageVisitors.get(r.path)!.add(key);
      if (!firstRow.has(key)) firstRow.set(key, r);
      if (r.referrer && !referrerOf.has(key)) referrerOf.set(key, r.referrer);
    }

    const referrers = new Map<string, number>();
    const countries = new Map<string, number>();
    const devices = new Map<string, number>();
    for (const [key, r] of firstRow) {
      increment(referrers, referrerOf.get(key) ?? 'direct');
      increment(countries, r.country ?? 'inconnu');
      increment(devices, r.device);
    }

    return {
      days,
      from,
      to,
      totals: { visitors: firstRow.size, pageViews: rows.length },
      previous: {
        visitors: new Set(prevRows.map((r) => this.visitorKey(r))).size,
        pageViews: prevRows.length,
      },
      daily: [...perDay.entries()].map(([day, d]) => ({ day, visitors: d.visitors.size, pageViews: d.pageViews })),
      pages: top(pageViews).map(([path, views]) => ({
        path,
        pageViews: views,
        visitors: pageVisitors.get(path)!.size,
      })),
      referrers: top(referrers).map(([source, visitors]) => ({ source, visitors })),
      countries: top(countries).map(([country, visitors]) => ({ country, visitors })),
      devices: top(devices).map(([device, visitors]) => ({ device, visitors })),
    };
  }

  private async purgeOld() {
    const { error } = await this.db.from(TABLE).delete().lt('day', parisDay(-RETENTION_DAYS));
    if (error) this.logger.warn(`Purge des anciennes visites impossible : ${error.message}`);
  }
}
