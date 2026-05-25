<template>
  <div class="flex flex-col gap-6 p-2">
    <div>
      <h1 class="font-display text-3xl font-bold m-0 text-white">Observabilidad</h1>
      <p class="text-white/50 m-0 text-sm font-body mt-1">Telemetría de seguridad, auditoría y flujos del sistema.</p>
    </div>
    <div class="rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl p-6" style="box-shadow: var(--shadow-ambient)">
      <div class="flex justify-between items-center mb-6">
        <h2 class="font-display text-xl font-semibold m-0 text-white">Eventos Recientes</h2>
        <Button label="Sincronizar" icon="pi pi-refresh" outlined rounded class="border-white/20 text-white hover:bg-white/5 transition-all" @click="loadLogs" />
      </div>
      <DataTable :value="logs" :loading="loading" responsiveLayout="scroll" class="p-datatable-sm">
        <Column field="id" header="Log ID"></Column>
        <Column field="level" header="Nivel">
          <template #body="slotProps">
            <span class="px-2 py-1 rounded text-xs" :class="{'bg-red-500/20 text-red-300 border border-red-500/30': slotProps.data.level === 'ERROR', 'bg-blue-500/20 text-blue-300 border border-blue-500/30': slotProps.data.level === 'INFO'}">
              {{ slotProps.data.level }}
            </span>
          </template>
        </Column>
        <Column field="context" header="Contexto"></Column>
        <Column field="message" header="Mensaje"></Column>
        <Column field="timestamp" header="Fecha/Hora">
          <template #body="slotProps">
            {{ new Date(slotProps.data.timestamp).toLocaleString() }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { http } from '../../api/http';

const logs = ref([]);
const loading = ref(false);

const loadLogs = async () => {
  loading.value = true;
  try {
    const res = await http.get('/logs');
    logs.value = res.data;
  } catch (error) {
    console.error('Error fetching logs:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadLogs();
});
</script>
