import { IsString, IsNotEmpty } from 'class-validator';

export class SignContractDto {
  @IsString()
  @IsNotEmpty()
  contractId: string;

  @IsString()
  @IsNotEmpty()
  participantName: string;

  @IsString()
  @IsNotEmpty()
  participantRole: string;

  @IsString()
  @IsNotEmpty()
  signatureData: string;
}
