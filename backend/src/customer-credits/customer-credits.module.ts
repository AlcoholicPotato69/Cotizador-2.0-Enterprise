import { Module } from '@nestjs/common';
import { CustomerCreditsService } from './customer-credits.service';
import { CustomerCreditsController } from './customer-credits.controller';
import { CustomerCreditsRepository } from './customer-credits.repository';
import { CustomerCreditsListener } from './customer-credits.listener';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerCreditsController],
  providers: [
    CustomerCreditsService,
    CustomerCreditsRepository,
    CustomerCreditsListener,
  ],
  exports: [CustomerCreditsService, CustomerCreditsRepository],
})
export class CustomerCreditsModule {}
