<template>
  <div class="catalog-view">
    <div class="view-header">
      <div>
        <h1 class="title">Catálogo de Espacios</h1>
        <p class="subtitle">Gestión de inventario físico y publicitario</p>
      </div>
      <Button label="Nuevo Espacio" icon="pi pi-plus" @click="openNew" class="p-button-primary" v-if="isAdmin" />
    </div>

    <!-- Data Table / Grid -->
    <div class="card mt-4">
      <DataTable 
        :value="espacios" 
        :paginator="true" 
        :rows="10" 
        dataKey="id" 
        :loading="loading"
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['nombre', 'tipo']"
        responsiveLayout="scroll"
        emptyMessage="No se encontraron espacios."
      >
        <template #header>
          <div class="flex justify-content-between align-items-center">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Buscar espacio..." />
            </span>
          </div>
        </template>
        
        <Column field="nombre" header="Nombre del Espacio" sortable>
          <template #body="slotProps">
            <div class="flex align-items-center gap-2">
              <i :class="getIconForType(slotProps.data.tipo)" class="text-primary text-xl"></i>
              <span class="font-bold">{{ slotProps.data.nombre }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="tipo" header="Tipo" sortable>
          <template #body="slotProps">
            <Tag :severity="getTypeSeverity(slotProps.data.tipo)" :value="slotProps.data.tipo" />
          </template>
        </Column>

        <Column field="precio_base" header="Precio Base" sortable>
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.precio_base) }}
          </template>
        </Column>
        
        <Column field="activo" header="Estado" sortable>
          <template #body="slotProps">
            <Tag :severity="slotProps.data.activo ? 'success' : 'danger'" :value="slotProps.data.activo ? 'Activo' : 'Inactivo'" />
          </template>
        </Column>

        <Column header="Acciones" :exportable="false" style="min-width:8rem" v-if="isAdmin">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-success mr-2" @click="editSpace(slotProps.data)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDelete(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Edit/Create Dialog -->
    <Dialog v-model:visible="showDialog" :header="isEditing ? 'Editar Espacio' : 'Nuevo Espacio'" :modal="true" class="p-fluid" :style="{width: '600px'}">
      
      <TabView>
        <TabPanel header="Información General" value="0">
          <div class="field mb-3">
            <label for="nombre">Nombre</label>
            <InputText id="nombre" v-model.trim="spaceForm.nombre" required="true" autofocus />
            <small class="p-error" v-if="submitted && !spaceForm.nombre">El nombre es requerido.</small>
          </div>
          
          <div class="field mb-3">
            <label for="tipo">Tipo de Espacio</label>
            <select v-model="spaceForm.tipo" id="tipo" class="p-inputtext p-component custom-select">
              <option value="Salon Físico">Salón Físico</option>
              <option value="Cartelera">Cartelera Publicitaria</option>
              <option value="Pantalla Digital">Pantalla Digital</option>
              <option value="Explanada">Explanada / Abierto</option>
            </select>
          </div>

          <div class="field mb-4">
            <label for="precio_base">Precio Base (MXN)</label>
            <InputNumber id="precio_base" v-model="spaceForm.precio_base" mode="currency" currency="MXN" locale="es-MX" />
          </div>

          <div class="field-checkbox">
            <Checkbox inputId="activo" v-model="spaceForm.activo" :binary="true" />
            <label for="activo" class="ml-2">Espacio Activo (Disponible para Cotizar)</label>
          </div>
        </TabPanel>

        <TabPanel header="Configuración B2B (Avanzado)" value="1">
          <p class="text-sm text-slate-500 mb-3">
            Configura reglas de negocio en formato JSON para este espacio (ej. reglas de premontaje, horas extra, bloqueos de días).
          </p>
          <div class="field">
            <Textarea v-model="b2bConfigText" rows="10" class="font-mono text-sm" placeholder='{\n  "aplica_premontaje": true,\n  "premontaje_pct": 25\n}' />
            <small class="p-error" v-if="jsonError">{{ jsonError }}</small>
          </div>
        </TabPanel>
      </TabView>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-primary" @click="saveSpace" :loading="saving" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { pb, getActiveUser } from '../services/pb';
import { useTenantStore } from '../stores/tenant';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Checkbox from 'primevue/checkbox';
import Textarea from 'primevue/textarea';

const tenantStore = useTenantStore();
const activeUser = getActiveUser();
const isAdmin = computed(() => activeUser?.role === 'admin');

// State
const espacios = ref<any[]>([]);
const loading = ref(true);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Dialog
const showDialog = ref(false);
const isEditing = ref(false);
const submitted = ref(false);
const saving = ref(false);
const jsonError = ref('');

const spaceForm = ref({
  id: '',
  nombre: '',
  tipo: 'Salon Físico',
  precio_base: 0,
  activo: true
});
const b2bConfigText = ref('{}');

const formatCurrency = (value: number) => {
  return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

const getIconForType = (type: string) => {
  if (type.includes('Salon')) return 'pi pi-building';
  if (type.includes('Pantalla')) return 'pi pi-desktop';
  if (type.includes('Cartelera')) return 'pi pi-image';
  return 'pi pi-map';
};

const getTypeSeverity = (type: string) => {
  if (type.includes('Salon')) return 'info';
  if (type.includes('Pantalla')) return 'success';
  if (type.includes('Cartelera')) return 'warning';
  return 'secondary';
};

// Fetching
const fetchSpaces = async () => {
  if (!tenantStore.activeTenantId) return;
  loading.value = true;
  try {
    const records = await pb.collection('espacios').getFullList({
      filter: `tenant = "${tenantStore.activeTenantId}"`,
      sort: '-created'
    });
    espacios.value = records;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

watch(() => tenantStore.activeTenantId, () => {
  fetchSpaces();
});

onMounted(() => {
  fetchSpaces();
});

// Actions
const openNew = () => {
  spaceForm.value = {
    id: '',
    nombre: '',
    tipo: 'Salon Físico',
    precio_base: 0,
    activo: true
  };
  b2bConfigText.value = '{\n  "aplica_premontaje": false\n}';
  isEditing.value = false;
  submitted.value = false;
  showDialog.value = true;
};

const editSpace = (space: any) => {
  spaceForm.value = {
    id: space.id,
    nombre: space.nombre,
    tipo: space.tipo,
    precio_base: space.precio_base,
    activo: space.activo
  };
  b2bConfigText.value = JSON.stringify(space.config_b2b || {}, null, 2);
  isEditing.value = true;
  submitted.value = false;
  showDialog.value = true;
};

const hideDialog = () => {
  showDialog.value = false;
  submitted.value = false;
  jsonError.value = '';
};

const saveSpace = async () => {
  submitted.value = true;
  jsonError.value = '';

  if (!spaceForm.value.nombre) return;

  let parsedConfig = {};
  try {
    parsedConfig = JSON.parse(b2bConfigText.value || '{}');
  } catch (e) {
    jsonError.value = 'Formato JSON inválido. Verifique la sintaxis.';
    return;
  }

  saving.value = true;
  try {
    const data = {
      tenant: tenantStore.activeTenantId,
      nombre: spaceForm.value.nombre,
      tipo: spaceForm.value.tipo,
      precio_base: spaceForm.value.precio_base,
      activo: spaceForm.value.activo,
      config_b2b: parsedConfig
    };

    if (isEditing.value) {
      await pb.collection('espacios').update(spaceForm.value.id, data);
    } else {
      await pb.collection('espacios').create(data);
    }
    
    hideDialog();
    fetchSpaces();
  } catch (err) {
    console.error(err);
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (space: any) => {
  if (confirm(`¿Está seguro de eliminar el espacio ${space.nombre}?`)) {
    try {
      await pb.collection('espacios').delete(space.id);
      fetchSpaces();
    } catch (err) {
      console.error(err);
    }
  }
};
</script>

<style scoped>
.catalog-view {
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

.font-mono {
  font-family: monospace;
}

.custom-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background-color: #ffffff;
}

/* Flex utils */
.flex { display: flex; }
.justify-content-between { justify-content: space-between; }
.align-items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mr-2 { margin-right: 0.5rem; }
.ml-2 { margin-left: 0.5rem; }
.text-primary { color: #3b82f6; }
</style>
