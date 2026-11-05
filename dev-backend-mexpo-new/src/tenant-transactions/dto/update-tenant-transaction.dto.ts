import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DetailTransactionDto } from './create-tenant-transaction.dto';
import { Transform, Type } from 'class-transformer';

export class UpdateTenantTransactionDto {
  @IsOptional()
  @Transform(({ value }: { value?: unknown }) =>
    typeof value === 'string'
      ? (JSON.parse(value) as DetailTransactionDto[])
      : value,
  )
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailTransactionDto)
  detail_transactions?: DetailTransactionDto[];

  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @Transform(({ value }: { value?: unknown }) => {
    if (value === 'true' || value === true || value === 1 || value === '1')
      return true;
    if (value === 'false' || value === false || value === 0 || value === '0')
      return false;
    return value;
  })
  @IsBoolean()
  paid?: boolean;

  @IsOptional()
  @IsString()
  visitor_id?: string;
}
