import { InvoicesService } from './invoices.service';
import { TenantContextService } from '../common/tenant-context.service';
export declare class InvoicesController {
    private readonly invoicesService;
    private readonly tenantContext;
    constructor(invoicesService: InvoicesService, tenantContext: TenantContextService);
    create(createDto: any): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        currencyCode: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        contractSnapshotId: string;
        amountPaid: import("@prisma/client-runtime-utils").Decimal;
        balanceDue: import("@prisma/client-runtime-utils").Decimal;
        paymentStatus: string;
    }>;
    findAll(): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        currencyCode: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        contractSnapshotId: string;
        amountPaid: import("@prisma/client-runtime-utils").Decimal;
        balanceDue: import("@prisma/client-runtime-utils").Decimal;
        paymentStatus: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        currencyCode: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        contractSnapshotId: string;
        amountPaid: import("@prisma/client-runtime-utils").Decimal;
        balanceDue: import("@prisma/client-runtime-utils").Decimal;
        paymentStatus: string;
    }>;
    updateStatus(id: string, status: any): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        currencyCode: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        contractSnapshotId: string;
        amountPaid: import("@prisma/client-runtime-utils").Decimal;
        balanceDue: import("@prisma/client-runtime-utils").Decimal;
        paymentStatus: string;
    }>;
}
