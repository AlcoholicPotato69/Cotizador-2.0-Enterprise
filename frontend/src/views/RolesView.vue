<template>
  <div class="p-6 max-w-7xl mx-auto flex flex-col gap-6 w-full">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 m-0">Gestión de Roles</h1>
        <p class="text-slate-500 m-0 mt-1 text-sm">Configura los roles de usuario y sus permisos asociados</p>
      </div>
      <Button label="Crear Rol" icon="pi pi-plus" @click="showNewRoleDialog = true" class="p-button-primary" />
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <DataTable 
        :value="roles" 
        :paginator="true" 
        :rows="10" 
        dataKey="id" 
        :loading="loading"
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['name', 'description']"
        emptyMessage="No se encontraron roles en el sistema."
        class="p-datatable-sm"
      >
        <template #header>
          <div class="flex justify-end mb-3">
            <span class="p-input-icon-left w-full sm:w-auto">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Buscar rol..." class="w-full sm:w-80" />
            </span>
          </div>
        </template>
        
        <Column field="name" header="Nombre del Rol" sortable>
          <template #body="{ data }">
            <span class="font-semibold text-slate-900">{{ data.name }}</span>
          </template>
        </Column>
        
        <Column field="description" header="Descripción" sortable>
          <template #body="{ data }">
            <span class="text-slate-600">{{ data.description }}</span>
          </template>
        </Column>

        <Column field="permissions" header="Permisos Asignados">
          <template #body="{ data }">
            <div class="flex flex-wrap gap-1">
              <Tag v-for="p in data.permissions?.slice(0, 3)" :key="p" :value="p" severity="secondary" />
              <Tag v-if="data.permissions?.length > 3" :value="`+${data.permissions.length - 3}`" severity="info" />
            </div>
          </template>
        </Column>

        <Column header="Acciones" :exportable="false" style="min-width:8rem">
          <template #body>
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-secondary mr-2" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- New Role Dialog -->
    <Dialog v-model:visible="showNewRoleDialog" header="Crear Nuevo Rol" :modal="true" class="p-fluid" style="width: 550px">
      <div class="flex flex-col gap-4 mt-4">
        <div class="field">
          <label class="block text-sm font-medium text-slate-700 mb-1">Nombre del Rol</label>
          <InputText v-model.trim="newRole.name" required autofocus />
        </div>
        <div class="field">
          <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
          <Textarea v-model.trim="newRole.description" rows="3" />
        </div>
        <div class="field">
          <label class="block text-sm font-medium text-slate-700 mb-1">Permisos</label>
          <p class="text-xs text-slate-500 m-0">Seleccione los permisos en la vista de edición.</p>
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showNewRoleDialog = false" />
        <Button label="Guardar Rol" icon="pi pi-check" @click="saveRole" :loading="saving" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
// import { http } from '../api/http';

const loading = ref(false);
const roles = ref<any[]>([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const showNewRoleDialog = ref(false);
const saving = ref(false);
const newRole = ref({ name: '', description: '', permissions: [] });

const fetchRoles = async () => {
  loading.value = true;
  try {
    // const res = await http.get('/roles');
    // roles.value = res.data;
    roles.value = [
      { id: '1', name: 'Administrador', description: 'Acceso total al sistema', permissions: ['users.manage', 'roles.manage', 'settings.manage', 'clients.read', 'clients.write', 'quotes.manage'] },
      { id: '2', name: 'Ventas', description: 'Creación y gestión de cotizaciones', permissions: ['quotes.create', 'quotes.read', 'clients.read', 'clients.write'] },
      { id: '3', name: 'Verificador', description: 'Aprobación de dictámenes y expedientes', permissions: ['clients.read', 'clients.approve'] }
    ];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRoles();
});

const saveRole = async () => {
  if (!newRole.value.name) return;
  saving.value = true;
  try {
    // await http.post('/roles', newRole.value);
    showNewRoleDialog.value = false;
    newRole.value = { name: '', description: '', permissions: [] };
    fetchRoles();
  } catch (err) {
    console.error(err);
  } finally {
    saving.value = false;
  }
};
</script>
