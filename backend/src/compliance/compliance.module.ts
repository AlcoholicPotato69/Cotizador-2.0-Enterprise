import { Module } from '@nestjs/common';
import { ExpirationEngineService } from './expiration.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ExpirationEngineService],
  exports: [ExpirationEngineService],
})
export class ComplianceModule {}
