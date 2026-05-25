import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateRegulationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  version?: string;
}

export class AcceptRegulationDto {
  @IsUUID()
  @IsNotEmpty()
  regulationId: string;

  @IsUUID()
  @IsNotEmpty()
  acceptedBy: string;

  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsString()
  @IsNotEmpty()
  version: string;
}
