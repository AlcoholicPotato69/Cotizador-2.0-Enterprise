import { Module } from '@nestjs/common';
import { AvailabilityEngineService } from './availability.service';
import { SpacesRepository } from './spaces.repository';
import { OccupancyRepository } from './occupancy.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';
import { SpaceConfigurationService } from './configuration/space-configuration.service';
import { SpaceConfigurationController } from './configuration/space-configuration.controller';

import { SpacesService } from './spaces.service';
import { SpacesController } from './spaces.controller';
import { OccupancyService } from './occupancy.service';
import { OccupancyController } from './occupancy.controller';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [
    SpaceConfigurationController,
    SpacesController,
    OccupancyController,
  ],
  providers: [
    SpacesRepository,
    OccupancyRepository,
    AvailabilityEngineService,
    SpaceConfigurationService,
    SpacesService,
    OccupancyService,
  ],
  exports: [
    SpacesRepository,
    OccupancyRepository,
    AvailabilityEngineService,
    SpaceConfigurationService,
    SpacesService,
    OccupancyService,
  ],
})
export class SpacesModule {}
