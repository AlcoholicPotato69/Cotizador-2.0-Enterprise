import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentsRepository } from './payments.repository';
import { PaymentEvidencesRepository } from './payment-evidences.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [PrismaModule, InvoicesModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository, PaymentEvidencesRepository],
  exports: [PaymentsService, PaymentsRepository, PaymentEvidencesRepository],
})
export class PaymentsModule {}
