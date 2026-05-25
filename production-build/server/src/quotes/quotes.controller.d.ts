import { QuotesService } from './quotes.service';
import { Prisma, QuoteStatus } from '@prisma/client';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        tenantId: string;
        role: string;
        permissions: string[];
    };
}
export declare class QuotesController {
    private readonly service;
    constructor(service: QuotesService);
    createQuote(req: AuthenticatedRequest, body: Record<string, unknown>): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.QuoteStatus;
        correlationId: string | null;
        traceId: string | null;
        currencyCode: string;
        clientId: string;
        totalAmount: Prisma.Decimal;
        clientSnapshotId: string;
        occupancySnapshotId: string;
        desglosePrecios: Prisma.JsonValue;
    }>;
    updateStatus(req: AuthenticatedRequest, id: string, status: QuoteStatus): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.QuoteStatus;
        correlationId: string | null;
        traceId: string | null;
        currencyCode: string;
        clientId: string;
        totalAmount: Prisma.Decimal;
        clientSnapshotId: string;
        occupancySnapshotId: string;
        desglosePrecios: Prisma.JsonValue;
    }>;
}
export {};
