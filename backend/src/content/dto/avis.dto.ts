import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AvisDto {
  @IsString()
  @IsNotEmpty()
  texte: string;

  @IsString()
  @IsNotEmpty()
  auteur: string;

  @IsString()
  @IsOptional()
  lieu?: string;
}
