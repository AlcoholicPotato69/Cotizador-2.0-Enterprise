<template>
  <div class="flex flex-col h-full bg-surface-50 dark:bg-surface-950">
    <DsPageHeader 
      title="Matriz de Permisos" 
      subtitle="Visualización de los permisos granulares disponibles en el sistema"
      :breadcrumbs="[{label: 'Administración', to: '/admin'}, {label: 'Permisos', to: '/admin/permissions'}]"
    />

    <div class="flex-1 p-6 overflow-hidden flex flex-col">
      <div class="bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
        <DsTable 
          :value="store.permissions" 
          :paginator="true" 
          :rows="15" 
          dataKey="id" 
          :loading="store.loading"
          v-model:filters="filters"
          filterDisplay="menu"
          :globalFilterFields="['code', 'description', 'module']"
          emptyMessage="No se encontraron permisos en el sistema."
          class="flex-1"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="flex justify-between items-center p-4 border-b border-surface-200 dark:border-surface-800">
              <span class="text-lg font-semibold text-surface-900 dark:text-surface-50">Catálogo de Permisos</span>
              <span class="p-input-icon-left relative">
                <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <DsInput v-model="filters['global'].value" placeholder="Buscar permiso..." class="pl-10 w-64" />
              </span>
            </div>
          </template>
          
          <DsColumn field="module" header="Módulo" sortable>
            <template #body="{ data }">
              <DsTag :value="data.module?.toUpperCase()" severity="secondary" class="!rounded-md !bg-surface-100 !text-surface-700 dark:!bg-surface-800 dark:!text-surface-300" />
            </template>
          </DsColumn>

          <DsColumn field="code" header="Código del Permiso" sortable>
            <template #body="{ data }">
              <span class="font-mono text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-800/50">{{ data.code }}</span>
            </template>
          </DsColumn>
          
          <DsColumn field="description" header="Descripción" sortable>
            <template #body="{ data }">
              <span class="text-surface-600 dark:text-surface-300 text-sm">{{ data.description }}</span>
            </template>
          </DsColumn>

        </DsTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { usePermissionAdminStore } from '../stores/permissionAdminStore';

const store = usePermissionAdminStore();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(() => {
  store.fetchPermissions();
});
</script>

