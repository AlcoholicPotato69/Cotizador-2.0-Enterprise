import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
  IsObject,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { SpaceStatus } from '@prisma/client';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @IsNumber()
  @IsNotEmpty()
  areaSqm: number;

  @IsNumber()
  @IsNotEmpty()
  basePricePerHour: number;

  @IsObject()
  @IsNotEmpty()
  configB2b: any;

  @IsObject()
  @IsNotEmpty()
  preciosPorDia: any;

  @IsArray()
  @IsNotEmpty()
  diasBloqueados: any[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  impuestosIds: string[];

  @IsEnum(SpaceStatus)
  @IsOptional()
  status?: SpaceStatus;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNotEmpty()
  tags: any;

  @IsString()
  @IsNotEmpty()
  spaceType: string;

  @IsString()
  @IsOptional()
  material?: string;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsString()
  @IsOptional()
  measureUnit?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  allowsAgreement?: boolean;

  @IsString()
  @IsNotEmpty()
  regulationTemplate: string;

  @IsString()
  @IsNotEmpty()
  planoPdf: string;

  @IsString()
  @IsOptional()
  geographicMap?: string;

  @IsBoolean()
  @IsOptional()
  isDigital?: boolean;

  @IsNotEmpty()
  images: any;
}
