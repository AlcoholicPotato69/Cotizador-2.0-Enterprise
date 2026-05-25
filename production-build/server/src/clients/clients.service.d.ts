import { ClientsRepository } from './clients.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { Prisma } from '@prisma/client';
export declare class ClientsService {
    private readonly repo;
    private readonly eventPublisher;
    constructor(repo: ClientsRepository, eventPublisher: DomainEventPublisher);
    create(data: Omit<Prisma.ClientUncheckedCreateInput, 'tenantId'>): Promise<{
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
    findById(id: string): Promise<{
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
    update(id: string, data: Prisma.ClientUpdateInput): Promise<{
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
