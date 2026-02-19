import { IsString, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class SoundcloudDto {
  @IsString()
  @IsNotEmpty()
  playlistUrl: string;
}

class VinylDto {
  @IsString()
  @IsNotEmpty()
  playlistUrl: string;
}

export class DernierAlbumDto {
  @ValidateNested()
  @Type(() => SoundcloudDto)
  soundcloud: SoundcloudDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => VinylDto)
  vinyl?: VinylDto;
}
