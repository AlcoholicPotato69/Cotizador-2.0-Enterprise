import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class RescheduleReservationDto {
  @IsDateString()
  @IsNotEmpty()
  @IsNotEmpty()
@IsString()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  @IsNotEmpty()
@IsString()
  endTime: string;
}
