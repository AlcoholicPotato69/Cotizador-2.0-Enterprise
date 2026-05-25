<template>
  <div class="p-6 max-w-7xl mx-auto flex flex-col gap-6 w-full">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 m-0">Directorio de Clientes</h1>
        <p class="text-slate-600 m-0 mt-1 text-sm">Gestión de prospectos y clientes de la organización</p>
      </div>
      <Button label="Nuevo Cliente" icon="pi pi-plus" @click="showNewClientDialog = true" class="p-button-primary" />
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <DataTable 
        :value="clientStore.clients" 
        scrollable
        scrollHeight="600px"
        :virtualScrollerOptions="{ itemSize: 46 }"
        dataKey="id" 
        :loading="clientStore.loading"
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['name', 'rfc']"
        emptyMessage="No se encontraron clientes."
        class="p-datatable-sm"
      >
        <template #header>
          <div class="flex justify-end mb-3">
            <span class="p-input-icon-left w-full sm:w-auto">
              <i class="pi pi-search" aria-hidden="true" />
              <InputText v-model="filters['global'].value" placeholder="Buscar por nombre o RFC..." aria-label="Buscar por nombre o RFC" class="w-full sm:w-80" />
            </span>
          </div>
        </template>
        
        <Column field="name" header="Razón Social / Nombre" sortable>
          <template #body="{ data }">
            <span class="font-semibold text-slate-900">{{ data.name }}</span>
          </template>
        </Column>
        
        <Column field="rfc" header="RFC" sortable></Column>

        <Column field="createdAt" header="Fecha de Alta" sortable>
          <template #body="{ data }">
            <span class="text-slate-600">{{ formatDate(data.createdAt) }}</span>
          </template>
        </Column>
        
        <Column field="status" header="Estado" sortable>
          <template #body="{ data }">
            <Tag 
              :severity="getStatusSeverity(data.status)" 
              :value="(data.status || 'pendiente').toUpperCase()" 
            />
          </template>
        </Column>

        <Column header="Acciones" :exportable="false" style="min-width:8rem">
          <template #body="{ data }">
            <Button 
              icon="pi pi-folder-open" 
              class="p-button-rounded p-button-text p-button-secondary" 
              title="Ver Expediente"
              aria-label="Ver Expediente"
              @click="goToDossier(data.id)" 
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="showNewClientDialog" header="Registrar Cliente" :modal="true" class="p-fluid" style="width: 450px">
      <div class="flex flex-col gap-4 mt-4">
        <div class="field">
          <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nombre o Razón Social</label>
          <InputText id="name" v-model.trim="newClient.name" required autofocus />
        </div>
        <div class="field">
          <label for="rfc" class="block text-sm font-medium text-slate-700 mb-1">RFC</label>
          <InputText id="rfc" v-model.trim="newClient.rfc" required />
        </div>
        <div class="field">
          <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Correo (Opcional)</label>
          <InputText id="email" v-model.trim="newClient.email" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showNewClientDialog = false" />
        <Button label="Guardar" icon="pi pi-check" @click="saveClient" :loading="saving" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { FilterMatchMode } from '@primevue/core/api';
import { useClientStore, type ClientFormData } from '../stores/clientStore';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';

const router = useRouter();
const clientStore = useClientStore();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const showNewClientDialog = ref(false);
const saving = ref(false);
const newClient = ref<ClientFormData>({ name: '', rfc: '', email: '' });

onMounted(() => {
  clientStore.fetchClients();
});

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusSeverity = (status: string) => {
  const s = status?.toLowerCase() || '';
  if (s === 'aprobado' || s === 'validado') return 'success';
  if (s === 'pendiente') return 'warning';
  if (s === 'rechazado') return 'danger';
  return 'info';
};

const goToDossier = (id: string) => {
  router.push(`/clients/${id}/dossier`);
};

const saveClient = async () => {
  if (!newClient.value.name || !newClient.value.rfc) return;
  saving.value = true;
  try {
    await clientStore.saveClient(newClient.value);
    showNewClientDialog.value = false;
    newClient.value = { name: '', rfc: '', email: '' };
  } catch (err) {
    console.error(err);
  } finally {
    saving.value = false;
  }
};
</script>
