<template>
  <div class="p-6 max-w-7xl mx-auto flex flex-col gap-6 w-full">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 m-0">Cartas Convenio y Acuerdos</h1>
        <p class="text-slate-500 m-0 mt-1 text-sm">Gestin de anexos y acuerdos suplementarios</p>
      </div>
      <Button v-if="permissionsStore.can('agreements.create')" label="Nuevo Acuerdo" icon="pi pi-plus" class="p-button-primary" />
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <DataTable 
        :value="agreements" 
        :paginator="true" 
        :rows="10" 
        dataKey="id" 
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['id', 'contractId', 'clientName', 'type']"
        emptyMessage="No se encontraron acuerdos."
        class="p-datatable-sm"
      >
        <template #header>
          <div class="flex justify-end mb-3">
            <span class="p-input-icon-left w-full sm:w-auto">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Buscar por ID, Tipo..." class="w-full sm:w-80" />
            </span>
          </div>
        </template>
        
        <Column field="id" header="ID Acuerdo" sortable>
          <template #body="{ data }">
            <span class="font-mono text-primary-600 font-semibold">{{ data.id }}</span>
          </template>
        </Column>

        <Column field="contractId" header="Contrato Base" sortable>
          <template #body="{ data }">
            <span class="font-mono text-slate-500">{{ data.contractId }}</span>
          </template>
        </Column>
        
        <Column field="clientName" header="Cliente" sortable>
          <template #body="{ data }">
            <span class="font-semibold text-slate-900">{{ data.clientName }}</span>
          </template>
        </Column>

        <Column field="type" header="Tipo de Acuerdo" sortable></Column>
        
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
              title="Ver Expediente de Acuerdo"
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

const agreements = ref([
  { id: 'AGR-001', contractId: 'CTR-001', clientName: 'Empresa A', type: 'Carta de Confidencialidad', status: 'FIRMADO' },
  { id: 'AGR-002', contractId: 'CTR-002', clientName: 'Mara Garca', type: 'Adendum de Pagos', status: 'BORRADOR' },
]);

const getStatusSeverity = (status: string) => {
  if (status === 'FIRMADO') return 'success';
  if (status === 'BORRADOR') return 'warning';
  if (status === 'EN_REVISION') return 'info';
  return 'secondary';
};

const goToDossier = (id: string) => {
  router.push(`/legal/agreements/${id}`);
};
</script>
