<template>
  <div class="rule-builder">
    <div class="view-header mb-4">
      <h1 class="title">Universal Rule Builder</h1>
      <p class="subtitle">Editor Visual de Lógica de Negocio. (Elegibilidad, Promociones, Precios, Ocupación)</p>
    </div>

    <div class="grid">
      <!-- Left Panel: Rules List -->
      <div class="col-12 lg:col-4">
        <div class="card h-full">
           <div class="flex justify-content-between align-items-center mb-3">
             <h3 class="m-0">Reglas Activas</h3>
             <Button icon="pi pi-plus" size="small" outlined aria-label="Nueva Regla" @click="createNewRule" v-permission="'config.manage'" />
           </div>

           <div class="mb-3">
             <input type="text" placeholder="Buscar regla..." class="w-full p-2 border-round border-1 border-slate-300" v-model="searchQuery" />
           </div>

           <ul class="list-none p-0 m-0">
             <li v-for="rule in filteredRules" :key="rule.id" class="p-3 border-bottom flex justify-content-between align-items-center hover-bg cursor-pointer" :class="{'bg-blue-50 border-blue-200': activeRule?.id === rule.id}" @click="selectRule(rule)">
                <div>
                   <span class="font-bold block text-slate-800">{{ rule.name }}</span>
                   <span class="text-xs text-slate-500 block">Tipo: {{ rule.rule_type }} | v{{ rule.version || 1 }}</span>
                   <span v-if="rule.is_exclusive" class="text-xs text-red-500 font-bold"><i class="pi pi-bolt"></i> Excluyente</span>
                </div>
                <i class="pi pi-chevron-right text-slate-400"></i>
             </li>
             <li v-if="filteredRules.length === 0" class="p-3 text-center text-slate-400 text-sm">
               No se encontraron reglas.
             </li>
           </ul>
        </div>
      </div>

      <!-- Right Panel: Editor -->
      <div class="col-12 lg:col-8">
        <div class="card h-full flex flex-column">
           <div v-if="!activeRule" class="flex align-items-center justify-content-center h-full text-slate-400">
             Seleccione o cree una regla para comenzar a editar.
           </div>
           
           <div v-else class="flex-1 flex flex-column">
             <!-- Editor Header -->
             <div class="flex justify-content-between align-items-start mb-4 border-bottom pb-3">
               <div class="flex-1 pr-3">
                 <input type="text" v-model="activeRule.name" class="title-input w-full font-bold text-xl mb-2" placeholder="Nombre de la regla" :disabled="!canEdit" />
                 <textarea v-model="activeRule.description" class="w-full p-2 border-round border-1 border-slate-300 text-sm" rows="2" placeholder="Descripción obligatoria..." :disabled="!canEdit"></textarea>
               </div>
               <div class="flex flex-column gap-2 text-right">
                 <Tag :severity="activeRule.status === 'active' ? 'success' : 'warning'" :value="activeRule.status.toUpperCase()" />
                 <span class="text-xs text-slate-500 font-mono">Versión actual: {{ activeRule.version || 1 }}</span>
                 <div class="flex gap-2 justify-content-end mt-2" v-if="canEdit">
                   <Button label="Simular" icon="pi pi-play" class="p-button-outlined" size="small" />
                   <Button label="Guardar & Versionar" icon="pi pi-save" size="small" severity="success" @click="saveRule" :loading="saving" />
                 </div>
               </div>
             </div>

             <!-- Rule Configuration Form -->
             <div class="grid mb-4">
                <div class="col-12 lg:col-6">
                  <label class="block text-sm font-bold text-slate-700 mb-1">Tipo de Regla</label>
                  <select v-model="activeRule.rule_type" class="w-full p-2 border-round border-1 border-slate-300" :disabled="!canEdit">
                    <option value="pricing">Pricing (Recargos/Descuentos)</option>
                    <option value="eligibility">Elegibilidad (Bloqueos)</option>
                    <option value="promotion">Promoción</option>
                    <option value="occupancy">Ocupación / Disponibilidad</option>
                  </select>
                </div>
                <div class="col-12 lg:col-3 flex align-items-end">
                   <div class="flex align-items-center mb-2">
                     <input type="checkbox" id="isExcl" v-model="activeRule.is_exclusive" class="mr-2" :disabled="!canEdit" />
                     <label for="isExcl" class="text-sm font-bold text-red-600" title="Si aplica, descarta otras reglas similares">Excluyente</label>
                   </div>
                </div>
                <div class="col-12 lg:col-3 flex align-items-end">
                   <div class="flex align-items-center mb-2">
                     <input type="checkbox" id="stopProc" v-model="activeRule.stop_processing" class="mr-2" :disabled="!canEdit" />
                     <label for="stopProc" class="text-sm font-bold text-orange-600" title="Si aplica, aborta la evaluación inmediatamente">Hard Abort</label>
                   </div>
                </div>
             </div>

             <!-- LÓGICA VISUAL BUILDER (Mock UI representation of AST) -->
             <div class="logic-builder bg-slate-50 border-1 border-slate-200 border-round p-3 flex-1 overflow-auto">
                <h4 class="m-0 mb-3 text-slate-600"><i class="pi pi-sitemap mr-2"></i>Árbol de Condiciones</h4>
                
                <div class="condition-group p-3 border-1 border-blue-200 bg-white border-round relative mb-3">
                   <div class="absolute bg-blue-100 text-blue-800 font-bold px-2 py-1 text-xs border-round" style="top: -10px; left: 10px;">AND (Todas deben cumplirse)</div>
                   
                   <div class="condition-row flex gap-2 align-items-center mt-3 mb-2">
                     <select class="p-2 border-round border-1 border-slate-300 flex-1 text-sm" :disabled="!canEdit">
                       <option>context.cliente.tipo_persona</option>
                       <option>context.espacio.categoria</option>
                       <option>context.fechas.dia_semana</option>
                     </select>
                     <select class="p-2 border-round border-1 border-slate-300 text-sm" :disabled="!canEdit">
                       <option>EQUALS</option>
                       <option>CONTAINS</option>
                       <option>GREATER_THAN</option>
                     </select>
                     <input type="text" class="p-2 border-round border-1 border-slate-300 flex-1 text-sm" value="Moral" :disabled="!canEdit" />
                     <Button icon="pi pi-trash" class="p-button-danger p-button-text" size="small" v-if="canEdit" />
                   </div>

                   <div class="condition-row flex gap-2 align-items-center mb-2">
                     <select class="p-2 border-round border-1 border-slate-300 flex-1 text-sm" :disabled="!canEdit">
                       <option>context.espacio.categoria</option>
                     </select>
                     <select class="p-2 border-round border-1 border-slate-300 text-sm" :disabled="!canEdit">
                       <option>EQUALS</option>
                     </select>
                     <input type="text" class="p-2 border-round border-1 border-slate-300 flex-1 text-sm" value="Salón" :disabled="!canEdit" />
                     <Button icon="pi pi-trash" class="p-button-danger p-button-text" size="small" v-if="canEdit" />
                   </div>

                   <Button label="Agregar Condición" icon="pi pi-plus" class="p-button-text p-button-sm mt-2" v-if="canEdit" />
                   <Button label="Agregar Sub-Grupo (OR)" icon="pi pi-sitemap" class="p-button-text p-button-sm p-button-secondary mt-2" v-if="canEdit" />
                </div>
                
                <h4 class="m-0 mb-3 mt-4 text-slate-600"><i class="pi pi-bolt mr-2"></i>Acción Resultante</h4>
                <div class="flex gap-3">
                  <div class="flex-1">
                    <label class="block text-xs font-bold text-slate-500 mb-1">Tipo de Acción</label>
                    <select class="w-full p-2 border-round border-1 border-slate-300" :disabled="!canEdit">
                      <option>block (Rechazar)</option>
                      <option>surcharge_percentage (Recargo %)</option>
                      <option>discount_fixed (Descuento Fijo)</option>
                    </select>
                  </div>
                  <div class="flex-1">
                    <label class="block text-xs font-bold text-slate-500 mb-1">Valor / Mensaje</label>
                    <input type="text" class="w-full p-2 border-round border-1 border-slate-300" value="Cliente bloqueado por ser Persona Moral en Salón" :disabled="!canEdit" />
                  </div>
                </div>

             </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { pb } from '../services/pb';
import { useTenantStore } from '../stores/tenant';
import { usePermissionsStore } from '../stores/permissions';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const tenantStore = useTenantStore();
const permissionsStore = usePermissionsStore();
const rules = ref<any[]>([]);
const activeRule = ref<any>(null);
const searchQuery = ref('');
const saving = ref(false);

const canEdit = computed(() => permissionsStore.can('config.manage'));

const filteredRules = computed(() => {
  if(!searchQuery.value) return rules.value;
  return rules.value.filter(r => r.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

onMounted(async () => {
  if(tenantStore.activeTenantId) {
    rules.value = await pb.collection('rule_registry').getFullList({
      filter: `tenant = "${tenantStore.activeTenantId}"`,
      sort: '-created'
    });
  }
});

const selectRule = (rule: any) => {
  activeRule.value = JSON.parse(JSON.stringify(rule)); // Clone to avoid mutating list directly
};

const createNewRule = () => {
  activeRule.value = {
    tenant: tenantStore.activeTenantId,
    name: 'Nueva Regla',
    description: '',
    rule_type: 'eligibility',
    status: 'draft',
    version: 1,
    priority: 100,
    is_exclusive: false,
    stop_processing: false,
    conditions_ast: {},
    action: {}
  };
};

const saveRule = async () => {
  saving.value = true;
  try {
    if(activeRule.value.id) {
      // ESTRATEGIA DE VERSIONADO EXIGIDA
      // 1. Archivar la actual
      await pb.collection('rule_registry').update(activeRule.value.id, { status: 'archived' });
      
      // 2. Crear nueva versión clonada
      const newVersion = { ...activeRule.value };
      delete newVersion.id;
      delete newVersion.created;
      delete newVersion.updated;
      newVersion.version = (newVersion.version || 1) + 1;
      newVersion.status = 'active';

      const saved = await pb.collection('rule_registry').create(newVersion);
      
      // 3. Auditoría obligatoria
      await pb.collection('admin_audit_log').create({
         tenant: tenantStore.activeTenantId,
         user: pb.authStore.model?.id,
         action: 'RULE_VERSION_UPDATE',
         entity_type: 'rule_registry',
         entity_id: saved.id,
         description: `Regla actualizada de v${activeRule.value.version} a v${newVersion.version}`
      });

      // Recargar
      activeRule.value = saved;
      rules.value = await pb.collection('rule_registry').getFullList({ filter: `tenant = "${tenantStore.activeTenantId}"`, sort: '-created' });

    } else {
      activeRule.value.status = 'active';
      const saved = await pb.collection('rule_registry').create(activeRule.value);
      
      await pb.collection('admin_audit_log').create({
         tenant: tenantStore.activeTenantId,
         user: pb.authStore.model?.id,
         action: 'RULE_CREATE',
         entity_type: 'rule_registry',
         entity_id: saved.id,
         description: `Regla creada: ${saved.name}`
      });

      activeRule.value = saved;
      rules.value.unshift(saved);
    }
    alert("Regla guardada y versionada correctamente.");
  } catch(e) {
    console.error(e);
    alert("Error al guardar regla.");
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.rule-builder { display: flex; flex-direction: column; gap: 1rem; }
.card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
.title { margin: 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.subtitle { margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #64748b; }
.border-bottom { border-bottom: 1px solid #e2e8f0; }
.hover-bg:hover { background-color: #f8fafc; }
.cursor-pointer { cursor: pointer; }
.title-input { border: none; border-bottom: 2px solid transparent; outline: none; background: transparent; padding: 0.25rem 0; transition: border-color 0.2s; }
.title-input:focus { border-bottom-color: #3b82f6; }

/* Grid Utils */
.grid { display: flex; flex-wrap: wrap; margin: -1rem; }
.col-12 { padding: 1rem; width: 100%; }
@media (min-width: 1024px) { 
  .lg\:col-3 { width: 25%; }
  .lg\:col-4 { width: 33.333333%; }
  .lg\:col-6 { width: 50%; }
  .lg\:col-8 { width: 66.666667%; }
}
.flex { display: flex; }
.flex-column { flex-direction: column; }
.flex-1 { flex: 1; }
.align-items-center { align-items: center; }
.align-items-start { align-items: flex-start; }
.align-items-end { align-items: flex-end; }
.justify-content-between { justify-content: space-between; }
.justify-content-center { justify-content: center; }
.justify-content-end { justify-content: flex-end; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 1rem; }
.m-0 { margin: 0; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1.5rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.pb-1 { padding-bottom: 0.25rem; }
.pb-3 { padding-bottom: 0.75rem; }
.pr-3 { padding-right: 0.75rem; }
.p-0 { padding: 0; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.mr-2 { margin-right: 0.5rem; }
.block { display: block; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.text-xl { font-size: 1.25rem; }
.font-bold { font-weight: 700; }
.font-mono { font-family: monospace; }
.uppercase { text-transform: uppercase; }
.text-right { text-align: right; }
.h-full { height: 100%; }
.w-full { width: 100%; }
.list-none { list-style: none; }
.text-center { text-align: center; }
.border-round { border-radius: 0.5rem; }
.border-1 { border-width: 1px; border-style: solid; }
.overflow-auto { overflow: auto; }
.absolute { position: absolute; }
.relative { position: relative; }

/* Colors */
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.text-slate-600 { color: #475569; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.text-red-500 { color: #ef4444; }
.text-red-600 { color: #dc2626; }
.text-orange-600 { color: #ea580c; }
.text-blue-800 { color: #1e40af; }
.bg-blue-50 { background-color: #eff6ff; }
.bg-blue-100 { background-color: #dbeafe; }
.bg-slate-50 { background-color: #f8fafc; }
.bg-white { background-color: #ffffff; }
.border-blue-200 { border-color: #bfdbfe; }
.border-slate-200 { border-color: #e2e8f0; }
.border-slate-300 { border-color: #cbd5e1; }
</style>
