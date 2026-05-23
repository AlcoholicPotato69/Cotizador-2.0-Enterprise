<template>
  <div class="contracts-view">
    <div class="view-header">
      <div>
        <h1 class="title">Gestión de Contratos</h1>
        <p class="subtitle">Flujos legales y firma de acuerdos</p>
      </div>
      <Button label="Importar Cotización (Nuevo Contrato)" icon="pi pi-file-import" @click="openImportDialog" class="p-button-primary" v-if="hasPermission('contracts.create')" />
    </div>

    <!-- Data Table -->
    <div class="card mt-4">
      <DataTable 
        :value="contracts" 
        :paginator="true" 
        :rows="10" 
        dataKey="id" 
        :loading="loading"
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['id', 'status', 'expand.cotizacion.expand.cliente.nombre_completo']"
        responsiveLayout="scroll"
        emptyMessage="No hay contratos registrados."
      >
        <template #header>
          <div class="flex justify-content-between">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Buscar contrato..." />
            </span>
          </div>
        </template>
        
        <Column field="id" header="Folio Contrato" sortable>
          <template #body="slotProps">
            <span class="font-mono text-sm text-slate-500">#{{ slotProps.data.id.substring(0,8) }}</span>
          </template>
        </Column>

        <Column field="cotizacion" header="Folio Cotización" sortable>
          <template #body="slotProps">
            <span class="font-mono text-sm text-slate-500">#{{ slotProps.data.cotizacion?.substring(0,8) }}</span>
          </template>
        </Column>

        <Column header="Cliente" sortable>
          <template #body="slotProps">
            <span class="font-bold">{{ slotProps.data.expand?.cotizacion?.expand?.cliente?.nombre_completo || 'N/A' }}</span>
          </template>
        </Column>
        
        <Column field="status" header="Estado" sortable>
          <template #body="slotProps">
            <Tag :severity="getStatusSeverity(slotProps.data.status)" :value="slotProps.data.status.toUpperCase()" />
          </template>
        </Column>

        <Column header="Acciones" :exportable="false" style="min-width:10rem">
          <template #body="slotProps">
            <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-info mr-2" @click="viewContract(slotProps.data)" />
            <Button icon="pi pi-print" class="p-button-rounded p-button-text p-button-secondary" @click="printContract(slotProps.data)" v-if="hasPermission('contracts.view')" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Import / Create Dialog -->
    <Dialog v-model:visible="showImportDialog" header="Crear Contrato desde Cotización" :modal="true" class="p-fluid" :style="{width: '500px'}">
      <div class="field">
        <label>Cotización Aprobada (Origen)</label>
        <select v-model="selectedQuoteId" class="p-inputtext custom-select mt-2">
          <option value="">Seleccione una cotización...</option>
          <option v-for="q in approvedQuotes" :key="q.id" :value="q.id">
            Folio #{{ q.id.substring(0,8) }} - {{ q.expand?.cliente?.nombre_completo }}
          </option>
        </select>
        <small class="p-error block mt-1" v-if="importError">{{ importError }}</small>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showImportDialog = false" />
        <Button label="Generar Contrato" icon="pi pi-cog" class="p-button-primary" @click="generateContract" :loading="saving" />
      </template>
    </Dialog>

    <!-- View / Sign Dialog -->
    <Dialog v-model:visible="showViewDialog" :header="'Contrato: ' + selectedContract?.id" :modal="true" class="p-fluid" :style="{width: '800px'}">
      
      <!-- HTML Renderer -->
      <div class="contract-document border-round p-3 surface-ground" style="max-height: 50vh; overflow-y: auto;">
         <div v-html="selectedContract?.contenido_html"></div>
      </div>

      <template #footer>
        <div class="flex justify-content-between w-full mt-3">
          <Button label="Cerrar" icon="pi pi-times" class="p-button-text" @click="showViewDialog = false" />
          
          <div class="flex gap-2">
            <!-- Permission-First RBAC in action: Checking 'contracts.approve' instead of 'role == admin' -->
            <Button v-if="selectedContract?.status === 'borrador' && hasPermission('contracts.approve')" 
                    label="Marcar como Firmado" 
                    icon="pi pi-check" 
                    class="p-button-success" 
                    @click="updateStatus('firmado')" />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { pb } from '../services/pb';
import { useTenantStore } from '../stores/tenant';
import { useRBAC } from '../composables/useRBAC';
import { generateContractContent } from '../utils/ContractEngine';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';

const tenantStore = useTenantStore();
const { hasPermission } = useRBAC();

// State
const contracts = ref<any[]>([]);
const approvedQuotes = ref<any[]>([]);
const loading = ref(true);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Dialogs
const showImportDialog = ref(false);
const showViewDialog = ref(false);
const saving = ref(false);
const selectedQuoteId = ref('');
const selectedContract = ref<any>(null);
const importError = ref('');

const getStatusSeverity = (status: string) => {
  switch(status) {
    case 'firmado': return 'success';
    case 'cancelado': return 'danger';
    case 'borrador': return 'warning';
    default: return 'info';
  }
};

// Fetching
const fetchContracts = async () => {
  if (!tenantStore.activeTenantId) return;
  loading.value = true;
  try {
    const records = await pb.collection('contratos').getFullList({
      filter: `tenant = "${tenantStore.activeTenantId}"`,
      expand: 'cotizacion, cotizacion.cliente',
      sort: '-created'
    });
    contracts.value = records;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const fetchApprovedQuotes = async () => {
  if (!tenantStore.activeTenantId) return;
  try {
    // Only fetch quotes that don't have a contract yet (Ideally handled in query, simplified here)
    const records = await pb.collection('cotizaciones').getFullList({
      filter: `tenant = "${tenantStore.activeTenantId}" && status = "aprobada"`,
      expand: 'cliente'
    });
    approvedQuotes.value = records;
  } catch (err) {
    console.error(err);
  }
};

watch(() => tenantStore.activeTenantId, () => {
  fetchContracts();
});

onMounted(() => {
  fetchContracts();
});

// Actions
const openImportDialog = () => {
  importError.value = '';
  selectedQuoteId.value = '';
  fetchApprovedQuotes();
  showImportDialog.value = true;
};

const generateContract = async () => {
  if (!selectedQuoteId.value) {
    importError.value = 'Debe seleccionar una cotización';
    return;
  }

  saving.value = true;
  try {
    const quote = approvedQuotes.value.find(q => q.id === selectedQuoteId.value);
    
    // const tenantName = tenantStore.activeTenantId === 't_plazamayor123' ? 'Plaza Mayor' : 'Casa de Piedra';
    
    const result = await generateContractContent(tenantStore.activeTenantId || '', quote);
    if (!result.success) throw new Error(result.error);
    const htmlContent = result.htmlContent;

    // 2. Save in Database
    await pb.collection('contratos').create({
      tenant: tenantStore.activeTenantId,
      cotizacion: quote.id,
      status: 'borrador',
      contenido_html: htmlContent
    });

    showImportDialog.value = false;
    fetchContracts();
  } catch(err) {
    console.error(err);
    importError.value = 'Error al generar contrato';
  } finally {
    saving.value = false;
  }
};

const viewContract = (contract: any) => {
  selectedContract.value = contract;
  showViewDialog.value = true;
};

const updateStatus = async (newStatus: string) => {
  if (!selectedContract.value) return;
  try {
    await pb.collection('contratos').update(selectedContract.value.id, {
      status: newStatus
    });
    selectedContract.value.status = newStatus;
    fetchContracts();
  } catch(err) {
    console.error(err);
  }
};

const printContract = (contract: any) => {
  // Simple print logic for MVP 
  const printWindow = window.open('', '', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(contract.contenido_html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    // printWindow.close(); // Optional
  }
};
</script>

<style scoped>
.contracts-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
}

.subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #64748b;
}

.card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.custom-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background-color: #ffffff;
}

.surface-ground { background-color: #f8fafc; }

/* Flex utils */
.flex { display: flex; }
.justify-content-between { justify-content: space-between; }
.align-items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mr-2 { margin-right: 0.5rem; }
.p-3 { padding: 0.75rem; }
.border-round { border-radius: 0.5rem; }
.font-bold { font-weight: 700; }
.font-mono { font-family: monospace; }
.w-full { width: 100%; }
.text-sm { font-size: 0.875rem; }
.text-slate-500 { color: #64748b; }
.block { display: block; }
</style>
