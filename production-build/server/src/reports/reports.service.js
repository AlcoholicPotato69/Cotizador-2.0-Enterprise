"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_context_1 = require("../prisma/tenant-context");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getKpis() {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        const totalInvoices = await this.prisma.invoice.count({
            where: { tenantId: ctx.tenantId }
        });
        const totalRevenueResult = await this.prisma.invoice.aggregate({
            where: { tenantId: ctx.tenantId, status: 'PAID' },
            _sum: { totalAmount: true }
        });
        const pendingBalanceResult = await this.prisma.invoice.aggregate({
            where: { tenantId: ctx.tenantId, status: { in: ['DRAFT', 'STAMPED', 'PARTIALLY_PAID'] } },
            _sum: { balanceDue: true }
        });
        return {
            totalInvoices,
            totalRevenue: totalRevenueResult._sum.totalAmount ? totalRevenueResult._sum.totalAmount.toNumber() : 0,
            pendingBalance: pendingBalanceResult._sum.balanceDue ? pendingBalanceResult._sum.balanceDue.toNumber() : 0
        };
    }
    async getAdvancedReport() {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        const invoicesByStatus = await this.prisma.invoice.groupBy({
            by: ['status'],
            where: { tenantId: ctx.tenantId },
            _sum: { totalAmount: true },
            _count: { id: true },
        });
        const quotesByStatus = await this.prisma.quote.groupBy({
            by: ['status'],
            where: { tenantId: ctx.tenantId },
            _sum: { totalAmount: true },
            _count: { id: true },
        });
        const clientsByStatus = await this.prisma.client.groupBy({
            by: ['status'],
            where: { tenantId: ctx.tenantId },
            _count: { id: true },
        });
        return {
            reportType: 'ADVANCED_AGGREGATED_METRICS',
            generatedAt: new Date(),
            metrics: {
                invoices: invoicesByStatus.map(item => ({
                    status: item.status,
                    count: item._count.id,
                    totalAmount: item._sum.totalAmount ? item._sum.totalAmount.toNumber() : 0,
                })),
                quotes: quotesByStatus.map(item => ({
                    status: item.status,
                    count: item._count.id,
                    totalAmount: item._sum.totalAmount ? item._sum.totalAmount.toNumber() : 0,
                })),
                clients: clientsByStatus.map(item => ({
                    status: item.status,
                    count: item._count.id,
                })),
            }
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map