<template>
  <div class="flex flex-col h-full bg-surface-50 dark:bg-surface-950">
    <DsPageHeader
      title="Registros de Auditoría"
      subtitle="Visualiza el historial de acciones y eventos del sistema"
      :breadcrumbs="[{ label: 'Admin', to: '/admin' }, { label: 'Auditoría', to: '/admin/audit-logs' }]"
    />

    <div class="p-6 flex-1 overflow-auto">
      <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-lg p-6 shadow-sm">
        <DsTable :data="logs" :loading="loading" :paginator="true" :rows="10">
          <DsColumn field="created" header="Fecha">
            <template #body="{ data }">
              {{ new Date(data.created).toLocaleString() }}
            </template>
          </DsColumn>
          <DsColumn field="user" header="Usuario" />
          <DsColumn field="action" header="Acción">
            <template #body="{ data }">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-300 border border-surface-200 dark:border-surface-700">
                {{ data.action }}
              </span>
            </template>
          </DsColumn>
          <DsColumn field="resource" header="Recurso" />
          <DsColumn field="details" header="Detalles" />
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
import { auditService, type AuditLog } from '../services/auditService';

const logs = ref<AuditLog[]>([]);
const loading = ref(true);

const fetchLogs = async () => {
  loading.value = true;
  try {
    const res = await auditService.getLogs();
    logs.value = res.items;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLogs();
});
</script>

