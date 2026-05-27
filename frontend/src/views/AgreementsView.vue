<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-surface-200 dark:border-surface-800 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">Cartas Convenio y Acuerdos</h1>
        <p class="text-sm text-surface-500">Gestión de anexos y acuerdos suplementarios</p>
      </div>
      <DsButton v-if="permissionsStore.can('agreements.create')" label="Nuevo Acuerdo" icon="pi pi-plus" @click="createAgreement" severity="primary" />
    </div>

    <!-- Data Table Container -->
    <div class="bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden p-4">
      <DsTable 
        :value="agreementStore.agreements" 
        :loading="agreementStore.loading" 
        paginator 
        :rows="10" 
        dataKey="id" 
        filterDisplay="row" 
        v-model:filters="filters"
        :globalFilterFields="['id', 'contractId', 'clientName', 'type', 'status']"
        emptyMessage="No se encontraron acuerdos registrados."
        class="p-datatable-sm"
      >
        <template #header>
            <div class="flex justify-end">
                <span class="relative">
                    <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-500" />
                    <DsInput v-model="filters['global'].value" placeholder="Buscar acuerdo..." class="pl-10 w-full sm:w-auto" />
                </span>
            </div>
        </template>
        
        <DsColumn field="id" header="ID Acuerdo" sortable>
          <template #body="{ data }">
            <button @click="goToDossier(data.id)" class="text-primary-600 hover:underline font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1">
              {{ data.id || 'N/A' }}
            </button>
          </template>
        </DsColumn>

        <DsColumn field="contractId" header="Contrato Base" sortable>
          <template #body="{ data }">
            <span class="font-mono text-surface-500 dark:text-surface-400">{{ data.contractId }}</span>
          </template>
        </DsColumn>
        
        <DsColumn field="clientName" header="Cliente" sortable>
          <template #body="{ data }">
            <span class="font-semibold text-surface-900 dark:text-surface-0">{{ data.clientName }}</span>
          </template>
        </DsColumn>

        <DsColumn field="type" header="Tipo de Acuerdo" sortable></DsColumn>
        
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
              title="Ver Expediente de Acuerdo"
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
import { useAgreementStore } from '../stores/agreementStore';


const router = useRouter();
const permissionsStore = usePermissionsStore();
const agreementStore = useAgreementStore();

const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

onMounted(() => {
  agreementStore.fetchAgreements();
});

const goToDossier = (id: string) => {
  router.push(`/legal/agreements/${id}`);
};

const createAgreement = () => {
    // Action to create
};

const translateStatus = (status: string) => {
    const map: Record<string, string> = {
        'DRAFT': 'Borrador',
        'BORRADOR': 'Borrador',
        'IN_REVIEW': 'En Revisión',
        'EN_REVISION': 'En Revisión',
        'APPROVED': 'Aprobado',
        'PENDING_SIGNATURE': 'Firma Pendiente',
        'SIGNED': 'Firmado',
        'FIRMADO': 'Firmado'
    };
    return map[status?.toUpperCase()] || status;
};

const getStatusSeverity = (status: string) => {
    const s = status?.toUpperCase();
    if (s === 'SIGNED' || s === 'FIRMADO' || s === 'APPROVED') return 'success';
    if (s === 'DRAFT' || s === 'BORRADOR') return 'warn';
    if (s === 'IN_REVIEW' || s === 'EN_REVISION' || s === 'PENDING_SIGNATURE') return 'info';
    return 'secondary';
};
</script>

