import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class AddTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number; // positive for adding credit, negative for using it

  @IsString()
  @IsNotEmpty()
  type: string; // e.g., OVERPAYMENT, REFUND, CREDIT_NOTE

  @IsUUID()
  @IsOptional()
  referenceId?: string; // e.g. Payment ID or Invoice ID

  @IsString()
  @IsOptional()
  notes?: string;
}
