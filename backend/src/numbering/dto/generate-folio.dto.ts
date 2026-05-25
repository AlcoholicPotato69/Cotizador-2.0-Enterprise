import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class GenerateFolioDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsString()
  @IsNotEmpty()
  entityType: string;

  @IsString()
  @IsOptional()
  prefix?: string;

  @IsString()
  @IsOptional()
  suffix?: string;

  @IsNumber()
  @IsOptional()
  step?: number;
}
