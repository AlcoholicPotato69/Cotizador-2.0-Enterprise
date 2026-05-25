import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentsRepository } from './payments.repository';
import { PaymentEvidencesRepository } from './payment-evidences.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentAllocationsRepository } from './payment-allocations.repository';
import { PaymentAllocationListener } from './payment-allocation.listener';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentsRepository,
    PaymentEvidencesRepository,
    PaymentAllocationsRepository,
    PaymentAllocationListener,
  ],
  exports: [PaymentsService, PaymentsRepository, PaymentEvidencesRepository],
})
export class PaymentsModule {}
