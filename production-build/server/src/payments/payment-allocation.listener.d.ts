import { PrismaService } from '../prisma/prisma.service';
import { PaymentAllocationsRepository } from './payment-allocations.repository';
export declare class PaymentAllocationListener {
    private readonly prisma;
    private readonly allocationsRepo;
    private readonly logger;
    constructor(prisma: PrismaService, allocationsRepo: PaymentAllocationsRepository);
    handlePaymentAllocated(event: {
        tenantId: string;
        payload: any;
    }): Promise<void>;
}
