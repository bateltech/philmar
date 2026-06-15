import { Injectable, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { WebSocket } from 'ws';

// Node < 22 has no global WebSocket. The Supabase realtime client (constructed
// even though we never use realtime) requires one, so expose `ws` globally.
if (typeof (globalThis as { WebSocket?: unknown }).WebSocket === 'undefined') {
  (globalThis as { WebSocket?: unknown }).WebSocket = WebSocket;
}

/**
 * Wraps a single Supabase client configured with the SECRET key.
 * The secret key bypasses Row Level Security, so this client must only
 * ever be used from the backend (never exposed to the browser).
 */
@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const url = this.configService.get<string>('supabase.url');
    const key = this.configService.get<string>('supabase.secretKey');

    if (!url || !key) {
      throw new InternalServerErrorException(
        'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY in the backend .env file.',
      );
    }

    this.client = createClient(url, key, {
      auth: { persistSession: false },
    });
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
