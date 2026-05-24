import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateQuoteFileDto {
  @IsUUID()
  @IsNotEmpty()
  quoteId: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
