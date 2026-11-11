-- Contenu du site (concerts, spectacles, discographie, avis, mentions légales…).
-- Une ligne par rubrique : `type` = nom de la rubrique, `data` = son contenu en JSON.
-- À exécuter une seule fois dans Supabase : SQL Editor > New query > coller > Run.

create table if not exists public.content (
  type text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- RLS : le site public (clé publique) peut seulement LIRE le contenu.
-- Les modifications passent par le backend (clé secrète), qui ignore le RLS.
alter table public.content enable row level security;

drop policy if exists "Lecture publique du contenu" on public.content;
create policy "Lecture publique du contenu"
  on public.content for select
  to anon, authenticated
  using (true);
