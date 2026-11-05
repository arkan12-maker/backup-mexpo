import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CheckoutDto {
  /** Optional: required only when the visitor has no ticket yet. */
  @IsOptional()
  @IsString()
  ticket_type_id?: string;
}

export class UpdatePayoutDto {
  @IsOptional()
  @IsString()
  payout_bank_name?: string;

  @IsOptional()
  @IsString()
  payout_account_number?: string;

  @IsOptional()
  @IsString()
  payout_account_holder?: string;

  /** True when committee officially opens / requests settlement from superadmin */
  @IsOptional()
  @IsBoolean()
  request_settlement?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class SettleDto {
  /** Must equal the exact net amount from settlement-summary (double confirm). */
  @IsInt()
  @Min(0)
  @Type(() => Number)
  amount_transferred: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class RefundTransactionDto {
  @IsString()
  reason: string;
}

export class QueryTransactionDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  quantity?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
