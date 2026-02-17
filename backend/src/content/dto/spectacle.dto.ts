import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SpectacleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  link?: string;
}
