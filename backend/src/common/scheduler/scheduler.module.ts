import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ComplianceModule } from '../../compliance/compliance.module';

@Module({
  imports: [PrismaModule, ComplianceModule],
  providers: [SchedulerService],
})
export class SchedulerWorkerModule {}
