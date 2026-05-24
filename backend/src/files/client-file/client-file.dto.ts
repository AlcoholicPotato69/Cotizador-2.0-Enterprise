import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateClientFileDto {
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class AddClientFileDocumentDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  documentType: string;
}
