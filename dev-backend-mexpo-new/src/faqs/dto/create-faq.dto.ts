import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFaqDto {
  @IsNotEmpty({ message: 'Pertanyaan tidak boleh kosong' })
  @IsString()
  question: string;

  @IsNotEmpty({ message: 'Jawaban tidak boleh kosong' })
  @IsString()
  answer: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  is_published?: boolean;
}
