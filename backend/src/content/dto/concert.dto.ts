import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ConcertDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsOptional()
  link?: string;
}
