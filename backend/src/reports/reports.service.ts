import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { tenantContext } from '../prisma/tenant-context';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getKpis() {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    const totalInvoices = await this.prisma.invoice.count({
      where: { tenantId: ctx.tenantId },
    });

    const totalRevenueResult = await this.prisma.invoice.aggregate({
      where: { tenantId: ctx.tenantId, status: 'PAID' },
      _sum: { totalAmount: true },
    });

    const pendingBalanceResult = await this.prisma.invoice.aggregate({
      where: {
        tenantId: ctx.tenantId,
        status: { in: ['DRAFT', 'STAMPED', 'PARTIALLY_PAID'] },
      },
      _sum: { balanceDue: true },
    });

    return {
      totalInvoices,
      totalRevenue: totalRevenueResult._sum.totalAmount
        ? totalRevenueResult._sum.totalAmount.toNumber()
        : 0,
      pendingBalance: pendingBalanceResult._sum.balanceDue
        ? pendingBalanceResult._sum.balanceDue.toNumber()
        : 0,
    };
  }

  async getAdvancedReport() {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    // Métrica 1: Facturación por estado (Total agrupado)
    const invoicesByStatus = await this.prisma.invoice.groupBy({
      by: ['status'],
      where: { tenantId: ctx.tenantId },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    // Métrica 2: Cotizaciones por estado
    const quotesByStatus = await this.prisma.quote.groupBy({
      by: ['status'],
      where: { tenantId: ctx.tenantId },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    // Métrica 3: Clientes activos vs inactivos
    const clientsByStatus = await this.prisma.client.groupBy({
      by: ['status'],
      where: { tenantId: ctx.tenantId },
      _count: { id: true },
    });

    return {
      reportType: 'ADVANCED_AGGREGATED_METRICS',
      generatedAt: new Date(),
      metrics: {
        invoices: invoicesByStatus.map((item) => ({
          status: item.status,
          count: item._count.id,
          totalAmount: item._sum.totalAmount
            ? item._sum.totalAmount.toNumber()
            : 0,
        })),
        quotes: quotesByStatus.map((item) => ({
          status: item.status,
          count: item._count.id,
          totalAmount: item._sum.totalAmount
            ? item._sum.totalAmount.toNumber()
            : 0,
        })),
        clients: clientsByStatus.map((item) => ({
          status: item.status,
          count: item._count.id,
        })),
      },
    };
  }
}
