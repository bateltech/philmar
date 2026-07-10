import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SupabaseService } from './supabase/supabase.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Lightweight keep-alive endpoint.
   * Pinged by an external cron (UptimeRobot) every few minutes to prevent the
   * Render service AND the Supabase project from going idle on the free tier.
   * The Supabase query is a HEAD count: it hits the DB without transferring rows.
   */
  @Get('health')
  async getHealth(): Promise<{ status: string; db: string; time: string }> {
    let db = 'ok';
    try {
      const { error } = await this.supabaseService
        .getClient()
        .from('content')
        .select('type', { count: 'exact', head: true })
        .limit(1);
      if (error) {
        db = 'error';
      }
    } catch {
      db = 'error';
    }

    return {
      status: 'ok',
      db,
      time: new Date().toISOString(),
    };
  }
}
