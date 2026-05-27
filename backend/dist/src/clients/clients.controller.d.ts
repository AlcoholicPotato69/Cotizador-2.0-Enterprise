import { ClientsService } from './clients.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { EligibilityEngineService, TransactionType } from './eligibility.service';
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
    private readonly eligibilityService;
    constructor(clientsService: ClientsService, eligibilityService: EligibilityEngineService);
    create(req: AuthenticatedRequest, data: Omit<Prisma.ClientUncheckedCreateInput, 'tenantId'>): Promise<{
        id: string;
        tenantId: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        name: string;
        status: import(".prisma/client").$Enums.ClientStatus;
        phone: string | null;
        rfc: string | null;
        bankReference: string | null;
        isTaxValidated: boolean;
        isContractBlocked: boolean;
        isInvoiceBlocked: boolean;
        isPaymentBlocked: boolean;
    }>;
    findAll(req: AuthenticatedRequest): Promise<{
        id: string;
        tenantId: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        name: string;
        status: import(".prisma/client").$Enums.ClientStatus;
        phone: string | null;
        rfc: string | null;
        bankReference: string | null;
        isTaxValidated: boolean;
        isContractBlocked: boolean;
        isInvoiceBlocked: boolean;
        isPaymentBlocked: boolean;
    }[]>;
    findById(req: AuthenticatedRequest, id: string): Promise<{
        id: string;
        tenantId: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        name: string;
        status: import(".prisma/client").$Enums.ClientStatus;
        phone: string | null;
        rfc: string | null;
        bankReference: string | null;
        isTaxValidated: boolean;
        isContractBlocked: boolean;
        isInvoiceBlocked: boolean;
        isPaymentBlocked: boolean;
    } | null>;
    evaluateEligibility(req: AuthenticatedRequest, id: string, transactionType: string): Promise<{
        clientId: string;
        transactionType: TransactionType;
        eligible: boolean;
        reasons: string[];
    }>;
    update(req: AuthenticatedRequest, id: string, data: Prisma.ClientUpdateInput): Promise<{
        id: string;
        tenantId: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        name: string;
        status: import(".prisma/client").$Enums.ClientStatus;
        phone: string | null;
        rfc: string | null;
        bankReference: string | null;
        isTaxValidated: boolean;
        isContractBlocked: boolean;
        isInvoiceBlocked: boolean;
        isPaymentBlocked: boolean;
    }>;
}
export {};
