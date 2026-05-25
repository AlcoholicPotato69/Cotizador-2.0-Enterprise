import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
export class CreateAgreementFileDto {
  @IsNotEmpty()
@IsUUID()
  agreementId: string;
  @IsNotEmpty()
@IsString()
  url: string;
}
