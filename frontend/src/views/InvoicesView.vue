<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-surface-200 dark:border-surface-800 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">FacturaciÃ³n (Invoices)</h1>
        <p class="text-sm text-surface-500">GestiÃ³n de facturas y cuentas por cobrar</p>
      </div>
      <Button v-if="permissionsStore.can('invoices.create')" label="Generar Factura" icon="pi pi-file-plus" class="p-button-primary" @click="openNew" />
    </div>

    <!-- Data Table Container -->
    <div class="bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden">
      <DataTable 
        :value="invoices" 
        :loading="loading" 
        scrollable
        scrollHeight="600px"
        :virtualScrollerOptions="{ itemSize: 46 }"
        dataKey="id" 
        v-model:filters="filters" 
        filterDisplay="menu"
        emptyMessage="No hay facturas registradas."
        class="p-datatable-sm"
      >
        <template #header>
          <div class="flex justify-between items-center bg-surface-50 dark:bg-surface-900/50 p-2">
            <span class="p-input-icon-left w-full max-w-sm">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Buscar factura..." class="w-full" />
            </span>
          </div>
        </template>

        <Column field="folio" header="Folio" sortable>
          <template #body="slotProps">
            <span class="font-mono text-primary-600 font-medium">#{{ slotProps.data.folio || slotProps.data.id }}</span>
          </template>
        </Column>

        <Column field="contrato_id" header="Contrato" sortable>
          <template #body="slotProps">
            <span class="font-mono text-surface-500">#{{ slotProps.data.contrato_id }}</span>
          </template>
        </Column>

        <Column field="cliente_nombre" header="Cliente" sortable>
          <template #body="slotProps">
            <span class="font-medium text-surface-900 dark:text-surface-50">{{ slotProps.data.cliente_nombre }}</span>
          </template>
        </Column>

        <Column field="status" header="Estado" sortable>
          <template #body="slotProps">
            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" rounded />
          </template>
        </Column>

        <Column field="total" header="Total" sortable>
          <template #body="slotProps">
            <span class="font-bold text-surface-900 dark:text-surface-50">{{ formatCurrency(slotProps.data.total) }}</span>
          </template>
        </Column>

        <Column header="" :exportable="false" style="min-width:8rem">
          <template #body="slotProps">
            <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-primary" aria-label="Ver detalle" @click="viewDossier(slotProps.data)" />
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
import Tag from 'primevue/tag';
import { useTenantStore } from '../stores/tenant';

const permissionsStore = usePermissionsStore();
const tenantStore = useTenantStore();
const router = useRouter();

const invoices = ref<any[]>([]);
const loading = ref(true);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const getStatusSeverity = (status: string) => {
  if (!status) return 'info';
  switch (status.toUpperCase()) {
    case 'PAGADA': return 'success';
    case 'PENDIENTE': return 'warn';
    case 'VENCIDA': return 'danger';
    case 'CANCELADA': return 'secondary';
    default: return 'info';
  }
};

const formatCurrency = (value: number) => {
  if (!value) return '$0.00';
  return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

const fetchInvoices = async () => {
  loading.value = true;
  try {
    const records = await pb.collection('facturas').getFullList({
      sort: '-created',
      filter: tenantStore.activeTenant?.id ? `tenant = "${tenantStore.activeTenant.id}"` : ''
    });
    invoices.value = records;
  } catch (err) {
    console.warn('Error fetching invoices, possibly collection does not exist yet', err);
    invoices.value = [];
  } finally {
    loading.value = false;
  }
};

const openNew = () => {
  // Logic to generate invoice
};

const viewDossier = (invoice: any) => {
  router.push({ name: 'finance-dossier', params: { id: invoice.id } });
};

onMounted(() => {
  fetchInvoices();
});
</script>

