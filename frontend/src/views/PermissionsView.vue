<template>
  <div class="p-6 max-w-7xl mx-auto flex flex-col gap-6 w-full">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 m-0">Matriz de Permisos</h1>
        <p class="text-slate-500 m-0 mt-1 text-sm">Visualización de los permisos granulares disponibles en el sistema</p>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <DataTable 
        :value="permissions" 
        :paginator="true" 
        :rows="15" 
        dataKey="id" 
        :loading="loading"
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['code', 'description', 'module']"
        emptyMessage="No se encontraron permisos en el sistema."
        class="p-datatable-sm"
      >
        <template #header>
          <div class="flex justify-end mb-3">
            <span class="p-input-icon-left w-full sm:w-auto">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Buscar permiso..." class="w-full sm:w-80" />
            </span>
          </div>
        </template>
        
        <Column field="module" header="Módulo" sortable>
          <template #body="{ data }">
            <Tag :value="data.module.toUpperCase()" severity="secondary" />
          </template>
        </Column>

        <Column field="code" header="Código del Permiso" sortable>
          <template #body="{ data }">
            <span class="font-mono text-sm font-semibold text-slate-900 bg-slate-50 px-2 py-1 rounded">{{ data.code }}</span>
          </template>
        </Column>
        
        <Column field="description" header="Descripción" sortable>
          <template #body="{ data }">
            <span class="text-slate-600">{{ data.description }}</span>
          </template>
        </Column>

      </DataTable>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
// import { http } from '../api/http';

const loading = ref(false);
const permissions = ref<any[]>([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const fetchPermissions = async () => {
  loading.value = true;
  try {
    // const res = await http.get('/permissions');
    // permissions.value = res.data;
    permissions.value = [
      { id: '1', module: 'Usuarios', code: 'users.manage', description: 'Crear, editar y eliminar usuarios' },
      { id: '2', module: 'Roles', code: 'roles.manage', description: 'Crear y editar roles de sistema' },
      { id: '3', module: 'Clientes', code: 'clients.read', description: 'Ver directorio y expedientes de clientes' },
      { id: '4', module: 'Clientes', code: 'clients.write', description: 'Crear y modificar datos de clientes' },
      { id: '5', module: 'Clientes', code: 'clients.approve', description: 'Aprobar expedientes y dictámenes KYC' },
      { id: '6', module: 'Cotizaciones', code: 'quotes.read', description: 'Ver cotizaciones generadas' },
      { id: '7', module: 'Cotizaciones', code: 'quotes.create', description: 'Generar nuevas cotizaciones' },
      { id: '8', module: 'Cotizaciones', code: 'quotes.manage', description: 'Modificar y aprobar cotizaciones' }
    ];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPermissions();
});

</script>
