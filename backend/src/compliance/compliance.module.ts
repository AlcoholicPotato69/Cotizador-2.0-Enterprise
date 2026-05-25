import { Module } from '@nestjs/common';
import { ExpirationEngineService } from './expiration.service';
import { ComplianceEngineService } from './compliance.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ExpirationEngineService, ComplianceEngineService],
  exports: [ExpirationEngineService, ComplianceEngineService],
})
export class ComplianceModule {}
