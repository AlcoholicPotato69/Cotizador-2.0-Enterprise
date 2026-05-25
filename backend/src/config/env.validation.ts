import { plainToInstance } from 'class-transformer';
import { IsEnum, IsString, validateSync, IsOptional } from 'class-validator';

export enum SignatureMode {
  INTERNAL = 'INTERNAL',
  DOCUSIGN = 'DOCUSIGN',
}

export enum InvoiceMode {
  INTERNAL = 'INTERNAL',
  INTELISIS = 'INTELISIS',
}

class EnvironmentVariables {
  @IsEnum(['development', 'production', 'test'])
  @IsOptional()
  NODE_ENV?: 'development' | 'production' | 'test' = 'development';

  @IsEnum(SignatureMode)
  @IsOptional()
  SIGNATURE_MODE?: SignatureMode = SignatureMode.INTERNAL;

  @IsEnum(InvoiceMode)
  @IsOptional()
  INVOICE_MODE?: InvoiceMode = InvoiceMode.INTERNAL;

  @IsString()
  @IsOptional()
  DATABASE_URL?: string;

  @IsString()
  @IsOptional()
  JWT_SECRET?: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN?: string = '1d';
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
