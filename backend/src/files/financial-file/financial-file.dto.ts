import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFinancialFileDto {
  @IsUUID()
  @IsNotEmpty()
  invoiceId: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
