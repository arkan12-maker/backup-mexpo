import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FaqOrderItem {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsNotEmpty()
  @IsInt()
  order: number;
}

export class ReorderFaqDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FaqOrderItem)
  items: FaqOrderItem[];
}
