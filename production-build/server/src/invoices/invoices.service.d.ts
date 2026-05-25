import { PrismaService } from '../prisma/prisma.service';
import { InvoicesRepository } from './invoices.repository';
import { ConfigService } from '@nestjs/config';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { FsmValidator } from '../common/fsm.validator';
import { Prisma } from '@prisma/client';
export interface GenerateInvoiceDto {
    clientId: string;
    contractId: string;
    totalAmount: Prisma.Decimal;
}
export interface StampResult {
    success: boolean;
    requiresManualUpload: boolean;
    message: string;
}
export declare class InvoicesService {
    private readonly prisma;
    private readonly configService;
    private readonly invoicesRepo;
    private readonly eventPublisher;
    private readonly fsmValidator;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService, invoicesRepo: InvoicesRepository, eventPublisher: DomainEventPublisher, fsmValidator: FsmValidator);
    generateInvoice(dto: GenerateInvoiceDto & {
        currencyCode: string;
    }): Promise<string>;
    stampInvoice(invoiceId: string): Promise<StampResult>;
    uploadManualInvoiceFiles(invoiceId: string, xmlUrl: string, pdfUrl: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        correlationId: string | null;
        traceId: string | null;
        currencyCode: string;
        clientId: string;
        folio: string;
        contractSnapshotId: string;
        totalAmount: Prisma.Decimal;
        amountPaid: Prisma.Decimal;
        balanceDue: Prisma.Decimal;
        paymentStatus: string;
        contractId: string | null;
    } | null>;
    private stampWithIntelisis;
    getInvoiceReport(): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        currencyCode: string;
        totalAmount: Prisma.Decimal;
        amountPaid: Prisma.Decimal;
        balanceDue: Prisma.Decimal;
    }[]>;
}
