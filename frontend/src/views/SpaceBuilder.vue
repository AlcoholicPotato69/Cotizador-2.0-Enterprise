<template>
  <div class="space-builder flex flex-col gap-6">
    <div class="flex justify-between items-end border-b border-surface-200 dark:border-surface-700 pb-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0 tracking-tight">Gestor de Espacios</h1>
        <p class="text-sm text-surface-500 dark:text-surface-400 mt-1 font-medium">Administración de recintos, salones y espacios digitales para configuración global.</p>
      </div>
      <DsButton v-if="!showForm" label="Nuevo Espacio" icon="pi pi-plus" class="!bg-indigo-600 hover:!bg-indigo-700 !border-none !text-white !rounded-xl px-5 py-2 transition-all shadow-md" @click="showCreateForm" v-permission="'spaces.manage'" />
      <DsButton v-else label="Volver a la Lista" icon="pi pi-arrow-left" text class="!text-surface-600" @click="showForm = false" />
    </div>

    <div v-if="showForm" class="bg-surface-0 dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm">
      <SpaceBuilderForm :initial-data="editingSpace" @cancel="showForm = false" @saved="onSaved" />
    </div>
    
    <div v-else class="bg-surface-0 dark:bg-surface-900 rounded-2xl p-4 border border-surface-200 dark:border-surface-700 shadow-sm">
      <DsTable 
        :value="spaceStore.spaces" 
        :paginator="true" 
        :rows="10" 
        :loading="spaceStore.loading"
        emptyMessage="No hay espacios configurados."
        class="p-datatable-sm"
      >
        <DsColumn field="name" header="Nombre del Espacio" sortable>
          <template #body="{ data }">
            <span class="font-bold text-surface-900 dark:text-surface-100">{{ data.name }}</span>
          </template>
        </DsColumn>
        <DsColumn field="spaceType" header="Categoría" sortable>
          <template #body="{ data }">
            <DsTag :value="data.spaceType?.toUpperCase()" severity="secondary" class="!rounded-md" />
          </template>
        </DsColumn>
        <DsColumn field="capacity" header="Capacidad" sortable>
          <template #body="{ data }">
            <span class="text-surface-600 dark:text-surface-300">{{ data.capacity }} pax</span>
          </template>
        </DsColumn>
        <DsColumn field="status" header="Estado">
          <template #body="{ data }">
            <DsTag :value="data.status" :severity="getStatusSeverity(data.status)" class="!rounded-md" />
          </template>
        </DsColumn>
        <DsColumn header="Acciones" :exportable="false" style="min-width:8rem">
          <template #body="{ data }">
            <div class="flex gap-2">
              <DsButton icon="pi pi-pencil" rounded text severity="secondary" @click="showEditForm(data)" v-permission="'spaces.manage'" />
            </div>
          </template>
        </DsColumn>
      </DsTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSpaceStore } from '../stores/spaceStore';
import type { Space } from '../services/spaceService';
import SpaceBuilderForm from '../components/spaces/SpaceBuilderForm.vue';

const spaceStore = useSpaceStore();
const showForm = ref(false);
const editingSpace = ref<Space | undefined>(undefined);

onMounted(() => {
  spaceStore.fetchSpaces();
});

const showCreateForm = () => {
  editingSpace.value = undefined;
  showForm.value = true;
};

const showEditForm = (space: Space) => {
  editingSpace.value = space;
  showForm.value = true;
};

const onSaved = () => {
  showForm.value = false;
};

const getStatusSeverity = (status: string) => {
  switch(status) {
    case 'AVAILABLE': return 'success';
    case 'MAINTENANCE': return 'warning';
    case 'INACTIVE': return 'danger';
    default: return 'info';
  }
};
</script>

