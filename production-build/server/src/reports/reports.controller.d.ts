import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
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
