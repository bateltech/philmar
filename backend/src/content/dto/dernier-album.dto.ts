import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SoundcloudDto {
  @IsString()
  @IsNotEmpty()
  playlistUrl: string;
}

export class DernierAlbumDto {
  @ValidateNested()
  @Type(() => SoundcloudDto)
  soundcloud: SoundcloudDto;
}
