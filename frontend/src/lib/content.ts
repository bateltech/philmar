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
