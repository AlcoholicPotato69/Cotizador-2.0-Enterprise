<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-surface-200 dark:border-surface-800 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">Gestión de Contratos</h1>
        <p class="text-sm text-surface-500">Flujos legales, reglamentos y firma de contratos</p>
      </div>
      <DsButton v-if="permissionsStore.can('contracts.create')" label="Nuevo Contrato" icon="pi pi-plus" @click="createContract" severity="primary" />
    </div>

    <!-- Data Table Container -->
    <div class="bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden p-4">
      <DsTable 
        :value="contractStore.contracts" 
        :loading="contractStore.loading" 
        paginator 
        :rows="10" 
        dataKey="id" 
        filterDisplay="row" 
        v-model:filters="filters"
        :globalFilterFields="['id', 'clientName', 'quoteId', 'status']"
        emptyMessage="No se encontraron contratos registrados."
        class="p-datatable-sm"
      >
        <template #header>
            <div class="flex justify-end">
                <span class="relative">
                    <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-500" />
                    <DsInput v-model="filters['global'].value" placeholder="Buscar contrato..." class="pl-10 w-full sm:w-auto" />
                </span>
            </div>
        </template>
        
        <DsColumn field="id" header="Folio" sortable>
          <template #body="{ data }">
            <button @click="goToDossier(data.id)" class="text-primary-600 hover:underline font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1">
              {{ data.id || 'N/A' }}
            </button>
          </template>
        </DsColumn>

        <DsColumn field="quoteId" header="Cotización" sortable>
          <template #body="{ data }">
            <span class="font-mono text-surface-500 dark:text-surface-400">{{ data.quoteId }}</span>
          </template>
        </DsColumn>
        
        <DsColumn field="clientName" header="Cliente" sortable>
          <template #body="{ data }">
            <span class="font-semibold text-surface-900 dark:text-surface-0">{{ data.clientName }}</span>
          </template>
        </DsColumn>

        <DsColumn field="amount" header="Monto" sortable>
          <template #body="{ data }">
            <span class="font-bold text-surface-900 dark:text-surface-0">{{ formatCurrency(data.amount) }}</span>
          </template>
        </DsColumn>
        
        <DsColumn field="status" header="Estado" sortable>
          <template #body="{ data }">
            <DsTag :value="translateStatus(data.status)" :severity="getStatusSeverity(data.status)" />
          </template>
        </DsColumn>

        <DsColumn header="Acciones" :exportable="false" style="min-width:8rem">
          <template #body="{ data }">
            <DsButton 
              icon="pi pi-folder-open" 
              outlined
              rounded
              severity="info"
              title="Ver Expediente"
              @click="goToDossier(data.id)" 
            />
          </template>
        </DsColumn>
      </DsTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePermissionsStore } from '../stores/permissionsStore';
import { useContractStore } from '../stores/contractStore';


const router = useRouter();
const permissionsStore = usePermissionsStore();
const contractStore = useContractStore();

const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

onMounted(() => {
  contractStore.fetchContracts();
});

const goToDossier = (id: string) => {
    router.push(`/legal/contracts/${id}`);
};

const createContract = () => {
    // Redirigir a creador o abrir modal
};

const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '$0.00';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
};

const translateStatus = (status: string) => {
    const map: Record<string, string> = {
        'DRAFT': 'Borrador',
        'BORRADOR': 'Borrador',
        'PENDING_SIGNATURE': 'Firma Pendiente',
        'EN_REVISION': 'En Revisión',
        'SIGNED': 'Firmado',
        'FIRMADO': 'Firmado',
        'ACTIVE': 'Activo',
        'EXPIRED': 'Expirado',
        'TERMINATED': 'Terminado'
    };
    return map[status?.toUpperCase()] || status;
};

const getStatusSeverity = (status: string) => {
    const s = status?.toUpperCase();
    if (s === 'SIGNED' || s === 'FIRMADO' || s === 'ACTIVE') return 'success';
    if (s === 'DRAFT' || s === 'BORRADOR') return 'warn';
    if (s === 'EN_REVISION' || s === 'PENDING_SIGNATURE') return 'info';
    if (s === 'EXPIRED' || s === 'TERMINATED') return 'danger';
    return 'secondary';
};
</script>

