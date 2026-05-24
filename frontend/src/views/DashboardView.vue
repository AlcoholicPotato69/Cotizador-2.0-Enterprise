<template>
  <div class="space-y-6">
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-surface-200 dark:border-surface-800 gap-4">
      <div class="flex items-center gap-4">
        <!-- Tenant Branding Badge if any -->
        <div v-if="branding?.logo_url" class="h-10 w-10 rounded-md bg-surface-100 dark:bg-surface-800 flex items-center justify-center overflow-hidden">
          <img :src="branding.logo_url" alt="Tenant" class="h-full object-cover" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">Expediente Central</h1>
          <p class="text-sm text-surface-500">Resumen general y métricas operativas</p>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="flex flex-wrap gap-2">
        <button v-if="permissionsStore.can('clients.read')" class="inline-flex items-center px-3 py-2 border border-surface-300 dark:border-surface-700 shadow-sm text-sm font-medium rounded-md text-surface-700 dark:text-surface-200 bg-surface-0 dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Clientes
        </button>
        <button v-if="permissionsStore.can('quotes.read')" class="inline-flex items-center px-3 py-2 border border-surface-300 dark:border-surface-700 shadow-sm text-sm font-medium rounded-md text-surface-700 dark:text-surface-200 bg-surface-0 dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Cotizaciones
        </button>
        <button v-if="permissionsStore.can('contracts.read')" class="inline-flex items-center px-3 py-2 border border-surface-300 dark:border-surface-700 shadow-sm text-sm font-medium rounded-md text-surface-700 dark:text-surface-200 bg-surface-0 dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          Contratos
        </button>
      </div>
    </header>

    <!-- Role Based Tabs (If user has multiple roles) -->
    <div class="border-b border-surface-200 dark:border-surface-800" v-if="hasExecutive && hasOperative">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs del Dashboard" role="tablist">
        <button 
          @click="activeTab = 'executive'"
          id="tab-executive"
          role="tab"
          :aria-selected="activeTab === 'executive'"
          aria-controls="panel-executive"
          :class="[activeTab === 'executive' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300 dark:hover:text-surface-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500']"
        >
          Resumen Ejecutivo
        </button>
        <button 
          @click="activeTab = 'operative'"
          id="tab-operative"
          role="tab"
          :aria-selected="activeTab === 'operative'"
          aria-controls="panel-operative"
          :class="[activeTab === 'operative' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300 dark:hover:text-surface-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500']"
        >
          Vista Operativa
        </button>
      </nav>
    </div>

    <!-- Dashboards Rendering -->
    <div class="mt-6">
      <div id="panel-executive" role="tabpanel" aria-labelledby="tab-executive" v-if="showExecutive" tabindex="0" class="focus:outline-none focus:ring-2 focus:ring-primary-500">
        <ExecutiveDashboard :data="executiveData" />
      </div>
      <div id="panel-operative" role="tabpanel" aria-labelledby="tab-operative" v-if="showOperative" tabindex="0" class="focus:outline-none focus:ring-2 focus:ring-primary-500">
        <OperativeDashboard :data="operativeData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePermissionsStore } from '../../stores/permissionsStore';
import ExecutiveDashboard from './dashboard/ExecutiveDashboard.vue';
import OperativeDashboard from './dashboard/OperativeDashboard.vue';

const permissionsStore = usePermissionsStore();

// Dumb UI: State is fetched/provided from API, frontend just displays.
const branding = ref({
  logo_url: '' 
});

const activeTab = ref<'executive' | 'operative'>('executive');

// Logic for showing dashboards based on permissions
const hasExecutive = computed(() => permissionsStore.can('dashboard.executive'));
const hasOperative = computed(() => permissionsStore.can('dashboard.operative'));

// Default logic: If they have both, show tab. Otherwise show what they have.
const showExecutive = computed(() => hasExecutive.value && (!hasOperative.value || activeTab.value === 'executive'));
const showOperative = computed(() => hasOperative.value && (!hasExecutive.value || activeTab.value === 'operative'));

// Mocks passed to children. These would be populated from a store or API
const executiveData = ref({
  mtdRevenue: '$1,245,000.00',
  mtdGrowth: 14,
  occupancyRate: 78,
  pipelineValue: '$3,450,000.00',
  activeQuotesCount: 45,
  closedContractsCount: 12,
  monthlyGoal: 15
});

const operativeData = ref({
  pendingVerifications: 12,
  expiringQuotes: 7,
  pendingSignatures: 3,
  upcomingEvents: [
    { id: 1, name: 'Boda M&M', clientName: 'María García', spaceName: 'Salón Diamante', dateFormatted: '25 May 2026', status: 'CONFIRMED' },
    { id: 2, name: 'Convención Anual Tech', clientName: 'Empresa S.A.', spaceName: 'Salón Zafiro', dateFormatted: '28 May 2026', status: 'TENTATIVE' }
  ]
});

onMounted(() => {
  // Set default tab if they only have one
  if (hasOperative.value && !hasExecutive.value) {
    activeTab.value = 'operative';
  }
});
</script>
