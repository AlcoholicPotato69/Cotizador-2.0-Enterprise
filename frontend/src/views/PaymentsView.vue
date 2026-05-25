<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-surface-200 dark:border-surface-800 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">Pagos (Payments)</h1>
        <p class="text-sm text-surface-500">Registro de cobros y conciliaciÃ³n</p>
      </div>
      <Button v-if="permissionsStore.can('payments.create')" label="Registrar Pago" icon="pi pi-money-bill" class="p-button-primary" @click="openNew" />
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between">
        <h3 class="text-sm font-medium text-surface-500 uppercase tracking-wide">Total Recaudado (Mes)</h3>
        <div class="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-50">{{ formatCurrency(summary.monthlyCollected) }}</div>
      </div>
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between">
        <h3 class="text-sm font-medium text-surface-500 uppercase tracking-wide">Pagos en ConciliaciÃ³n</h3>
        <div class="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-50">{{ summary.pendingReconciliation }}</div>
      </div>
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between">
        <h3 class="text-sm font-medium text-surface-500 uppercase tracking-wide">Cartera Vencida</h3>
        <div class="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">{{ formatCurrency(summary.overdueAmount) }}</div>
      </div>
    </div>

    <!-- Data Table Container -->
    <div class="bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden">
      <DataTable 
        :value="payments" 
        :loading="loading" 
        :paginator="true" 
        :rows="10" 
        dataKey="id" 
        v-model:filters="filters" 
        filterDisplay="menu"
        responsiveLayout="scroll"
        emptyMessage="No hay pagos registrados."
        class="p-datatable-sm"
      >
        <template #header>
          <div class="flex justify-between items-center bg-surface-50 dark:bg-surface-900/50 p-2">
            <span class="p-input-icon-left w-full max-w-sm">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Buscar pago..." class="w-full" />
            </span>
          </div>
        </template>

        <Column field="folio" header="ID Pago" sortable>
          <template #body="slotProps">
            <span class="font-mono text-surface-500 font-medium">#{{ slotProps.data.folio || slotProps.data.id }}</span>
          </template>
        </Column>

        <Column field="factura_id" header="Factura Asociada" sortable>
          <template #body="slotProps">
            <span class="font-mono text-primary-600 font-medium cursor-pointer hover:underline" @click="viewDossier(slotProps.data)">
              #{{ slotProps.data.factura_id }}
            </span>
          </template>
        </Column>

        <Column field="fecha" header="Fecha" sortable>
          <template #body="slotProps">
            <span class="text-surface-900 dark:text-surface-50">{{ formatDate(slotProps.data.fecha || slotProps.data.created) }}</span>
          </template>
        </Column>

        <Column field="metodo" header="MÃ©todo" sortable>
          <template #body="slotProps">
            <span class="text-surface-900 dark:text-surface-50">{{ slotProps.data.metodo || 'No definido' }}</span>
          </template>
        </Column>

        <Column field="monto" header="Monto" sortable>
          <template #body="slotProps">
            <span class="font-bold text-success-600 dark:text-success-400">{{ formatCurrency(slotProps.data.monto) }}</span>
          </template>
        </Column>

        <Column header="" :exportable="false" style="min-width:8rem">
          <template #body>
            <Button icon="pi pi-list" class="p-button-rounded p-button-text p-button-secondary" aria-label="Detalles" @click="viewDetails()" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePermissionsStore } from '../stores/permissionsStore';
import { pb } from '../services/pb';
import { FilterMatchMode } from '@primevue/core/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useTenantStore } from '../stores/tenant';

const permissionsStore = usePermissionsStore();
const tenantStore = useTenantStore();
const router = useRouter();

const payments = ref<any[]>([]);
const loading = ref(true);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const summary = ref({
  monthlyCollected: 0,
  pendingReconciliation: 0,
  overdueAmount: 0
});

const formatCurrency = (value: number) => {
  if (!value) return '$0.00';
  return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-MX');
};

const fetchPayments = async () => {
  loading.value = true;
  try {
    const records = await pb.collection('pagos').getFullList({
      sort: '-created',
      filter: tenantStore.activeTenant?.id ? `tenant = "${tenantStore.activeTenant.id}"` : ''
    });
    payments.value = records;

    // Optional: Recalculate summary here based on records
    summary.value.monthlyCollected = records.reduce((acc, p) => acc + (p.monto || 0), 0);
  } catch (err) {
    console.warn('Error fetching payments, possibly collection does not exist yet', err);
    payments.value = [];
  } finally {
    loading.value = false;
  }
};

const openNew = () => {
  // Logic to register a payment
};

const viewDetails = () => {
  // Can open a dialog or a new route
};

const viewDossier = (payment: any) => {
  if (payment.factura_id) {
    router.push({ name: 'finance-dossier', params: { id: payment.factura_id } });
  }
};

onMounted(() => {
  fetchPayments();
});
</script>

