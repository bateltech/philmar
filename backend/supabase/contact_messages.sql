-- Messages reçus via le formulaire de contact du site.
-- À exécuter une seule fois dans Supabase : SQL Editor > New query > coller > Run.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

-- RLS activé sans aucune policy : seule la clé secrète (backend) peut lire/écrire.
-- La clé publique du site (navigateur) n'a donc aucun accès aux messages.
alter table public.contact_messages enable row level security;
