import { InvoicesRepository } from './invoices.repository';
import { PrismaService } from '../prisma/prisma.service';
import { FsmValidator } from '../common/fsm.validator';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
export interface PaymentApprovedEvent {
    tenantId: string;
    payload: {
        invoiceId: string;
        amount: string | number;
        paymentId: string;
        [key: string]: unknown;
    };
}
export declare class InvoicesListener {
    private readonly prisma;
    private readonly invoicesRepo;
    private readonly fsmValidator;
    private readonly eventPublisher;
    constructor(prisma: PrismaService, invoicesRepo: InvoicesRepository, fsmValidator: FsmValidator, eventPublisher: DomainEventPublisher);
    handlePaymentApproved(event: PaymentApprovedEvent): Promise<void>;
    handlePaymentRefunded(event: PaymentApprovedEvent): Promise<void>;
}
