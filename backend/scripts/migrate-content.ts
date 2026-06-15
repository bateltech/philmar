/**
 * One-off migration: imports every JSON file from the frontend's
 * public/data folder into the Supabase `content` table.
 *
 * Usage (from the backend folder):
 *   yarn migrate:content
 *
 * Requires SUPABASE_URL and SUPABASE_SECRET_KEY in backend/.env.
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { WebSocket } from 'ws';
import * as fs from 'fs';
import * as path from 'path';

// Node < 22 has no global WebSocket; the Supabase client needs one.
if (typeof (globalThis as { WebSocket?: unknown }).WebSocket === 'undefined') {
  (globalThis as { WebSocket?: unknown }).WebSocket = WebSocket;
}

const CONTENT_TYPES = [
  'concerts',
  'spectacles',
  'discographie',
  'instruments',
  'voix_data',
  'ateliers_instruments',
  'avis_instruments',
  'avis_voix',
  'dernier_album',
  'galerie',
  'galerie_spectacle',
  'social_links',
  'page_404',
];

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    console.error(
      '❌ SUPABASE_URL ou SUPABASE_SECRET_KEY manquant dans backend/.env',
    );
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  const dataDir = path.join(process.cwd(), '../frontend/public/data');

  let imported = 0;
  let skipped = 0;

  for (const type of CONTENT_TYPES) {
    const filePath = path.join(dataDir, `${type}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`⏭️  ${type}: fichier introuvable, ignoré`);
      skipped++;
      continue;
    }

    let data: unknown;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err) {
      console.error(`❌ ${type}: JSON invalide (${(err as Error).message})`);
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from('content')
      .upsert(
        { type, data, updated_at: new Date().toISOString() },
        { onConflict: 'type' },
      );

    if (error) {
      console.error(`❌ ${type}: ${error.message}`);
      skipped++;
    } else {
      console.log(`✅ ${type}: importé`);
      imported++;
    }
  }

  console.log(`\nTerminé. ${imported} importés, ${skipped} ignorés.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
