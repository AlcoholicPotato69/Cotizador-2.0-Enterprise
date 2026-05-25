import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getKpis(): Promise<{
        totalInvoices: number;
        totalRevenue: number;
        pendingBalance: number;
    }>;
    getAdvancedReport(): Promise<{
        reportType: string;
        generatedAt: Date;
        metrics: {
            invoices: {
                status: import(".prisma/client").$Enums.InvoiceStatus;
                count: number;
                totalAmount: number;
            }[];
            quotes: {
                status: import(".prisma/client").$Enums.QuoteStatus;
                count: number;
                totalAmount: number;
            }[];
            clients: {
                status: import(".prisma/client").$Enums.ClientStatus;
                count: number;
            }[];
        };
    }>;
}
