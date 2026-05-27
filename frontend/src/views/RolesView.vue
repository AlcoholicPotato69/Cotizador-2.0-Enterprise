<template>
  <div class="flex flex-col h-full bg-surface-50 dark:bg-surface-950">
    <DsPageHeader 
      title="Gestión de Roles" 
      subtitle="Configura los roles de usuario y sus permisos asociados"
      :breadcrumbs="[{label: 'Administración', to: '/admin'}, {label: 'Roles', to: '/admin/roles'}]"
    >
      <template #actions>
        <DsButton v-permission="'roles.create'" label="Crear Rol" icon="pi pi-plus" @click="showNewRoleDialog = true" />
      </template>
    </DsPageHeader>

    <div class="flex-1 p-6 overflow-hidden flex flex-col">
      <div class="bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
        <DsTable 
          :value="roleStore.roles" 
          :paginator="true" 
          :rows="15" 
          dataKey="id" 
          :loading="roleStore.loading"
          v-model:filters="filters"
          filterDisplay="menu"
          :globalFilterFields="['name', 'description']"
          emptyMessage="No se encontraron roles en el sistema."
          class="flex-1"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="flex justify-between items-center p-4 border-b border-surface-200 dark:border-surface-800">
              <span class="text-lg font-semibold text-surface-900 dark:text-surface-50">Catálogo de Roles</span>
              <span class="p-input-icon-left relative">
                <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <DsInput v-model="filters['global'].value" placeholder="Buscar rol..." class="pl-10 w-64" />
              </span>
            </div>
          </template>
          
          <DsColumn field="name" header="Nombre del Rol" sortable>
            <template #body="{ data }">
              <span class="font-semibold text-surface-900 dark:text-surface-0">{{ data.name }}</span>
            </template>
          </DsColumn>
          
          <DsColumn field="description" header="Descripción" sortable>
            <template #body="{ data }">
              <span class="text-surface-600 dark:text-surface-300 text-sm">{{ data.description }}</span>
            </template>
          </DsColumn>

          <DsColumn field="permissions" header="Permisos Asignados">
            <template #body="{ data }">
              <div class="flex flex-wrap gap-1.5">
                <DsTag v-for="p in data.permissions?.slice(0, 3)" :key="p" :value="p" severity="secondary" class="!rounded-md !bg-surface-100 !text-surface-700 dark:!bg-surface-800 dark:!text-surface-300 !px-2" />
                <DsTag v-if="data.permissions?.length > 3" :value="`+${data.permissions.length - 3}`" severity="info" class="!rounded-md !px-2" />
              </div>
            </template>
          </DsColumn>

          <DsColumn :exportable="false" style="min-width:8rem">
            <template #body>
              <DsButton icon="pi pi-pencil" outlined rounded class="mr-2" />
              <DsButton icon="pi pi-trash" outlined rounded severity="danger" />
            </template>
          </DsColumn>
        </DsTable>
      </div>
    </div>

    <!-- New Role Dialog -->
    <DsModal v-model:visible="showNewRoleDialog" header="Crear Nuevo Rol" :modal="true" class="p-fluid !rounded-2xl" :style="{ width: '550px' }">
      <div class="flex flex-col gap-5 mt-4">
        <div class="field">
          <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Nombre del Rol</label>
          <DsInput v-model.trim="newRole.name" required autofocus class="w-full" />
        </div>
        <div class="field">
          <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Descripción</label>
          <DsTextarea v-model.trim="newRole.description" rows="3" class="w-full resize-none" />
        </div>
        <div class="field">
          <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Permisos</label>
          <div class="bg-surface-50 dark:bg-surface-950 p-4 rounded-xl border border-surface-200 dark:border-surface-700">
            <p class="text-xs text-surface-500 dark:text-surface-400 m-0">La asignación de permisos detallada se realiza en la vista de edición una vez creado el rol.</p>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 mt-4">
          <DsButton label="Cancelar" icon="pi pi-times" text class="!text-surface-600" @click="showNewRoleDialog = false" />
          <DsButton label="Guardar Rol" icon="pi pi-check" @click="saveRole" :loading="roleStore.saving" />
        </div>
      </template>
    </DsModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useRoleStore } from '../stores/roleStore';
import { useToast } from 'primevue/usetoast';

const roleStore = useRoleStore();
const toast = useToast();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const showNewRoleDialog = ref(false);
const newRole = ref({ name: '', description: '', permissions: [] });

onMounted(() => {
  roleStore.fetchRoles();
});

const saveRole = async () => {
  if (!newRole.value.name) return;
  
  try {
    await roleStore.createRole({ ...newRole.value });
    showNewRoleDialog.value = false;
    newRole.value = { name: '', description: '', permissions: [] };
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Rol creado correctamente.', life: 3000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el rol.', life: 3000 });
  }
};
</script>

