import { InvoicesService, GenerateInvoiceDto } from './invoices.service';
export declare class InvoicesController {
    private readonly service;
    constructor(service: InvoicesService);
    getInvoiceReport(): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        currencyCode: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        amountPaid: import("@prisma/client/runtime/library").Decimal;
        balanceDue: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    getInvoice(id: string): Promise<{
        id: string;
        message: string;
    }>;
    generateInvoice(dto: GenerateInvoiceDto & {
        currencyCode: string;
    }): Promise<string>;
    stampInvoice(id: string): Promise<import("./invoices.service").StampResult>;
    uploadManualInvoice(id: string, dto: {
        xmlUrl: string;
        pdfUrl: string;
    }): Promise<{
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
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        amountPaid: import("@prisma/client/runtime/library").Decimal;
        balanceDue: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: string;
        contractId: string | null;
    } | null>;
}
