<template>
  <div class="p-6 max-w-7xl mx-auto flex flex-col gap-6 w-full">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 m-0">Gestión de Usuarios</h1>
        <p class="text-slate-500 m-0 mt-1 text-sm">Administración de accesos y cuentas del tenant</p>
      </div>
      <Button label="Invitar Usuario" icon="pi pi-user-plus" @click="showInviteDialog = true" class="p-button-primary" />
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <DataTable 
        :value="users" 
        :paginator="true" 
        :rows="10" 
        dataKey="id" 
        :loading="loading"
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['name', 'email', 'role']"
        emptyMessage="No se encontraron usuarios en el sistema."
        class="p-datatable-sm"
      >
        <template #header>
          <div class="flex justify-end mb-3">
            <span class="p-input-icon-left w-full sm:w-auto">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Buscar usuario..." class="w-full sm:w-80" />
            </span>
          </div>
        </template>
        
        <Column field="name" header="Nombre" sortable>
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <Avatar :label="data.name ? data.name.charAt(0) : 'U'" class="bg-slate-100 text-slate-600 font-semibold" shape="circle" />
              <span class="font-semibold text-slate-900">{{ data.name }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="email" header="Correo" sortable>
          <template #body="{ data }">
            <span class="text-slate-600">{{ data.email }}</span>
          </template>
        </Column>

        <Column field="role" header="Rol" sortable>
          <template #body="{ data }">
            <Tag severity="info" :value="data.role?.toUpperCase()" />
          </template>
        </Column>

        <Column field="status" header="Estado" sortable>
          <template #body="{ data }">
            <Tag 
              :severity="data.status === 'activo' ? 'success' : 'warning'" 
              :value="data.status?.toUpperCase() || 'PENDIENTE'" 
            />
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

    <!-- Invite Dialog -->
    <Dialog v-model:visible="showInviteDialog" header="Invitar Usuario" :modal="true" class="p-fluid" style="width: 450px">
      <div class="flex flex-col gap-4 mt-4">
        <div class="field">
          <label class="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
          <InputText v-model.trim="newUser.name" required autofocus />
        </div>
        <div class="field">
          <label class="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
          <InputText type="email" v-model.trim="newUser.email" required />
        </div>
        <div class="field">
          <label class="block text-sm font-medium text-slate-700 mb-1">Rol Asignado</label>
          <Dropdown v-model="newUser.role" :options="roleOptions" optionLabel="label" optionValue="value" placeholder="Seleccione un rol" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showInviteDialog = false" />
        <Button label="Enviar Invitación" icon="pi pi-send" @click="inviteUser" :loading="saving" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
// Prepared for Axios calls: import { http } from '../api/http';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Avatar from 'primevue/avatar';

const loading = ref(false);
const users = ref<any[]>([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const showInviteDialog = ref(false);
const saving = ref(false);
const newUser = ref({ name: '', email: '', role: '' });
const roleOptions = ref([
  { label: 'Administrador', value: 'admin' },
  { label: 'Ventas', value: 'sales' },
  { label: 'Soporte', value: 'support' },
  { label: 'Verificador Legal', value: 'verificador' }
]);

const fetchUsers = async () => {
  loading.value = true;
  try {
    // const res = await http.get('/users');
    // users.value = res.data;
    users.value = [];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});

const inviteUser = async () => {
  if (!newUser.value.email || !newUser.value.name || !newUser.value.role) return;
  saving.value = true;
  try {
    // await http.post('/users/invite', newUser.value);
    showInviteDialog.value = false;
    newUser.value = { name: '', email: '', role: '' };
    fetchUsers();
  } catch (err) {
    console.error(err);
  } finally {
    saving.value = false;
  }
};
</script>
