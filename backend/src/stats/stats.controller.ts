import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  ParseIntPipe,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PageViewDto } from './page-view.dto';
import { STATS_PERIODS, StatsService } from './stats.service';

/**
 * Statistiques de visites du site :
 * - POST /api/stats/pageview : appelé uniquement par le site Next.js (secret partagé)
 * - GET  /api/stats?days=30  : résumé pour l'admin
 */
@Controller('api/stats')
export class StatsController {
  constructor(
    private statsService: StatsService,
    private configService: ConfigService,
  ) {}

  @Post('pageview')
  @HttpCode(204)
  async pageView(@Body() dto: PageViewDto, @Headers('x-stats-secret') secret?: string) {
    const expected = this.configService.get<string>('stats.ingestSecret');
    if (!expected || !secret) throw new UnauthorizedException();
    const a = Buffer.from(secret);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) throw new UnauthorizedException();
    await this.statsService.record(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  summary(@Query('days', new ParseIntPipe({ optional: true })) days = 30) {
    if (!(STATS_PERIODS as readonly number[]).includes(days)) {
      throw new BadRequestException(`Période invalide (valeurs possibles : ${STATS_PERIODS.join(', ')} jours).`);
    }
    return this.statsService.summary(days);
  }
}
