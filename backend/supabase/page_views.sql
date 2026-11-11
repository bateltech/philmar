-- Statistiques de visites du site (page « Statistiques » de l'admin).
-- À exécuter une seule fois dans Supabase : SQL Editor > New query > coller > Run.
--
-- Aucune donnée personnelle : `visitor` est une empreinte brouillée qui change
-- chaque jour (impossible de retrouver l'IP ou de suivre quelqu'un d'un jour à l'autre).
-- Les lignes de plus de 13 mois sont supprimées automatiquement par le backend.

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  day date not null,                 -- jour de la visite (heure de Paris)
  path text not null,                -- page vue, ex. /concerts
  referrer text,                     -- site d'origine à l'arrivée, ex. google.com
  country text,                      -- code pays ISO, ex. FR
  device text not null,              -- mobile / tablet / desktop
  visitor text not null              -- empreinte anonyme du jour
);

create index if not exists page_views_day_idx on public.page_views (day);

-- RLS activé sans aucune policy : seule la clé secrète (backend) peut lire/écrire.
alter table public.page_views enable row level security;
