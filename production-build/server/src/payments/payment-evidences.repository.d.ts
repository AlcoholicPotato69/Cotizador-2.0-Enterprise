import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PaymentEvidence } from '@prisma/client';
export declare class PaymentEvidencesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tx: Prisma.TransactionClient, data: Prisma.PaymentEvidenceUncheckedCreateInput): Promise<PaymentEvidence>;
    findLatest(tx: Prisma.TransactionClient, tenantId: string): Promise<PaymentEvidence | null>;
}
