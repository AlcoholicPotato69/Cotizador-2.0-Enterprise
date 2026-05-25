import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum AgreementType {
  PATROCINIO = 'PATROCINIO',
  INTERCAMBIO = 'INTERCAMBIO',
  CORTESIA = 'CORTESIA',
  DESCUENTO = 'DESCUENTO',
  COLABORACION = 'COLABORACION',
}

export enum AgreementStatus {
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  LETTER_GENERATED = 'LETTER_GENERATED',
  PENDING_SIGNATURE = 'PENDING_SIGNATURE',
  SIGNED = 'SIGNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export class CreateAgreementDto {
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @IsEnum(AgreementType)
  @IsNotEmpty()
  type: AgreementType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @Type(() => Date)
  validFrom: Date;

  @IsDate()
  @Type(() => Date)
  validUntil: Date;

  @IsNumber()
  @IsOptional()
  value?: number;
}

export class UpdateAgreementDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  validFrom?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  validUntil?: Date;

  @IsNumber()
  @IsOptional()
  value?: number;
}

export class AgreementItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class AddAgreementItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AgreementItemDto)
  items: AgreementItemDto[];
}

export class RejectAgreementDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class CancelAgreementDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class SignAgreementDto {
  @IsString()
  @IsNotEmpty()
  signerId: string;

  @IsString()
  @IsNotEmpty()
  signatureData: string;
}
