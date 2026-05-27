<template>
  <div class="h-full flex flex-col space-y-6">
    <DsPageHeader 
      title="Directorio de Clientes" 
      subtitle="Gestión de prospectos y contactos comerciales."
      icon="pi-users"
    >
      <template #actions>
        <DsButton icon="pi pi-user-plus" label="Nuevo Cliente" variant="primary" @click="openCreateDrawer" />
      </template>
    </DsPageHeader>

    <div class="flex-1 bg-surface-0 dark:bg-surface-800 rounded-3xl border border-surface-200 dark:border-white/5 shadow-sm p-6 flex flex-col min-h-0">
      
      <div class="mb-4">
        <DsSearchBar v-model="searchQuery" placeholder="Buscar por nombre, correo o RFC..." @search="fetchClients" />
      </div>

      <div class="flex-1 overflow-hidden">
        <DsLoadingState v-if="loading" message="Cargando directorio..." />
        <DsTable v-else :value="filteredClients" class="h-full">
          <DsColumn field="name" header="Nombre / Razón Social">
            <template #body="{ data }">
              <span class="font-bold text-surface-900 dark:text-surface-0">{{ data.name }}</span>
            </template>
          </DsColumn>
          <DsColumn field="email" header="Correo Electrónico">
            <template #body="{ data }">
              <span class="text-surface-600">{{ data.email || '—' }}</span>
            </template>
          </DsColumn>
          <DsColumn field="phone" header="Teléfono">
            <template #body="{ data }">
              <span class="text-surface-600">{{ data.phone || '—' }}</span>
            </template>
          </DsColumn>
          <DsColumn field="rfc" header="RFC">
            <template #body="{ data }">
              <span class="text-surface-600 font-mono text-xs uppercase">{{ data.rfc || '—' }}</span>
            </template>
          </DsColumn>
          <DsColumn field="status" header="Estado">
            <template #body="{ data }">
              <DsStatusBadge :status="data.status" />
            </template>
          </DsColumn>
          <DsColumn header="Acciones" style="width: 120px">
            <template #body="{ data }">
              <div class="flex gap-2">
                <DsButton icon="pi pi-pencil" variant="text" rounded @click="openEditDrawer(data)" />
                <DsButton icon="pi pi-folder-open" variant="text" rounded @click="openDossierModal(data)" />
              </div>
            </template>
          </DsColumn>
        </DsTable>
      </div>

    </div>

    <!-- Client Drawer -->
    <DsDrawer v-model:visible="drawerVisible" :header="editingClient ? 'Editar Cliente' : 'Nuevo Cliente'">
      <div class="space-y-4">
        <DsFormField label="Nombre / Razón Social" required>
          <DsInput v-model="form.name" placeholder="Ej. Empresa SA de CV" />
        </DsFormField>
        <div class="grid grid-cols-2 gap-4">
          <DsFormField label="Teléfono">
            <DsInput v-model="form.phone" placeholder="10 dígitos" />
          </DsFormField>
          <DsFormField label="Correo Electrónico">
            <DsInput v-model="form.email" placeholder="correo@dominio.com" />
          </DsFormField>
        </div>
        <DsFormField label="RFC">
          <DsInput v-model="form.rfc" placeholder="Opcional" class="uppercase" />
        </DsFormField>
      </div>
      <div class="mt-8 flex justify-end gap-3">
        <DsButton label="Cancelar" variant="secondary" @click="drawerVisible = false" />
        <DsButton label="Guardar" variant="primary" icon="pi pi-save" :loading="saving" @click="saveClient" />
      </div>
    </DsDrawer>

    <!-- Client Dossier Modal -->
    <DsModal v-model:visible="dossierVisible" header="Expediente de Cliente" size="lg">
      <div class="p-4" v-if="selectedDossierClient">
        <h3 class="font-bold text-lg mb-4">{{ selectedDossierClient.name }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="bg-surface-50 dark:bg-surface-900 p-4 rounded-xl border border-surface-200 dark:border-surface-700">
              <p class="font-bold text-sm mb-2">Acta Constitutiva o Poder</p>
              <FileUploader 
                :clientId="selectedDossierClient.id" 
                documentType="ACTA"
                @upload-complete="fetchClients"
              />
            </div>
            <div class="bg-surface-50 dark:bg-surface-900 p-4 rounded-xl border border-surface-200 dark:border-surface-700">
              <p class="font-bold text-sm mb-2">INE / Identificación</p>
              <FileUploader 
                :clientId="selectedDossierClient.id" 
                documentType="INE"
                @upload-complete="fetchClients"
              />
            </div>
          </div>
          <div class="space-y-4">
            <div class="bg-surface-50 dark:bg-surface-900 p-4 rounded-xl border border-surface-200 dark:border-surface-700">
              <p class="font-bold text-sm mb-2">Comprobante de Domicilio</p>
              <FileUploader 
                :clientId="selectedDossierClient.id" 
                documentType="DOMICILIO"
                @upload-complete="fetchClients"
              />
            </div>
            <div class="bg-surface-50 dark:bg-surface-900 p-4 rounded-xl border border-surface-200 dark:border-surface-700">
              <p class="font-bold text-sm mb-2">Constancia de Situación Fiscal</p>
              <FileUploader 
                :clientId="selectedDossierClient.id" 
                documentType="CSF"
                @upload-complete="fetchClients"
              />
            </div>
          </div>
        </div>
      </div>
    </DsModal>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { clientService, type Client } from '../services/clientService';
import DsPageHeader from '../components/ui/DsPageHeader.vue';
import DsButton from '../components/ui/DsButton.vue';
import DsTable from '../components/ui/DsTable.vue';
import DsColumn from '../components/ui/DsColumn.vue';
import DsStatusBadge from '../components/ui/DsStatusBadge.vue';
import DsSearchBar from '../components/ui/DsSearchBar.vue';
import DsDrawer from '../components/ui/DsDrawer.vue';
import DsModal from '../components/ui/DsModal.vue';
import DsFormField from '../components/ui/DsFormField.vue';
import DsInput from '../components/ui/DsInput.vue';
import DsLoadingState from '../components/ui/DsLoadingState.vue';
import FileUploader from '../components/FileUploader.vue';

const clients = ref<Client[]>([]);
const loading = ref(true);
const searchQuery = ref('');

const drawerVisible = ref(false);
const editingClient = ref<Client | null>(null);
const saving = ref(false);
const form = ref({
  name: '',
  phone: '',
  email: '',
  rfc: ''
});

const dossierVisible = ref(false);
const selectedDossierClient = ref<Client | null>(null);

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value;
  const q = searchQuery.value.toLowerCase();
  return clients.value.filter(c => 
    c.name.toLowerCase().includes(q) || 
    (c.email && c.email.toLowerCase().includes(q)) || 
    (c.rfc && c.rfc.toLowerCase().includes(q))
  );
});

const fetchClients = async () => {
  loading.value = true;
  try {
    clients.value = await clientService.getAll();
  } catch (error) {
    console.error("Failed to fetch clients", error);
  } finally {
    loading.value = false;
  }
};

const openCreateDrawer = () => {
  editingClient.value = null;
  form.value = { name: '', phone: '', email: '', rfc: '' };
  drawerVisible.value = true;
};

const openEditDrawer = (client: Client) => {
  editingClient.value = client;
  form.value = { 
    name: client.name, 
    phone: client.phone || '', 
    email: client.email || '', 
    rfc: client.rfc || '' 
  };
  drawerVisible.value = true;
};

const saveClient = async () => {
  saving.value = true;
  try {
    if (editingClient.value) {
      await clientService.update(editingClient.value.id, form.value);
    } else {
      await clientService.create(form.value);
    }
    drawerVisible.value = false;
    fetchClients();
  } catch (error) {
    console.error("Failed to save client", error);
  } finally {
    saving.value = false;
  }
};

const openDossierModal = (client: Client) => {
  selectedDossierClient.value = client;
  dossierVisible.value = true;
};

onMounted(() => {
  fetchClients();
});
</script>

