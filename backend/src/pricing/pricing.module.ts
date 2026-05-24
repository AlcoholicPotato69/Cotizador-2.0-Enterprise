import { Module } from '@nestjs/common';
import { PricingEngineService } from './pricing.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PricingEngineService],
  exports: [PricingEngineService],
})
export class PricingModule {}
