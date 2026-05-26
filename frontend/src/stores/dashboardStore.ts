import { defineStore } from 'pinia';
import { ref } from 'vue';
import { http } from '../api/http';

export interface DashboardMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  occupancyRate: number;
  occupancyGrowth: number;
  activeQuotes: number;
  quotesGrowth: number;
  pendingSignatures: number;
  pipeline: {
    leads: number;
    quotes: number;
    contracts: number;
    conversionRate: number;
  };
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
    pipeline: {
      leads: 0,
      quotes: 0,
      contracts: 0,
      conversionRate: 0,
    },
    recentActivity: [],
  });

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchDashboardMetrics() {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await http.get('/dashboard/metrics');
      if (!res.data) {
        return;
      }

      const payload = res.data.data ? res.data.data : res.data;
      metrics.value = { ...metrics.value, ...payload };

      if (payload.pipeline) {
        metrics.value.pipeline = {
          ...metrics.value.pipeline,
          ...payload.pipeline,
        };
      }
    } catch (err: any) {
      console.warn('Dashboard metrics endpoint failed.', err);
      error.value = err?.message || 'No se pudieron cargar metricas del dashboard';
    } finally {
      isLoading.value = false;
    }
  }

  return { metrics, isLoading, error, fetchDashboardMetrics };
});
