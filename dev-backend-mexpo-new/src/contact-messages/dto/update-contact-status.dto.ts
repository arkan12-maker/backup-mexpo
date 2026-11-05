import { IsEnum, IsNotEmpty } from 'class-validator';
import { ContactStatus } from '@prisma/client';

export class UpdateContactStatusDto {
  @IsNotEmpty()
  @IsEnum(ContactStatus, { message: 'Status tidak valid' })
  status: ContactStatus;
}
