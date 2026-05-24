import { Module } from '@nestjs/common';
import { EligibilityEngineService } from './eligibility.service';
import { ClientsRepository } from './clients.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ClientsRepository, EligibilityEngineService],
  exports: [ClientsRepository, EligibilityEngineService],
})
export class ClientsModule {}
