import { IsString, IsNotEmpty, IsEmail, MaxLength, IsOptional, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class CreateMessageDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Transform(trim)
  @IsEmail()
  @MaxLength(254)
  email: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message: string;

  /** Champ piège invisible : un humain le laisse vide. */
  @IsOptional()
  @IsString()
  website?: string;

  /** Jeton Cloudflare Turnstile. */
  @IsString()
  @IsNotEmpty()
  turnstileToken: string;

  /** Temps passé sur le formulaire (ms) avant l'envoi. */
  @IsInt()
  @Min(0)
  elapsedMs: number;
}
