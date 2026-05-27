<template>
  <div class="doc-req-builder">
    <div class="view-header mb-4">
      <div class="flex justify-content-between align-items-center">
        <div>
          <h1 class="title">Document Requirements Builder</h1>
          <p class="subtitle">Gobernanza de expedientes. Alimenta directamente al Eligibility Engine.</p>
        </div>
        <DsButton label="Nuevo Requisito" icon="pi pi-plus" @click="openCreate" v-permission="'config.manage'" />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center p-8">
       <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else class="grid">
      <!-- Persona Física -->
      <div class="col-12 lg:col-6">
         <div class="card h-full">
            <h3 class="m-0 mb-3 text-surface-800 dark:text-surface-100 border-bottom pb-2">Expediente: Persona Física</h3>
            <ul class="list-none p-0 m-0">
               <li v-for="req in pfReqs" :key="req.id" class="p-3 border-bottom flex justify-content-between align-items-center hover-bg">
                 <div>
                    <span class="font-bold block text-surface-800 dark:text-surface-100">{{ req.name }}</span>
                    <span class="text-xs text-surface-500 dark:text-surface-400">{{ req.description || 'Sin descripción' }} | {{ req.is_required ? 'Obligatorio' : 'Opcional' }}</span>
                 </div>
                 <div class="flex gap-2">
                    <DsTag severity="danger" value="Bloqueante" title="El Eligibility Engine bloqueará cotizaciones si falta" v-if="req.is_blocking" />
                    <DsButton icon="pi pi-pencil" class="p-button-text p-button-sm p-button-secondary" @click="openEdit(req)" v-permission="'config.manage'" />
                    <DsButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="deleteReq(req.id!)" v-permission="'config.manage'" />
                 </div>
               </li>
               <li v-if="pfReqs.length === 0" class="p-3 text-center text-sm text-surface-400">Sin requisitos configurados.</li>
            </ul>
         </div>
      </div>

      <!-- Persona Moral -->
      <div class="col-12 lg:col-6">
         <div class="card h-full">
            <h3 class="m-0 mb-3 text-surface-800 dark:text-surface-100 border-bottom pb-2">Expediente: Persona Moral</h3>
            <ul class="list-none p-0 m-0">
               <li v-for="req in pmReqs" :key="req.id" class="p-3 border-bottom flex justify-content-between align-items-center hover-bg">
                 <div>
                    <span class="font-bold block text-surface-800 dark:text-surface-100">{{ req.name }}</span>
                    <span class="text-xs text-surface-500 dark:text-surface-400">{{ req.description || 'Sin descripción' }} | {{ req.is_required ? 'Obligatorio' : 'Opcional' }}</span>
                 </div>
                 <div class="flex gap-2">
                    <DsTag severity="danger" value="Bloqueante" title="El Eligibility Engine bloqueará cotizaciones si falta" v-if="req.is_blocking" />
                    <DsButton icon="pi pi-pencil" class="p-button-text p-button-sm p-button-secondary" @click="openEdit(req)" v-permission="'config.manage'" />
                    <DsButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="deleteReq(req.id!)" v-permission="'config.manage'" />
                 </div>
               </li>
               <li v-if="pmReqs.length === 0" class="p-3 text-center text-sm text-surface-400">Sin requisitos configurados.</li>
            </ul>
         </div>
      </div>
    </div>
    
    <DsModal v-model:visible="formDialog" :header="editingReq.id ? 'Editar Requisito' : 'Nuevo Requisito'" modal class="!w-full md:!w-[500px]">
       <div class="flex flex-col gap-4 pt-4">
          <div class="field">
             <label class="font-semibold block mb-2">Nombre del Requisito</label>
             <DsInput v-model="editingReq.name" class="w-full" placeholder="Ej. Identificación Oficial" />
          </div>
          <div class="field">
             <label class="font-semibold block mb-2">Descripción</label>
             <textarea v-model="editingReq.description" class="w-full p-2 border rounded" rows="2" placeholder="Detalles o instrucciones"></textarea>
          </div>
          <div class="field">
             <label class="font-semibold block mb-2">Aplica Para</label>
             <select v-model="editingReq.person_type" class="w-full p-2 border rounded">
                <option value="Fisica">Persona Física</option>
                <option value="Moral">Persona Moral</option>
                <option value="Ambas">Ambas</option>
             </select>
          </div>
          <div class="flex justify-between items-center bg-surface-50 p-3 rounded">
             <div>
                <label class="font-semibold block">Requerido</label>
                <span class="text-xs text-surface-500">¿Es obligatorio subirlo?</span>
             </div>
             <ToggleSwitch v-model="editingReq.is_required" />
          </div>
          <div class="flex justify-between items-center bg-surface-50 p-3 rounded">
             <div>
                <label class="font-semibold block text-red-600">Bloqueante</label>
                <span class="text-xs text-surface-500">¿Detiene cotizaciones si falta?</span>
             </div>
             <ToggleSwitch v-model="editingReq.is_blocking" />
          </div>
       </div>
       <template #footer>
          <DsButton label="Cancelar" text @click="formDialog = false" />
          <DsButton label="Guardar" @click="saveReq" :loading="saving" />
       </template>
    </DsModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { documentRequirementService, type DocumentRequirement } from '../services/documentRequirementService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const reqs = ref<DocumentRequirement[]>([]);
const loading = ref(false);
const saving = ref(false);

const formDialog = ref(false);
const editingReq = ref<Partial<DocumentRequirement>>({
  name: '',
  description: '',
  person_type: 'Ambas',
  is_required: true,
  is_blocking: false,
  validity_days: 365
});

const loadData = async () => {
  loading.value = true;
  try {
    reqs.value = await documentRequirementService.getRequirements();
  } catch (error) {
    console.error('Error loading document requirements:', error);
    // Silent fail for demo if backend is not ready
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);

const pfReqs = computed(() => reqs.value.filter(r => r.person_type === 'Fisica' || r.person_type === 'Ambas'));
const pmReqs = computed(() => reqs.value.filter(r => r.person_type === 'Moral' || r.person_type === 'Ambas'));

const openCreate = () => {
  editingReq.value = { name: '', description: '', person_type: 'Ambas', is_required: true, is_blocking: false, validity_days: 365 };
  formDialog.value = true;
};

const openEdit = (req: DocumentRequirement) => {
  editingReq.value = { ...req };
  formDialog.value = true;
};

const saveReq = async () => {
  if (!editingReq.value.name) return;
  saving.value = true;
  try {
    if (editingReq.value.id) {
      await documentRequirementService.updateRequirement(editingReq.value.id, editingReq.value);
    } else {
      await documentRequirementService.createRequirement(editingReq.value);
    }
    formDialog.value = false;
    await loadData();
    toast.add({ severity: 'success', summary: 'Guardado', detail: 'Requisito actualizado', life: 3000 });
  } catch (err) {
    console.error(err);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el requisito', life: 3000 });
  } finally {
    saving.value = false;
  }
};

const deleteReq = async (id: string) => {
  if (!confirm('¿Eliminar este requisito?')) return;
  try {
    await documentRequirementService.deleteRequirement(id);
    await loadData();
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Requisito eliminado', life: 3000 });
  } catch (err) {
    console.error(err);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar', life: 3000 });
  }
};
</script>

<style scoped>
.doc-req-builder { display: flex; flex-direction: column; gap: 1rem; }
.card { background: var(--tenant-surface-0); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid var(--tenant-surface-200); }
.dark .card { background: var(--tenant-surface-900); border-color: var(--tenant-surface-700); }
.title { margin: 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.subtitle { margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #64748b; }
.border-bottom { border-bottom: 1px solid #e2e8f0; }
.hover-bg:hover { background-color: #f8fafc; }

/* Grid Utils */
.grid { display: flex; flex-wrap: wrap; margin: -1rem; }
.col-12 { padding: 1rem; width: 100%; }
@media (min-width: 1024px) { 
  .lg\:col-6 { width: 50%; }
}
.flex { display: flex; }
.flex-column { flex-direction: column; }
.align-items-center { align-items: center; }
.justify-content-between { justify-content: space-between; }
.m-0 { margin: 0; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.pb-2 { padding-bottom: 0.5rem; }
.p-0 { padding: 0; }
.p-3 { padding: 0.75rem; }
.block { display: block; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.font-bold { font-weight: 700; }
.h-full { height: 100%; }
.list-none { list-style: none; }
.gap-2 { gap: 0.5rem; }

/* Colors */
.text-surface-800 { color: #1e293b; }
.text-surface-500 { color: #64748b; }
</style>




