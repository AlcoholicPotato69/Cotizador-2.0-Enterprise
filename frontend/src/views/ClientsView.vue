<template>
  <div class="clients-view">
    <div class="view-header">
      <div>
        <h1 class="title">Directorio de Clientes</h1>
        <p class="subtitle">Gestión de prospectos y cumplimiento jurídico (KYC)</p>
      </div>
      <Button label="Nuevo Cliente" icon="pi pi-plus" @click="showNewClientDialog = true" class="p-button-primary" />
    </div>

    <!-- Data Table -->
    <div class="card">
      <DataTable 
        :value="clients" 
        :paginator="true" 
        :rows="10" 
        dataKey="id" 
        :loading="loading"
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['nombre_completo', 'rfc', 'tenant_name']"
        responsiveLayout="scroll"
        emptyMessage="No se encontraron clientes."
      >
        <template #header>
          <div class="flex justify-content-between">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Buscar por nombre o RFC..." />
            </span>
          </div>
        </template>
        
        <Column field="nombre_completo" header="Razón Social" sortable>
          <template #body="slotProps">
            <span class="font-bold">{{ slotProps.data.nombre_completo }}</span>
          </template>
        </Column>
        
        <Column field="rfc" header="RFC" sortable></Column>
        
        <Column field="perfil_validado" header="Estado de Dictamen" sortable>
          <template #body="slotProps">
            <Tag 
              :severity="slotProps.data.perfil_validado ? 'success' : 'warning'" 
              :value="slotProps.data.perfil_validado ? 'Validado' : 'Pendiente'" 
            />
          </template>
        </Column>

        <Column header="Acciones" :exportable="false" style="min-width:8rem">
          <template #body="slotProps">
            <Button 
              icon="pi pi-file-check" 
              class="p-button-rounded p-button-text p-button-info" 
              title="Workflow de Dictamen"
              @click="openDictamenWorkflow(slotProps.data)" 
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- New Client Dialog -->
    <Dialog v-model:visible="showNewClientDialog" header="Registrar Nuevo Cliente" :modal="true" class="p-fluid" :style="{width: '450px'}">
      <div class="field">
        <label for="nombre">Razón Social</label>
        <InputText id="nombre" v-model.trim="newClient.nombre_completo" required="true" autofocus />
        <small class="p-error" v-if="submitted && !newClient.nombre_completo">La razón social es requerida.</small>
      </div>
      <div class="field mt-3">
        <label for="rfc">RFC</label>
        <InputText id="rfc" v-model.trim="newClient.rfc" required="true" />
        <small class="p-error" v-if="submitted && !newClient.rfc">El RFC es requerido.</small>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-primary" @click="saveClient" :loading="saving" />
      </template>
    </Dialog>

    <!-- Dictamen Workflow Dialog -->
    <Dialog v-model:visible="showDictamenDialog" :header="'Dictamen Jurídico: ' + selectedClient?.nombre_completo" :modal="true" class="p-fluid" :style="{width: '600px'}">
      <div class="dictamen-workflow" v-if="selectedClient">
        <p class="text-sm text-slate-500 mb-4">
          Adjunte los documentos requeridos. Una vez cargados, el perfil podrá ser validado por el departamento legal.
        </p>
        
        <div class="doc-list">
          <div class="doc-item" v-for="docType in requiredDocs" :key="docType.id">
            <div class="doc-info">
              <i class="pi pi-file-pdf text-red-500 text-xl"></i>
              <div>
                <span class="font-bold block">{{ docType.label }}</span>
                <span class="text-xs text-slate-400">
                  {{ hasDocument(docType.id) ? 'Subido' : 'Pendiente' }}
                </span>
              </div>
            </div>
            <Button 
              :icon="hasDocument(docType.id) ? 'pi pi-check' : 'pi pi-upload'" 
              :class="hasDocument(docType.id) ? 'p-button-success p-button-outlined' : 'p-button-secondary p-button-text'" 
            />
          </div>
        </div>

        <div class="mt-4 border-t pt-4" v-if="isVerificador">
          <div class="flex align-items-center justify-content-between bg-slate-50 p-3 border-round">
            <div>
              <span class="font-bold block">Validación Final</span>
              <span class="text-xs text-slate-500">¿Aprueba este expediente para operaciones?</span>
            </div>
            <Button 
              :label="selectedClient.perfil_validado ? 'Revocar' : 'Aprobar'" 
              :class="selectedClient.perfil_validado ? 'p-button-danger p-button-outlined' : 'p-button-success'"
              icon="pi pi-shield" 
              @click="toggleValidation"
            />
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { pb, getActiveUser } from '../services/pb';
import { useTenantStore } from '../stores/tenant';

// PrimeVue components
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';

const tenantStore = useTenantStore();
const activeUser = getActiveUser();

// State
const clients = ref<any[]>([]);
const loading = ref(true);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Dialogs
const showNewClientDialog = ref(false);
const showDictamenDialog = ref(false);
const submitted = ref(false);
const saving = ref(false);
const newClient = ref({ nombre_completo: '', rfc: '' });
const selectedClient = ref<any>(null);

// Constants
const requiredDocs = [
  { id: 'doc_acta_constitutiva', label: 'Acta Constitutiva' },
  { id: 'doc_ine', label: 'Identificación Oficial (INE)' },
  { id: 'doc_constancia_fiscal', label: 'Constancia de Situación Fiscal' },
  { id: 'doc_comprobante_domicilio', label: 'Comprobante de Domicilio' }
];

const isVerificador = computed(() => activeUser?.role === 'verificador' || activeUser?.role === 'admin');

// Fetching
const fetchClients = async () => {
  if (!tenantStore.activeTenantId) return;
  loading.value = true;
  try {
    const records = await pb.collection('clientes').getFullList({
      filter: `tenant = "${tenantStore.activeTenantId}"`,
      sort: '-created'
    });
    clients.value = records;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

watch(() => tenantStore.activeTenantId, () => {
  fetchClients();
});

onMounted(() => {
  fetchClients();
});

// Actions
const hideDialog = () => {
  showNewClientDialog.value = false;
  submitted.value = false;
};

const saveClient = async () => {
  submitted.value = true;
  if (!newClient.value.nombre_completo || !newClient.value.rfc || !tenantStore.activeTenantId) return;

  saving.value = true;
  try {
    await pb.collection('clientes').create({
      tenant: tenantStore.activeTenantId,
      nombre_completo: newClient.value.nombre_completo,
      rfc: newClient.value.rfc,
      perfil_validado: false,
      documentos_estado: {}
    });
    hideDialog();
    fetchClients();
    newClient.value = { nombre_completo: '', rfc: '' };
  } catch (err) {
    console.error(err);
  } finally {
    saving.value = false;
  }
};

// Dictamen Workflow
const openDictamenWorkflow = (client: any) => {
  selectedClient.value = { ...client };
  showDictamenDialog.value = true;
};

const hasDocument = (docId: string) => {
  return selectedClient.value?.documentos_estado?.[docId]?.status === 'aprobado';
};

const toggleValidation = async () => {
  if (!selectedClient.value || !isVerificador.value) return;
  const newValue = !selectedClient.value.perfil_validado;
  
  try {
    await pb.collection('clientes').update(selectedClient.value.id, {
      perfil_validado: newValue
    });
    selectedClient.value.perfil_validado = newValue;
    // Update local list
    const idx = clients.value.findIndex(c => c.id === selectedClient.value.id);
    if (idx !== -1) clients.value[idx].perfil_validado = newValue;
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped>
.clients-view {
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

/* Dictamen Workflow Styles */
.doc-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.doc-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.doc-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.font-bold {
  font-weight: 700;
}

.text-xs {
  font-size: 0.75rem;
}

.block {
  display: block;
}

.border-t {
  border-top: 1px solid #e2e8f0;
}

.pt-4 {
  padding-top: 1rem;
}

.mt-4 {
  margin-top: 1rem;
}

.bg-slate-50 {
  background-color: #f8fafc;
}

.p-3 {
  padding: 0.75rem;
}

.border-round {
  border-radius: 0.5rem;
}

.flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}
</style>
