import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface DashboardMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  occupancyRate: number;
  occupancyGrowth: number;
  activeQuotes: number;
  quotesGrowth: number;
  pendingSignatures: number;
  recentActivity: Array<{
    id: string;
    type: 'QUOTE' | 'CONTRACT' | 'PAYMENT';
    title: string;
    date: string;
    amount?: number;
    status: string;
  }>;
}

export const useDashboardStore = defineStore('dashboard', () => {
  const metrics = ref<DashboardMetrics>({
    totalRevenue: 0,
    revenueGrowth: 0,
    occupancyRate: 0,
    occupancyGrowth: 0,
    activeQuotes: 0,
    quotesGrowth: 0,
    pendingSignatures: 0,
    recentActivity: []
  });
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchDashboardMetrics() {
    isLoading.value = true;
    error.value = null;
    try {
      // Simulate API call for now. In a real app, this would be an Axios call.
      // await axios.get('/api/dashboard/metrics');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      metrics.value = {
        totalRevenue: 1245000,
        revenueGrowth: 14.5,
        occupancyRate: 78,
        occupancyGrowth: 5.2,
        activeQuotes: 45,
        quotesGrowth: -2.1,
        pendingSignatures: 12,
        recentActivity: [
          { id: '1', type: 'CONTRACT', title: 'Boda M&M - Salón Diamante', date: '2026-05-24', amount: 150000, status: 'SIGNED' },
          { id: '2', type: 'QUOTE', title: 'Convención TechCorp', date: '2026-05-23', amount: 450000, status: 'PENDING' },
          { id: '3', type: 'PAYMENT', title: 'Anticipo XV Años', date: '2026-05-22', amount: 50000, status: 'PAID' },
          { id: '4', type: 'QUOTE', title: 'Graduación UVM', date: '2026-05-21', amount: 280000, status: 'APPROVED' },
        ]
      };
    } catch (err: any) {
      error.value = err.message || 'Error fetching dashboard metrics';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  return { metrics, isLoading, error, fetchDashboardMetrics };
});
