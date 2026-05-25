import { EventEmitter2 } from '@nestjs/event-emitter';
import { CustomerCreditsRepository } from './customer-credits.repository';
import { AddTransactionDto } from './dto/add-transaction.dto';
export declare class CustomerCreditsService {
    private readonly repository;
    private readonly eventEmitter;
    constructor(repository: CustomerCreditsRepository, eventEmitter: EventEmitter2);
    getBalance(tenantId: string, clientId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        currencyCode: string;
        clientId: string;
        balanceAmount: import("@prisma/client/runtime/library").Decimal;
        creditLimit: import("@prisma/client/runtime/library").Decimal | null;
        lastResetAt: Date | null;
    } | {
        tenantId: string;
        clientId: string;
        balanceAmount: number;
    }>;
    addTransaction(tenantId: string, dto: AddTransactionDto, userId: string): Promise<{
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
            amount: import("@prisma/client/runtime/library").Decimal;
            balanceAfter: import("@prisma/client/runtime/library").Decimal | null;
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
            balanceAmount: import("@prisma/client/runtime/library").Decimal;
            creditLimit: import("@prisma/client/runtime/library").Decimal | null;
            lastResetAt: Date | null;
        };
    }>;
}
