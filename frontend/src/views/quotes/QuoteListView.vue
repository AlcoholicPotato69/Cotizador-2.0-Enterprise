<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
          Cotizaciones
        </h1>
        <p class="text-surface-400 mt-2">Gestiona las propuestas comerciales y sus versiones</p>
      </div>
      <Button v-if="canCreate" label="Nueva Cotización" icon="pi pi-plus" @click="router.push('/quotes/new')" 
              class="bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/30" />
    </div>

    <div v-if="quoteStore.loading" class="flex justify-center p-12">
      <ProgressSpinner />
    </div>
    <div v-else-if="quoteStore.error" class="p-4 bg-red-900/30 border border-red-500 text-red-200 rounded-xl">
      {{ quoteStore.error }}
    </div>
    <div v-else class="glass-panel p-6 rounded-2xl border border-surface-700/50">
      <DataTable :value="quoteStore.quotes" :paginator="true" :rows="10" 
                 class="p-datatable-sm w-full"
                 responsiveLayout="scroll">
        <Column field="folio" header="Folio" sortable>
          <template #body="slotProps">
            <span class="font-mono text-emerald-400 font-semibold">{{ slotProps.data.folio }}</span>
          </template>
        </Column>
        <Column field="client_id" header="Cliente" sortable>
          <template #body="slotProps">
            {{ getClientName(slotProps.data.client_id) }}
          </template>
        </Column>
        <Column field="total_amount" header="Total" sortable>
          <template #body="slotProps">
            <span class="font-medium">${{ slotProps.data.total_amount?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
          </template>
        </Column>
        <Column field="status" header="Estatus" sortable>
          <template #body="slotProps">
            <span :class="getStatusClass(slotProps.data.status)" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {{ slotProps.data.status }}
            </span>
          </template>
        </Column>
        <Column field="current_version" header="v." sortable>
          <template #body="slotProps">
            <span class="text-surface-400">v{{ slotProps.data.current_version }}</span>
          </template>
        </Column>
        <Column header="Acciones">
          <template #body="slotProps">
            <Button icon="pi pi-chevron-right" text rounded aria-label="Ver" @click="goToDetail(slotProps.data.id)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Create dialog has been extracted to QuoteCreateView -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuoteStore } from '../../stores/quoteStore';
import { useClientStore } from '../../stores/clientStore';
import { usePermissionsStore } from '../../stores/permissionsStore';

const router = useRouter();
const quoteStore = useQuoteStore();
const clientStore = useClientStore();
const permissionsStore = usePermissionsStore();

const canCreate = computed(() => permissionsStore.can('quotes.create'));

onMounted(async () => {
  await clientStore.fetchClients();
  await quoteStore.fetchQuotes();
});

const getClientName = (id: string) => {
  const c = clientStore.clients.find((x: any) => x.id === id);
  return c ? c.razon_social : 'Desconocido';
};

const getStatusClass = (status: string) => {
  const map: Record<string, string> = {
    draft: 'bg-surface-800 text-surface-300',
    pending_approval: 'bg-amber-900/50 text-amber-400',
    approved: 'bg-emerald-900/50 text-emerald-400',
    rejected: 'bg-red-900/50 text-red-400',
    converted: 'bg-indigo-900/50 text-indigo-400'
  };
  return map[status] || map.draft;
};



const goToDetail = (id: string) => {
  router.push(`/quotes/${id}`);
};
</script>
