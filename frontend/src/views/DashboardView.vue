<template>
  <div class="h-full flex flex-col space-y-6">
    <!-- Header Command Center -->
    <header class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-900 to-surface-800 dark:from-surface-950 dark:to-surface-900 p-8 shadow-2xl shadow-surface-900/20 text-white flex-shrink-0">
      <!-- Decorative Glass Overlay -->
      <div class="absolute inset-0 bg-surface-0/5 backdrop-blur-[2px] pointer-events-none"></div>
      <!-- Background Shapes -->
      <div class="absolute -right-20 -top-20 w-64 h-64 bg-primary-500/20 blur-3xl rounded-full pointer-events-none"></div>
      <div class="absolute right-40 -bottom-20 w-48 h-48 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-0/10 border border-white/10 text-xs font-semibold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Sistema Operativo
          </div>
          <h1 class="text-4xl md:text-5xl font-display font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Command Center
          </h1>
          <p class="text-surface-300 mt-2 font-medium text-sm md:text-base max-w-xl">
            Visión global del flujo comercial. Monitorea cotizaciones, gestiona contratos y analiza los ingresos en tiempo real.
          </p>
        </div>
        
        <!-- Quick Actions -->
        <div class="flex items-center gap-3">
          <DsButton 
            v-if="permissionsStore.can('quotes.create')"
            icon="pi pi-plus" 
            label="Nueva Cotización" 
            class="!bg-primary-500 !hover:bg-primary-400 !text-white !border-none !shadow-[0_0_20px_rgba(var(--primary-500),0.3)] !px-5 !py-3 !rounded-xl !font-bold transition-all duration-300 hover:scale-105"
            @click="router.push('/quotes/creator')"
          />
        </div>
      </div>
    </header>

    <!-- Main Grid -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-y-auto custom-scroll pr-1">
      
      <!-- Left Column: Metrics & Pipeline (Span 8) -->
      <div class="lg:col-span-8 space-y-6 flex flex-col">
        
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Revenue -->
          <div class="group relative bg-surface-0 dark:bg-surface-800 p-6 rounded-3xl border border-surface-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative z-10 flex justify-between items-start">
              <div>
                <p class="text-[11px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-1">Ingresos MTD</p>
                <p class="text-3xl font-display font-black text-surface-900 dark:text-white tracking-tight">
                  {{ formatCurrency(dashboardStore.metrics.totalRevenue) }}
                </p>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <i class="pi pi-wallet text-xl"></i>
              </div>
            </div>
            <div class="relative z-10 mt-4 flex items-center text-xs font-semibold">
              <span :class="dashboardStore.metrics.revenueGrowth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'" class="flex items-center">
                <i :class="dashboardStore.metrics.revenueGrowth >= 0 ? 'pi pi-arrow-up-right' : 'pi pi-arrow-down-right'" class="mr-1 text-[10px]"></i>
                {{ Math.abs(dashboardStore.metrics.revenueGrowth) }}%
              </span>
              <span class="ml-2 text-surface-400">vs mes anterior</span>
            </div>
          </div>

          <!-- Active Quotes -->
          <div class="group relative bg-surface-0 dark:bg-surface-800 p-6 rounded-3xl border border-surface-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative z-10 flex justify-between items-start">
              <div>
                <p class="text-[11px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-1">Cotizaciones Activas</p>
                <p class="text-3xl font-display font-black text-surface-900 dark:text-white tracking-tight">
                  {{ dashboardStore.metrics.activeQuotes }}
                </p>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <i class="pi pi-file-edit text-xl"></i>
              </div>
            </div>
            <div class="relative z-10 mt-4 flex items-center text-xs font-semibold">
              <span :class="dashboardStore.metrics.quotesGrowth >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'" class="flex items-center">
                <i :class="dashboardStore.metrics.quotesGrowth >= 0 ? 'pi pi-arrow-up-right' : 'pi pi-arrow-down-right'" class="mr-1 text-[10px]"></i>
                {{ Math.abs(dashboardStore.metrics.quotesGrowth) }}%
              </span>
              <span class="ml-2 text-surface-400">tendencia actual</span>
            </div>
          </div>

          <!-- Occupancy -->
          <div class="group relative bg-surface-0 dark:bg-surface-800 p-6 rounded-3xl border border-surface-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative z-10 flex justify-between items-start">
              <div>
                <p class="text-[11px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-1">Ocupación Global</p>
                <p class="text-3xl font-display font-black text-surface-900 dark:text-white tracking-tight">
                  {{ dashboardStore.metrics.occupancyRate }}%
                </p>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <i class="pi pi-chart-pie text-xl"></i>
              </div>
            </div>
            <div class="relative z-10 mt-4">
               <div class="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-2 overflow-hidden">
                  <div class="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all duration-1000" :style="{ width: `${dashboardStore.metrics.occupancyRate}%` }"></div>
               </div>
            </div>
          </div>
        </div>

        <!-- Conversion Pipeline -->
        <div class="bg-surface-0 dark:bg-surface-800 rounded-3xl border border-surface-200 dark:border-white/5 shadow-sm p-6 flex-1 flex flex-col">
          <div class="flex justify-between items-center mb-6">
            <h2 class="font-display font-bold text-lg text-surface-900 dark:text-white">Pipeline de Conversión</h2>
            <button class="text-primary-600 hover:text-primary-500 font-semibold text-xs tracking-wide uppercase transition-colors">
              Ver Análisis &rarr;
            </button>
          </div>
          <div class="flex-1 flex flex-col justify-center gap-8">
            <div class="relative group">
              <div class="flex justify-between text-sm mb-2 font-semibold">
                <span class="text-surface-500 flex items-center gap-2"><i class="pi pi-users text-surface-400"></i> Leads Generados</span>
                <span class="text-surface-900 dark:text-white font-display text-lg">{{ dashboardStore.metrics.pipeline?.leads || 0 }}</span>
              </div>
              <div class="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-3 overflow-hidden shadow-inner">
                <div class="bg-surface-400 dark:bg-surface-500 h-full rounded-full w-full"></div>
              </div>
            </div>
            
            <div class="relative group">
              <div class="flex justify-between text-sm mb-2 font-semibold">
                <span class="text-surface-500 flex items-center gap-2"><i class="pi pi-file-o text-surface-400"></i> Cotizaciones Enviadas</span>
                <span class="text-surface-900 dark:text-white font-display text-lg">{{ dashboardStore.metrics.pipeline?.quotes || 0 }}</span>
              </div>
              <div class="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-3 overflow-hidden shadow-inner">
                <div class="bg-blue-400 h-full rounded-full transition-all duration-1000" :style="{ width: `${((dashboardStore.metrics.pipeline?.quotes || 0) / (dashboardStore.metrics.pipeline?.leads || 1)) * 100}%` }"></div>
              </div>
            </div>

            <div class="relative group">
              <div class="flex justify-between text-sm mb-2 font-semibold">
                <span class="text-surface-500 flex items-center gap-2"><i class="pi pi-check-circle text-surface-400"></i> Negocios Cerrados</span>
                <span class="text-surface-900 dark:text-white font-display text-lg">{{ dashboardStore.metrics.pipeline?.contracts || 0 }}</span>
              </div>
              <div class="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-3 overflow-hidden shadow-inner">
                <div class="bg-emerald-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(52,211,153,0.5)]" :style="{ width: `${((dashboardStore.metrics.pipeline?.contracts || 0) / (dashboardStore.metrics.pipeline?.leads || 1)) * 100}%` }"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column: Recent Activity (Span 4) -->
      <div class="lg:col-span-4 bg-surface-0 dark:bg-surface-800 rounded-3xl border border-surface-200 dark:border-white/5 shadow-sm p-6 flex flex-col h-full overflow-hidden relative">
        <div class="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface-0 dark:from-surface-800 to-transparent z-10 pointer-events-none"></div>
        <div class="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface-0 dark:from-surface-800 to-transparent z-10 pointer-events-none"></div>
        
        <div class="flex justify-between items-center mb-6 relative z-20">
          <h2 class="font-display font-bold text-lg text-surface-900 dark:text-white">Log Operativo</h2>
          <span class="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 rounded-lg text-[10px] font-bold tracking-widest uppercase">En vivo</span>
        </div>

        <div class="flex-1 overflow-y-auto custom-scroll pr-2 relative z-0 pb-4">
          <div class="space-y-4">
            <div v-for="activity in dashboardStore.metrics.recentActivity" :key="activity.id" class="group p-4 rounded-2xl bg-surface-50 dark:bg-surface-900/50 border border-transparent hover:border-surface-200 dark:hover:border-white/5 transition-all duration-300 hover:shadow-md relative overflow-hidden">
              <div class="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                :class="{
                  'bg-emerald-500': activity.type === 'CONTRACT',
                  'bg-blue-500': activity.type === 'QUOTE',
                  'bg-primary-500': activity.type === 'PAYMENT'
                }"
              ></div>
              <div class="flex items-start gap-3">
                <div :class="[
                  'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                  activity.type === 'CONTRACT' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                  activity.type === 'QUOTE' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                  'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                ]">
                  <i v-if="activity.type === 'CONTRACT'" class="pi pi-file-edit text-sm"></i>
                  <i v-else-if="activity.type === 'QUOTE'" class="pi pi-file-o text-sm"></i>
                  <i v-else class="pi pi-dollar text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-surface-900 dark:text-white text-sm truncate">{{ activity.title }}</p>
                  <p class="text-xs text-surface-500 mt-1 font-medium">{{ formatDate(activity.date) }}</p>
                </div>
                <div class="text-right shrink-0">
                  <p v-if="activity.amount" class="font-display font-bold text-surface-900 dark:text-white text-sm">{{ formatCurrency(activity.amount) }}</p>
                  <div class="mt-1">
                     <span class="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider" :class="getStatusBadgeClass(activity.status)">
                       {{ activity.status }}
                     </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="!dashboardStore.metrics.recentActivity?.length" class="text-center py-10">
              <i class="pi pi-inbox text-4xl text-surface-300 dark:text-surface-600 mb-3 block"></i>
              <p class="text-surface-500 font-medium text-sm">No hay actividad reciente registrada en este tenant.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDashboardStore } from '../stores/dashboardStore';
import { usePermissionsStore } from '../stores/permissionsStore';

const router = useRouter();
const dashboardStore = useDashboardStore();
const permissionsStore = usePermissionsStore();

onMounted(async () => {
  await dashboardStore.fetchDashboardMetrics();
});

const formatCurrency = (value: number | undefined) => {
  if (value === undefined) return '$0.00';
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-MX', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getStatusBadgeClass = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'APPROVED':
    case 'SIGNED':
    case 'COMPLETED':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300';
    case 'PENDING':
    case 'DRAFT':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300';
    case 'REJECTED':
    case 'CANCELLED':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300';
    default:
      return 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-300';
  }
};
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: var(--surface-300);
  border-radius: 10px;
}
.dark .custom-scroll::-webkit-scrollbar-thumb {
  background: var(--surface-700);
}
</style>

