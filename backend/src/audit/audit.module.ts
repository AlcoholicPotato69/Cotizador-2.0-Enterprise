import { Module, Global } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditRepository } from './audit.repository';
import { AuditController } from './audit.controller';
import { TamperDetectionService } from './tamper-detection.service';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [AuditController],
  providers: [AuditRepository, AuditService, TamperDetectionService],
  exports: [AuditService, AuditRepository, TamperDetectionService],
})
export class AuditModule {}
