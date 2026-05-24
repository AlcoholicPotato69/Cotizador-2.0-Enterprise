import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateContractFileDto {
  @IsUUID()
  @IsNotEmpty()
  contractId: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
