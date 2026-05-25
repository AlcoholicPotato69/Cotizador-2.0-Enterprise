<template>
  <div class="space-y-8 pb-10">
    <!-- Corporate Header -->
    <header class="flex flex-col md:flex-row md:items-end justify-between border-b border-surface-200 pb-5 gap-4">
      <div>
        <h1 class="text-3xl font-display font-bold text-surface-900 tracking-tight">Panel Gerencial</h1>
        <p class="text-sm text-surface-500 mt-1 font-body">
          Visión consolidada de métricas operativas y comerciales
        </p>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center gap-3">
        <Button 
          v-if="permissionsStore.can('quotes.create')"
          icon="pi pi-plus" 
          label="Nueva Cotización" 
          class="bg-primary-600 hover:bg-primary-500 text-white border-none shadow-[var(--tenant-glow)] px-4 py-2 font-medium text-sm rounded-md transition-colors"
        />
        <Button 
          icon="pi pi-download" 
          label="Exportar" 
          outlined
          class="border-surface-300 text-surface-700 hover:bg-surface-50 px-4 py-2 font-medium text-sm rounded-md transition-colors"
        />
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="dashboardStore.isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-8">
      
      <!-- KPIs Grid -->
      <section>
        <h2 class="text-xs font-bold text-surface-400 uppercase tracking-widest mb-4">Métricas Principales</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Ingresos -->
          <Card class="bg-surface-base shadow-[var(--tenant-glow)] border border-surface-subtle !rounded-xl">
            <template #content>
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm font-semibold text-surface-muted mb-1">Ingresos (Mensual)</p>
                  <p class="text-3xl font-display font-bold text-surface-900">
                    {{ formatCurrency(dashboardStore.metrics.totalRevenue) }}
                  </p>
                </div>
                <div class="p-2 bg-surface-alt rounded-lg text-primary-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
              </div>
              <div class="mt-4 flex items-center text-sm">
                <span :class="dashboardStore.metrics.revenueGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'" class="font-medium flex items-center">
                  <svg v-if="dashboardStore.metrics.revenueGrowth >= 0" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                  {{ Math.abs(dashboardStore.metrics.revenueGrowth) }}%
                </span>
                <span class="ml-2 text-surface-400">vs mes anterior</span>
              </div>
            </template>
          </Card>

          <!-- Ocupación -->
          <Card class="bg-surface-base shadow-[var(--tenant-glow)] border border-surface-subtle !rounded-xl">
            <template #content>
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm font-semibold text-surface-muted mb-1">Ocupación Global</p>
                  <p class="text-3xl font-display font-bold text-surface-900">
                    {{ dashboardStore.metrics.occupancyRate }}%
                  </p>
                </div>
                <div class="p-2 bg-surface-alt rounded-lg text-primary-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
              </div>
              <div class="mt-4">
                <div class="w-full bg-surface-200 rounded-full h-1.5">
                  <div class="bg-primary-600 h-1.5 rounded-full" :style="{ width: `${dashboardStore.metrics.occupancyRate}%` }"></div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Cotizaciones Activas -->
          <Card class="bg-surface-base shadow-[var(--tenant-glow)] border border-surface-subtle !rounded-xl">
            <template #content>
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm font-semibold text-surface-muted mb-1">Cotizaciones Activas</p>
                  <p class="text-3xl font-display font-bold text-surface-900">
                    {{ dashboardStore.metrics.activeQuotes }}
                  </p>
                </div>
                <div class="p-2 bg-surface-alt rounded-lg text-primary-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
              </div>
              <div class="mt-4 flex items-center text-sm">
                <span :class="dashboardStore.metrics.quotesGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'" class="font-medium flex items-center">
                  <svg v-if="dashboardStore.metrics.quotesGrowth >= 0" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                  {{ Math.abs(dashboardStore.metrics.quotesGrowth) }}%
                </span>
                <span class="ml-2 text-surface-400">vs mes anterior</span>
              </div>
            </template>
          </Card>

          <!-- Firmas Pendientes -->
          <Card class="bg-surface-base shadow-[var(--tenant-glow)] border border-surface-subtle !rounded-xl">
            <template #content>
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm font-semibold text-surface-muted mb-1">Firmas Pendientes</p>
                  <p class="text-3xl font-display font-bold text-surface-900">
                    {{ dashboardStore.metrics.pendingSignatures }}
                  </p>
                </div>
                <div class="p-2 bg-surface-alt rounded-lg text-primary-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </div>
              </div>
              <div class="mt-4">
                <button class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Gestionar contratos &rarr;
                </button>
              </div>
            </template>
          </Card>
        </div>
      </section>

      <!-- Actividad Reciente y Pipeline -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Actividad Reciente -->
        <Card class="lg:col-span-2 bg-surface-base shadow-[var(--tenant-glow)] border border-surface-subtle !rounded-xl">
          <template #title>
            <div class="text-lg font-display font-bold text-surface-900 border-b border-surface-subtle pb-4">Actividad Reciente</div>
          </template>
          <template #content>
            <div class="divide-y divide-surface-subtle mt-2">
              <div v-for="activity in dashboardStore.metrics.recentActivity" :key="activity.id" class="py-4 flex items-center justify-between hover:bg-surface-hover transition-colors rounded-lg px-2 -mx-2">
                <div class="flex items-center gap-4">
                  <div :class="[
                    'p-2 rounded-full',
                    activity.type === 'CONTRACT' ? 'bg-blue-50 text-blue-600' :
                    activity.type === 'QUOTE' ? 'bg-purple-50 text-purple-600' :
                    'bg-emerald-50 text-emerald-600'
                  ]">
                    <svg v-if="activity.type === 'CONTRACT'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    <svg v-else-if="activity.type === 'QUOTE'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <div>
                    <p class="font-semibold text-surface-900 text-sm">{{ activity.title }}</p>
                    <p class="text-xs text-surface-500 mt-0.5">{{ formatDate(activity.date) }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p v-if="activity.amount" class="font-medium text-surface-900 text-sm">{{ formatCurrency(activity.amount) }}</p>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1" :class="getStatusBadgeClass(activity.status)">
                    {{ activity.status }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Pipeline Comercial -->
        <Card class="bg-surface-base shadow-[var(--tenant-glow)] border border-surface-subtle !rounded-xl">
          <template #title>
            <div class="text-lg font-display font-bold text-surface-900 border-b border-surface-subtle pb-4">Conversión (MTD)</div>
          </template>
          <template #content>
            <div class="mt-6 flex flex-col gap-6">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium text-surface-600">Leads Generados</span>
                  <span class="font-bold text-surface-900">124</span>
                </div>
                <div class="w-full bg-surface-200 rounded-full h-2">
                  <div class="bg-primary-300 h-2 rounded-full" style="width: 100%"></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium text-surface-600">Cotizaciones Enviadas</span>
                  <span class="font-bold text-surface-900">89</span>
                </div>
                <div class="w-full bg-surface-200 rounded-full h-2">
                  <div class="bg-primary-400 h-2 rounded-full" style="width: 72%"></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium text-surface-600">Contratos Cerrados</span>
                  <span class="font-bold text-surface-900">32</span>
                </div>
                <div class="w-full bg-surface-200 rounded-full h-2">
                  <div class="bg-primary-600 h-2 rounded-full" style="width: 25%"></div>
                </div>
              </div>

              <div class="mt-4 p-4 bg-surface-alt rounded-lg flex items-center justify-between border border-surface-subtle">
                <span class="text-sm font-semibold text-surface-600">Tasa de Conversión</span>
                <span class="text-xl font-bold text-primary-600">25.8%</span>
              </div>
            </div>
          </template>
        </Card>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePermissionsStore } from '../stores/permissionsStore';
import { useDashboardStore } from '../stores/dashboardStore';
import Card from 'primevue/card';
import Button from 'primevue/button';

const permissionsStore = usePermissionsStore();
const dashboardStore = useDashboardStore();

onMounted(() => {
  dashboardStore.fetchDashboardMetrics();
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-MX', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'SIGNED':
    case 'PAID':
    case 'APPROVED':
      return 'bg-emerald-100 text-emerald-800';
    case 'PENDING':
      return 'bg-amber-100 text-amber-800';
    case 'REJECTED':
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-surface-200 text-surface-700';
  }
};
</script>
