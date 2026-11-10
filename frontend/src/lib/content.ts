import { supabase } from './supabase';

/**
 * Reads one content entry from the Supabase `content` table.
 * Replaces the old `fetch('/data/<type>.json')` calls.
 */
export async function getContent<T = unknown>(type: string): Promise<T> {
  const { data, error } = await supabase
    .from('content')
    .select('data')
    .eq('type', type)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load content "${type}": ${error.message}`);
  }
  if (!data) {
    throw new Error(`Content not found: ${type}`);
  }

  return data.data as T;
}

/**
 * Comme getContent, mais renvoie aussi la date du dernier enregistrement
 * (colonne `updated_at`, mise à jour automatiquement à chaque sauvegarde depuis l'admin).
 */
export async function getContentWithUpdatedAt<T = unknown>(
  type: string,
): Promise<{ data: T; updatedAt: string | null }> {
  const { data, error } = await supabase
    .from('content')
    .select('data, updated_at')
    .eq('type', type)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load content "${type}": ${error.message}`);
  }
  if (!data) {
    throw new Error(`Content not found: ${type}`);
  }

  return { data: data.data as T, updatedAt: data.updated_at ?? null };
}
