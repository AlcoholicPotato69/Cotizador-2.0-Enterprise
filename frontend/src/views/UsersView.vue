<template>
  <div class="flex flex-col h-full bg-surface-50 dark:bg-surface-950">
    <DsPageHeader 
      title="Gestión de Usuarios" 
      subtitle="Administración de accesos y cuentas del tenant"
      :breadcrumbs="[{label: 'Administración', to: '/admin'}, {label: 'Usuarios', to: '/admin/users'}]"
    >
      <template #actions>
        <DsButton v-permission="'users.create'" label="Invitar Usuario" icon="pi pi-user-plus" @click="showInviteDialog = true" />
      </template>
    </DsPageHeader>

    <div class="flex-1 p-6 overflow-hidden flex flex-col">
      <div class="bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
        <DsTable 
          :value="userStore.users" 
          :paginator="true" 
          :rows="15" 
          dataKey="id" 
          :loading="userStore.loading"
          v-model:filters="filters"
          filterDisplay="menu"
          :globalFilterFields="['name', 'email', 'role']"
          emptyMessage="No se encontraron usuarios en el sistema."
          class="flex-1"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="flex justify-between items-center p-4 border-b border-surface-200 dark:border-surface-800">
              <span class="text-lg font-semibold text-surface-900 dark:text-surface-50">Directorio</span>
              <span class="p-input-icon-left relative">
                <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <DsInput v-model="filters['global'].value" placeholder="Buscar usuario..." class="pl-10 w-64" />
              </span>
            </div>
          </template>
          
          <DsColumn field="name" header="Nombre" sortable>
            <template #body="{ data }">
              <div class="flex items-center gap-3">
                <Avatar :label="data.name ? data.name.charAt(0).toUpperCase() : 'U'" class="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 font-bold" shape="circle" />
                <span class="font-semibold text-surface-900 dark:text-surface-0">{{ data.name }}</span>
              </div>
            </template>
          </DsColumn>
          
          <DsColumn field="email" header="Correo" sortable>
            <template #body="{ data }">
              <span class="text-surface-600 dark:text-surface-300 text-sm">{{ data.email }}</span>
            </template>
          </DsColumn>

          <DsColumn field="role" header="Rol" sortable>
            <template #body="{ data }">
              <DsTag severity="info" :value="data.role?.toUpperCase()" class="!rounded-md" />
            </template>
          </DsColumn>

          <DsColumn field="status" header="Estado" sortable>
            <template #body="{ data }">
              <DsTag 
                :severity="data.status === 'active' ? 'success' : 'warning'" 
                :value="data.status?.toUpperCase() || 'PENDIENTE'"
                class="!rounded-md"
              />
            </template>
          </DsColumn>

          <DsColumn header="Acciones" :exportable="false" style="min-width:8rem">
            <template #body>
              <div class="flex gap-2">
                <DsButton v-permission="'users.update'" icon="pi pi-pencil" rounded text severity="secondary" />
                <DsButton v-permission="'users.delete'" icon="pi pi-trash" rounded text severity="danger" />
              </div>
            </template>
          </DsColumn>
        </DsTable>
      </div>
    </div>

    <!-- Invite Dialog -->
    <DsModal v-model:visible="showInviteDialog" header="Invitar Usuario" :modal="true" class="p-fluid !rounded-2xl" :style="{ width: '450px' }">
      <div class="flex flex-col gap-5 mt-4">
        <div class="field">
          <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Nombre Completo</label>
          <DsInput v-model.trim="newUser.name" required autofocus class="w-full" />
        </div>
        <div class="field">
          <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Correo Electrónico</label>
          <DsInput type="email" v-model.trim="newUser.email" required class="w-full" />
        </div>
        <div class="field">
          <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Rol Asignado</label>
          <Dropdown v-model="newUser.role" :options="userStore.roleOptions" optionLabel="label" optionValue="value" placeholder="Seleccione un rol" class="w-full" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 mt-4">
          <DsButton label="Cancelar" icon="pi pi-times" text class="!text-surface-600" @click="showInviteDialog = false" />
          <DsButton label="Enviar Invitación" icon="pi pi-send" @click="inviteUser" :loading="userStore.saving" />
        </div>
      </template>
    </DsModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useUserStore } from '../stores/userStore';
import { useToast } from 'primevue/usetoast';

const userStore = useUserStore();
const toast = useToast();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const showInviteDialog = ref(false);
const newUser = ref({ name: '', email: '', role: '' });

onMounted(async () => {
  await Promise.all([
    userStore.fetchUsers(),
    userStore.fetchRoles()
  ]);
});

const inviteUser = async () => {
  if (!newUser.value.email || !newUser.value.name || !newUser.value.role) return;
  
  try {
    await userStore.inviteUser({ ...newUser.value });
    showInviteDialog.value = false;
    newUser.value = { name: '', email: '', role: '' };
    toast.add({ severity: 'success', summary: 'Invitación enviada', detail: 'El usuario recibirá un correo con las instrucciones.', life: 3000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar la invitación.', life: 3000 });
  }
};
</script>

