import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class CustomerCreditsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getBalance(tenantId: string, clientId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        currencyCode: string;
        clientId: string;
        balanceAmount: Prisma.Decimal;
        creditLimit: Prisma.Decimal | null;
        lastResetAt: Date | null;
    } | null>;
    addTransaction(data: Prisma.CreditTransactionUncheckedCreateInput): Promise<{
        transaction: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            deletedBy: string | null;
            description: string | null;
            correlationId: string | null;
            traceId: string | null;
            clientId: string;
            amount: Prisma.Decimal;
            balanceAfter: Prisma.Decimal | null;
            transactionType: import(".prisma/client").$Enums.CreditTransactionType;
            referenceId: string | null;
        };
        balance: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            deletedBy: string | null;
            currencyCode: string;
            clientId: string;
            balanceAmount: Prisma.Decimal;
            creditLimit: Prisma.Decimal | null;
            lastResetAt: Date | null;
        };
    }>;
}
