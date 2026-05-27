<template>
  <div class="flex flex-col h-full bg-surface-50 dark:bg-surface-950">
    <DsPageHeader
      title="Integraciones"
      subtitle="Gestiona las conexiones con sistemas externos y webhooks"
      :breadcrumbs="[{ label: 'Admin', to: '/admin' }, { label: 'Integraciones', to: '/admin/integrations' }]"
    >
      <template #actions>
        <DsButton icon="pi pi-plus" label="Nueva Integración" />
      </template>
    </DsPageHeader>

    <div class="p-6 flex-1 overflow-auto">
      <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-lg p-6 shadow-sm">
        <DsTable :data="integrations" :loading="loading" :paginator="true" :rows="10">
          <DsColumn field="name" header="Nombre" />
          <DsColumn field="type" header="Tipo" />
          <DsColumn field="status" header="Estado">
            <template #body="{ data }">
              <span :class="[
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                data.status === 'active' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50' :
                data.status === 'inactive' ? 'bg-surface-100 text-surface-800 border-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:border-surface-700' :
                'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50'
              ]">
                {{ data.status === 'active' ? 'Activo' : data.status === 'inactive' ? 'Inactivo' : 'Error' }}
              </span>
            </template>
          </DsColumn>
          <DsColumn field="lastSync" header="Última Sincronización">
            <template #body="{ data }">
              {{ data.lastSync ? new Date(data.lastSync).toLocaleString() : 'N/A' }}
            </template>
          </DsColumn>
          <DsColumn header="Acciones">
            <template #body="{ data }">
              <div class="flex gap-2">
                <DsButton 
                  v-if="data.status !== 'active'" 
                  size="sm" 
                  variant="outline" 
                  @click="toggleStatus(data.id, true)"
                  label="Activar"
                />
                <DsButton 
                  v-if="data.status === 'active'" 
                  size="sm" 
                  variant="outline" 
                  color="danger" 
                  @click="toggleStatus(data.id, false)"
                  label="Desactivar"
                />
                <DsButton size="sm" variant="ghost" icon="pi pi-cog" />
              </div>
            </template>
          </DsColumn>
        </DsTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DsPageHeader from '../components/ui/DsPageHeader.vue';
import DsTable from '../components/ui/DsTable.vue';
import DsColumn from '../components/ui/DsColumn.vue';
import DsButton from '../components/ui/DsButton.vue';
import { integrationService, type Integration } from '../services/integrationService';

const integrations = ref<Integration[]>([]);
const loading = ref(true);

const fetchIntegrations = async () => {
  loading.value = true;
  try {
    integrations.value = await integrationService.getIntegrations();
  } catch (error) {
    console.error('Error fetching integrations:', error);
  } finally {
    loading.value = false;
  }
};

const toggleStatus = async (id: string, active: boolean) => {
  try {
    const updated = await integrationService.toggleIntegration(id, active);
    const index = integrations.value.findIndex(i => i.id === id);
    if (index !== -1) {
      integrations.value[index] = { ...integrations.value[index], status: updated.status };
    }
  } catch (error) {
    console.error('Error toggling integration:', error);
  }
};

onMounted(() => {
  fetchIntegrations();
});
</script>

