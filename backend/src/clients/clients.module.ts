import { Module } from '@nestjs/common';
import { EligibilityEngineService } from './eligibility.service';
import { ComplianceService } from './compliance.service';
import { ClientsRepository } from './clients.repository';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClientsController],
  providers: [
    ClientsRepository,
    ClientsService,
    EligibilityEngineService,
    ComplianceService,
  ],
  exports: [
    ClientsRepository,
    ClientsService,
    EligibilityEngineService,
    ComplianceService,
  ],
})
export class ClientsModule {}
