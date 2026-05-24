import { PaymentsService } from './payments.service';
import { TenantContextService } from '../common/tenant-context.service';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly tenantContext;
    constructor(paymentsService: PaymentsService, tenantContext: TenantContextService);
    create(createDto: any): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        currencyCode: string;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal;
        invoiceId: string;
    }>;
    findAll(): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        currencyCode: string;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal;
        invoiceId: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        currencyCode: string;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal;
        invoiceId: string;
    }>;
    updateStatus(id: string, status: any): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        currencyCode: string;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal;
        invoiceId: string;
    }>;
}
