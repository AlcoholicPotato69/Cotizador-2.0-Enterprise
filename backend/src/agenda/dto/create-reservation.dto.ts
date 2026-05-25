import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  spaceId: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsOptional()
  occupancySourceType?: string;

  @IsString()
  @IsOptional()
  occupancySourceId?: string;

  @IsString()
  @IsOptional()
  correlationId?: string;
}
