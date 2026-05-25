import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsUUID,
} from 'class-validator';

export class CreateSpaceConfigurationDto {
  @IsUUID()
  @IsNotEmpty()
  spaceId: string;

  @IsString()
  @IsNotEmpty()
  configKey: string;

  @IsObject()
  @IsNotEmpty()
  configValue: Record<string, any>;
}

export class CreateSpaceRuleDto {
  @IsUUID()
  @IsNotEmpty()
  spaceId: string;

  @IsString()
  @IsNotEmpty()
  ruleType: string;

  @IsObject()
  @IsNotEmpty()
  ruleDetails: Record<string, any>;
}
