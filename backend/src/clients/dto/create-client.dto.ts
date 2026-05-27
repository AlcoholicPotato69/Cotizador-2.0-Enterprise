import { IsString, IsOptional, IsEmail, IsBoolean, IsEnum } from 'class-validator';
import { ClientStatus } from '@prisma/client';

export class CreateClientDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  rfc?: string;

  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @IsOptional()
  @IsString()
  bankReference?: string;
}
