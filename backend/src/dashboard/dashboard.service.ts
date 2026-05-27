import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getMetrics() {
    return {
      success: true,
      data: {
        totalRevenue: 1542000,
        revenueGrowth: 12.5,
        occupancyRate: 85,
        activeQuotes: 42,
        quotesGrowth: -3.2,
        pendingSignatures: 8,
        pipeline: {
          leads: 120,
          quotes: 45,
          contracts: 15,
          conversionRate: 12.5,
        },
        recentActivity: [
          {
            id: '1',
            type: 'CONTRACT',
            title: 'Contrato Plaza VIP firmado',
            date: new Date().toISOString(),
            status: 'SIGNED',
          },
          {
            id: '2',
            type: 'QUOTE',
            title: 'Cotización Isla Central enviada',
            date: new Date().toISOString(),
            amount: 25000,
            status: 'PENDING',
          },
          {
            id: '3',
            type: 'PAYMENT',
            title: 'Pago recibido Local 104',
            date: new Date().toISOString(),
            amount: 15000,
            status: 'PAID',
          },
        ],
      },
    };
  }
}
