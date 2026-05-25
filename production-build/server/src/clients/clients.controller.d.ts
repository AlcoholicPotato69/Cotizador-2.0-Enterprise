import { ClientsService } from './clients.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        tenantId: string;
        role: string;
        permissions: string[];
    };
}
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(req: AuthenticatedRequest, data: Omit<Prisma.ClientUncheckedCreateInput, 'tenantId'>): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.ClientStatus;
        bankReference: string | null;
        isTaxValidated: boolean;
        isContractBlocked: boolean;
        isInvoiceBlocked: boolean;
        isPaymentBlocked: boolean;
    }>;
    findById(req: AuthenticatedRequest, id: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.ClientStatus;
        bankReference: string | null;
        isTaxValidated: boolean;
        isContractBlocked: boolean;
        isInvoiceBlocked: boolean;
        isPaymentBlocked: boolean;
    } | null>;
    update(req: AuthenticatedRequest, id: string, data: Prisma.ClientUpdateInput): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.ClientStatus;
        bankReference: string | null;
        isTaxValidated: boolean;
        isContractBlocked: boolean;
        isInvoiceBlocked: boolean;
        isPaymentBlocked: boolean;
    }>;
}
export {};
