import { IsNotEmpty, IsString } from 'class-validator';

export class ReplyContactMessageDto {
  @IsNotEmpty({ message: 'Pesan balasan tidak boleh kosong' })
  @IsString()
  reply_message: string;
}
