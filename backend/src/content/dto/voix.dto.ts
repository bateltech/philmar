import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class VoixDto {
  @IsString()
  @IsIn(['cours', 'atelier', 'stage'])
  type: string;

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
  @IsNotEmpty()
  details: string;

  @IsString()
  @IsOptional()
  objectifs?: string;

  @IsString()
  @IsOptional()
  infos?: string;

  @IsString()
  @IsOptional()
  infos2?: string;

  @IsString()
  @IsNotEmpty()
  link: string;
}
