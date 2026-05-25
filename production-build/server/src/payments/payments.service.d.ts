import { PrismaService } from '../prisma/prisma.service';
import { PaymentsRepository } from './payments.repository';
import { PaymentEvidencesRepository } from './payment-evidences.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { Prisma } from '@prisma/client';
import { FsmValidator } from '../common/fsm.validator';
export interface SubmitPaymentDto {
    invoiceId: string;
    paymentAmount: Prisma.Decimal;
    evidenceUrl: string;
    currencyCode: string;
}
export interface RejectPaymentDto {
    paymentId: string;
    rejectionReason: string;
}
export interface RefundPaymentDto {
    paymentId: string;
    refundReason: string;
}
export declare class PaymentsService {
    private readonly prisma;
    private readonly paymentsRepo;
    private readonly evidencesRepo;
    private readonly eventPublisher;
    private readonly fsmValidator;
    constructor(prisma: PrismaService, paymentsRepo: PaymentsRepository, evidencesRepo: PaymentEvidencesRepository, eventPublisher: DomainEventPublisher, fsmValidator: FsmValidator);
    submitPayment(dto: SubmitPaymentDto): Promise<string>;
    approvePayment(paymentId: string): Promise<void>;
    rejectPayment(dto: RejectPaymentDto): Promise<void>;
    refundPayment(dto: RefundPaymentDto): Promise<void>;
}
