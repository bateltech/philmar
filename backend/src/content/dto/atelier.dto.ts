import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AtelierDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  objectifs?: string;

  @IsString()
  @IsOptional()
  approche?: string;

  @IsString()
  @IsOptional()
  deroulement?: string;

  @IsString()
  @IsOptional()
  pdf?: string;
}
