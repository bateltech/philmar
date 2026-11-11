-- Espaces de stockage des fichiers (images, sons, PDF).
-- Publics : les fichiers sont lisibles par tous via leur adresse, mais seul
-- le backend (clé secrète) peut en ajouter ou en supprimer.
-- À exécuter une seule fois dans Supabase : SQL Editor > New query > coller > Run.

insert into storage.buckets (id, name, public)
values
  ('images', 'images', true),
  ('audio', 'audio', true),
  ('documents', 'documents', true)
on conflict (id) do nothing;
