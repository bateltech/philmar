import { IsString, IsNotEmpty } from 'class-validator';

export class InstrumentDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  image: string;
}
