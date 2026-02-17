import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsIn } from 'class-validator';

export class AlbumDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  imageSrc: string;

  @IsString()
  @IsIn(['album', 'enregistrement', 'conte'])
  genre: string;

  @IsNumber()
  year: number;

  @IsBoolean()
  forSale: boolean;

  @IsString()
  @IsOptional()
  purchaseLink?: string;

  @IsString()
  @IsOptional()
  soundcloudLink?: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
