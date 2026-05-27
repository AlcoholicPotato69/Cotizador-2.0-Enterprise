import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
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
    create(req: AuthenticatedRequest, data: CreateClientDto): Promise<{
        id: string;
        email: string | null;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        name: string;
        phone: string | null;
        rfc: string | null;
        status: import(".prisma/client").$Enums.ClientStatus;
        bankReference: string | null;
        isTaxValidated: boolean;
        isContractBlocked: boolean;
        isInvoiceBlocked: boolean;
        isPaymentBlocked: boolean;
    }>;
    findAll(req: AuthenticatedRequest): Promise<{
        id: string;
        email: string | null;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        name: string;
        phone: string | null;
        rfc: string | null;
        status: import(".prisma/client").$Enums.ClientStatus;
        bankReference: string | null;
        isTaxValidated: boolean;
        isContractBlocked: boolean;
        isInvoiceBlocked: boolean;
        isPaymentBlocked: boolean;
    }[]>;
    findById(req: AuthenticatedRequest, id: string): Promise<{
        id: string;
        email: string | null;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        name: string;
        phone: string | null;
        rfc: string | null;
        status: import(".prisma/client").$Enums.ClientStatus;
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
    update(req: AuthenticatedRequest, id: string, data: UpdateClientDto): Promise<{
        id: string;
        email: string | null;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        name: string;
        phone: string | null;
        rfc: string | null;
        status: import(".prisma/client").$Enums.ClientStatus;
        bankReference: string | null;
        isTaxValidated: boolean;
        isContractBlocked: boolean;
        isInvoiceBlocked: boolean;
        isPaymentBlocked: boolean;
    }>;
}
export {};
