<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-surface-200 dark:border-surface-800 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">Pagos (Payments)</h1>
        <p class="text-sm text-surface-500">Registro de cobros y conciliación</p>
      </div>
      <button v-if="permissionsStore.can('payments.create')" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        Registrar Pago
      </button>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm">
        <h3 class="text-sm font-medium text-surface-500 uppercase">Total Recaudado (Mes)</h3>
        <div class="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-50">{{ data?.monthlyCollected || '$0.00' }}</div>
      </div>
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm">
        <h3 class="text-sm font-medium text-surface-500 uppercase">Pagos en Conciliación</h3>
        <div class="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-50">{{ data?.pendingReconciliation || '0' }}</div>
      </div>
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm">
        <h3 class="text-sm font-medium text-surface-500 uppercase">Cartera Vencida</h3>
        <div class="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">{{ data?.overdueAmount || '$0.00' }}</div>
      </div>
    </div>

    <!-- Data Table Container -->
    <div class="bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden">
      <!-- Search / Filter -->
      <div class="p-4 border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50 flex justify-between items-center">
        <div class="relative rounded-md shadow-sm max-w-sm w-full">
          <label for="search-payments" class="sr-only">Buscar pago</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input type="text" id="search-payments" aria-label="Buscar pago" class="focus:ring-2 focus:ring-primary-500 focus:outline-none block w-full pl-10 sm:text-sm border-surface-300 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-50 rounded-md" placeholder="Buscar pago...">
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-surface-200 dark:divide-surface-800" role="grid">
          <thead class="bg-surface-50 dark:bg-surface-900/50">
            <tr role="row">
              <th scope="col" role="columnheader" class="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">ID Pago</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Factura Asociada</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Fecha</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Método</th>
              <th scope="col" role="columnheader" class="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Monto</th>
              <th scope="col" role="columnheader" class="relative px-6 py-3"><span class="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody class="bg-surface-0 dark:bg-surface-900 divide-y divide-surface-200 dark:divide-surface-800">
            <tr v-for="payment in payments" :key="payment.id" role="row" class="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <td role="gridcell" class="px-6 py-4 whitespace-nowrap text-sm font-mono text-surface-500">
                <button class="text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1">#{{ payment.id }}</button>
              </td>
              <td role="gridcell" class="px-6 py-4 whitespace-nowrap text-sm font-mono text-primary-600">
                <button class="hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1">#{{ payment.invoiceId }}</button>
              </td>
              <td role="gridcell" class="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-surface-50">{{ payment.date }}</td>
              <td role="gridcell" class="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-surface-50">{{ payment.method }}</td>
              <td role="gridcell" class="px-6 py-4 whitespace-nowrap text-sm font-bold text-success-600 dark:text-success-400">{{ payment.amount }}</td>
              <td role="gridcell" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button aria-label="Ver detalles del pago" class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1">Detalles</button>
              </td>
            </tr>
            <tr v-if="!payments.length" role="row">
              <td role="gridcell" colspan="6" class="px-6 py-8 text-center text-surface-500 text-sm">No hay pagos registrados.</td>
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

// Dumb UI:
const data = ref({
  monthlyCollected: '$350,000.00',
  pendingReconciliation: 3,
  overdueAmount: '$12,500.00'
});

const payments = ref([
  { id: 'PAY-001', invoiceId: 'INV-001', date: '2026-05-20', method: 'Transferencia (SPEI)', amount: '$150,000.00' },
  { id: 'PAY-002', invoiceId: 'INV-002', date: '2026-05-22', method: 'Tarjeta de Crédito', amount: '$42,500.00' }
]);

onMounted(() => {
  // Fetch from API
});
</script>
