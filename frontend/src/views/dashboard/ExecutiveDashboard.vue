<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Ingresos MTD -->
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between h-full">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-surface-500 uppercase tracking-wider">Ingresos MTD</h3>
          <div class="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
            <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
        <div>
          <div class="text-3xl font-bold text-surface-900 dark:text-surface-50">{{ data?.mtdRevenue || '$0.00' }}</div>
          <div class="mt-2 flex items-center text-sm">
            <span :class="data?.mtdGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="font-medium flex items-center">
              <svg v-if="data?.mtdGrowth >= 0" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
              {{ data?.mtdGrowth || '0' }}%
            </span>
            <span class="ml-2 text-surface-500">vs mes anterior</span>
          </div>
        </div>
      </div>

      <!-- Ocupación Global -->
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between h-full">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-surface-500 uppercase tracking-wider">Ocupación Global</h3>
          <div class="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
            <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
        </div>
        <div>
          <div class="text-3xl font-bold text-surface-900 dark:text-surface-50">{{ data?.occupancyRate || '0' }}%</div>
          <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5 mt-3">
            <div class="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full" :style="{ width: `${data?.occupancyRate || 0}%` }"></div>
          </div>
        </div>
      </div>

      <!-- Pipeline Comercial -->
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between h-full">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-surface-500 uppercase tracking-wider">Pipeline (Cotizaciones)</h3>
          <div class="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
            <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
        </div>
        <div>
          <div class="text-3xl font-bold text-surface-900 dark:text-surface-50">{{ data?.pipelineValue || '$0.00' }}</div>
          <div class="mt-2 text-sm text-surface-500">
            En {{ data?.activeQuotesCount || 0 }} cotizaciones activas
          </div>
        </div>
      </div>

      <!-- Contratos Cerrados -->
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between h-full">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-surface-500 uppercase tracking-wider">Contratos Cerrados</h3>
          <div class="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
            <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
        <div>
          <div class="text-3xl font-bold text-surface-900 dark:text-surface-50">{{ data?.closedContractsCount || 0 }}</div>
          <div class="mt-2 text-sm text-surface-500">
            Este mes (Meta: {{ data?.monthlyGoal || 0 }})
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Charts or Tables Area -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm h-96 flex items-center justify-center">
        <span class="text-surface-400 dark:text-surface-600">Revenue Chart Placeholder</span>
      </div>
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm h-96 flex items-center justify-center">
        <span class="text-surface-400 dark:text-surface-600">Occupancy by Space Placeholder</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Dumb UI: All data structure comes from parent or API. 
// We define props or local mocked state for demonstration of structure.
const props = defineProps<{
  data?: any;
}>();
</script>
