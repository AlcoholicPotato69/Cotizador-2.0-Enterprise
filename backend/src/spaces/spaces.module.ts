import { Module } from '@nestjs/common';
import { AvailabilityEngineService } from './availability.service';
import { SpacesRepository } from './spaces.repository';
import { OccupancyRepository } from './occupancy.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [PrismaModule, CommonModule],
  providers: [SpacesRepository, OccupancyRepository, AvailabilityEngineService],
  exports: [SpacesRepository, OccupancyRepository, AvailabilityEngineService],
})
export class SpacesModule {}
