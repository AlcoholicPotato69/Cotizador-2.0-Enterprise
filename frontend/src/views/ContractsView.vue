<template>
  <div class="p-6 max-w-7xl mx-auto flex flex-col gap-6 w-full">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 m-0">Gestin de Contratos</h1>
        <p class="text-slate-500 m-0 mt-1 text-sm">Flujos legales, reglamentos y firma de contratos</p>
      </div>
      <Button v-if="permissionsStore.can('contracts.create')" label="Nuevo Contrato" icon="pi pi-plus" class="p-button-primary" />
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <DataTable 
        :value="contracts" 
        :paginator="true" 
        :rows="10" 
        dataKey="id" 
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['id', 'clientName', 'quoteId']"
        emptyMessage="No se encontraron contratos."
        class="p-datatable-sm"
      >
        <template #header>
          <div class="flex justify-end mb-3">
            <span class="p-input-icon-left w-full sm:w-auto">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Buscar por ID, Cliente..." class="w-full sm:w-80" />
            </span>
          </div>
        </template>
        
        <Column field="id" header="Folio" sortable>
          <template #body="{ data }">
            <span class="font-mono text-primary-600 font-semibold">{{ data.id }}</span>
          </template>
        </Column>

        <Column field="quoteId" header="Cotizacin" sortable>
          <template #body="{ data }">
            <span class="font-mono text-slate-500">{{ data.quoteId }}</span>
          </template>
        </Column>
        
        <Column field="clientName" header="Cliente" sortable>
          <template #body="{ data }">
            <span class="font-semibold text-slate-900">{{ data.clientName }}</span>
          </template>
        </Column>

        <Column field="amount" header="Monto" sortable>
          <template #body="{ data }">
            <span class="text-slate-900">{{ formatCurrency(data.amount) }}</span>
          </template>
        </Column>
        
        <Column field="status" header="Estado" sortable>
          <template #body="{ data }">
            <Tag 
              :severity="getStatusSeverity(data.status)" 
              :value="data.status" 
            />
          </template>
        </Column>

        <Column header="Acciones" :exportable="false" style="min-width:8rem">
          <template #body="{ data }">
            <Button 
              icon="pi pi-folder-open" 
              class="p-button-rounded p-button-text p-button-secondary" 
              title="Ver Expediente"
              @click="goToDossier(data.id)" 
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { FilterMatchMode } from '@primevue/core/api';
import { usePermissionsStore } from '../stores/permissionsStore';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const router = useRouter();
const permissionsStore = usePermissionsStore();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const contracts = ref([
  { id: 'CTR-001', quoteId: 'QT-001', clientName: 'Empresa A', amount: 150000, status: 'FIRMADO' },
  { id: 'CTR-002', quoteId: 'QT-002', clientName: 'Mara Garca', amount: 45000, status: 'BORRADOR' },
  { id: 'CTR-003', quoteId: 'QT-005', clientName: 'Juan Prez', amount: 80000, status: 'EN_REVISION' }
]);

const getStatusSeverity = (status: string) => {
  if (status === 'FIRMADO') return 'success';
  if (status === 'BORRADOR') return 'warning';
  if (status === 'EN_REVISION') return 'info';
  return 'secondary';
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);
};

const goToDossier = (id: string) => {
  router.push(`/legal/contracts/${id}`);
};
</script>
