import { IsString, IsNumber, IsOptional, IsEnum, IsObject, Min } from 'class-validator';
import { QuoteStatus } from '@prisma/client';

export class CreateQuoteDto {
  @IsString()
  clientId!: string;

  @IsString()
  clientSnapshotId!: string;

  @IsString()
  occupancySnapshotId!: string;

  @IsString()
  currencyCode!: string;

  @IsNumber()
  @Min(0)
  totalAmount!: number;

  @IsObject()
  desglosePrecios!: Record<string, any>;

  @IsOptional()
  @IsEnum(QuoteStatus)
  status?: QuoteStatus;
}
