import { IsNotEmpty } from 'class-validator';

export class UpdateSiteContentDto {
  @IsNotEmpty({ message: 'Konten tidak boleh kosong' })
  content: any;
}
