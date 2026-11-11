import { IsIn, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

/** Page vue envoyée par le site public (via la route Next.js /api/track). */
export class PageViewDto {
  @IsString()
  @MaxLength(200)
  @Matches(/^\//)
  path: string;

  /** Site d'origine du visiteur (ex. « google.com »), seulement à l'arrivée sur le site. */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  referrer?: string;

  /** Code pays ISO à 2 lettres, fourni par Vercel. */
  @IsOptional()
  @Matches(/^[A-Z]{2}$/)
  country?: string;

  @IsIn(['mobile', 'tablet', 'desktop'])
  device: 'mobile' | 'tablet' | 'desktop';

  /** Empreinte anonyme du visiteur, différente chaque jour (impossible de le suivre d'un jour à l'autre). */
  @Matches(/^[a-f0-9]{16}$/)
  visitor: string;
}
