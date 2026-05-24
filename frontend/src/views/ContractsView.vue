<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-surface-200 dark:border-surface-800 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">Gestión de Contratos</h1>
        <p class="text-sm text-surface-500">Flujos legales y firma de acuerdos</p>
      </div>
      <button v-if="permissionsStore.can('contracts.create')" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Nuevo Contrato
      </button>
    </div>

    <!-- Data Table Container -->
    <div class="bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden">
      <!-- Search / Filter -->
      <div class="p-4 border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50 flex justify-between items-center">
        <div class="relative rounded-md shadow-sm max-w-sm w-full">
          <label for="search-contracts" class="sr-only">Buscar contrato</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input type="text" id="search-contracts" aria-label="Buscar contrato" class="focus:ring-2 focus:ring-primary-500 focus:outline-none block w-full pl-10 sm:text-sm border-surface-300 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-50 rounded-md" placeholder="Buscar contrato...">
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-surface-200 dark:divide-surface-800" role="grid">
          <thead class="bg-surface-50 dark:bg-surface-900/50">
            <tr role="row">
              <th scope="col" role="columnheader" class="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Folio</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Cotización Origen</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Cliente</th>
              <th scope="col" role="columnheader" class="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Estado</th>
              <th scope="col" role="columnheader" class="relative px-6 py-3"><span class="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody class="bg-surface-0 dark:bg-surface-900 divide-y divide-surface-200 dark:divide-surface-800">
            <tr v-for="contract in contracts" :key="contract.id" role="row" class="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <td role="gridcell" class="px-6 py-4 whitespace-nowrap text-sm font-mono text-surface-500">
                <button class="text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1">#{{ contract.id }}</button>
              </td>
              <td role="gridcell" class="px-6 py-4 whitespace-nowrap text-sm font-mono text-primary-600">
                <button class="hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1">#{{ contract.quoteId }}</button>
              </td>
              <td role="gridcell" class="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-900 dark:text-surface-50">{{ contract.clientName }}</td>
              <td role="gridcell" class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="{
                  'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-100': contract.status === 'FIRMADO',
                  'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-100': contract.status === 'BORRADOR',
                  'bg-info-100 text-info-800 dark:bg-info-900 dark:text-info-100': contract.status === 'EN_REVISION'
                }">
                  {{ contract.status }}
                </span>
              </td>
              <td role="gridcell" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button aria-label="Firmar contrato" class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1">Firmar</button>
              </td>
            </tr>
            <tr v-if="!contracts.length" role="row">
              <td role="gridcell" colspan="5" class="px-6 py-8 text-center text-surface-500 text-sm">No hay contratos registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePermissionsStore } from '../stores/permissionsStore';

const permissionsStore = usePermissionsStore();

// Dumb UI: State fetched from API
const contracts = ref([
  { id: 'CTR-001', quoteId: 'QT-001', clientName: 'Empresa A', status: 'FIRMADO' },
  { id: 'CTR-002', quoteId: 'QT-002', clientName: 'María García', status: 'BORRADOR' }
]);

onMounted(() => {
  // Fetch from API
});
</script>
