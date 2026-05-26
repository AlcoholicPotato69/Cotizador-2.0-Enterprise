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
             <DsButton icon="pi pi-plus" size="small" outlined aria-label="Nueva Regla" @click="createNewRule" v-permission="'config.manage'" />
           </div>

           <div class="mb-3">
             <input type="text" placeholder="Buscar regla..." class="w-full p-2 border-round border-1 border-surface-300 dark:border-surface-600" v-model="searchQuery" />
           </div>

           <ul class="list-none p-0 m-0">
             <li v-for="rule in filteredRules" :key="rule.id" class="p-3 border-bottom flex justify-content-between align-items-center hover-bg cursor-pointer" :class="{'bg-primary-50 dark:bg-primary-900 border-blue-200': activeRule?.id === rule.id}" @click="selectRule(rule)">
                <div>
                   <span class="font-bold block text-surface-800 dark:text-surface-100">{{ rule.name }}</span>
                   <span class="text-xs text-surface-500 dark:text-surface-400 block">Tipo: {{ rule.rule_type }} | v{{ rule.version || 1 }}</span>
                   <span v-if="rule.is_exclusive" class="text-xs text-red-500 font-bold"><i class="pi pi-bolt"></i> Excluyente</span>
                </div>
                <i class="pi pi-chevron-right text-surface-400 dark:text-surface-500"></i>
             </li>
             <li v-if="filteredRules.length === 0" class="p-3 text-center text-surface-400 dark:text-surface-500 text-sm">
               No se encontraron reglas.
             </li>
           </ul>
        </div>
      </div>

      <!-- Right Panel: Editor -->
      <div class="col-12 lg:col-8">
        <div class="card h-full flex flex-column">
           <div v-if="!activeRule" class="flex align-items-center justify-content-center h-full text-surface-400 dark:text-surface-500">
             Seleccione o cree una regla para comenzar a editar.
           </div>
           
           <div v-else class="flex-1 flex flex-column">
             <!-- Editor Header -->
             <div class="flex justify-content-between align-items-start mb-4 border-bottom pb-3">
               <div class="flex-1 pr-3">
                 <input type="text" v-model="activeRule.name" class="title-input w-full font-bold text-xl mb-2" placeholder="Nombre de la regla" :disabled="!canEdit" />
                 <textarea v-model="activeRule.description" class="w-full p-2 border-round border-1 border-surface-300 dark:border-surface-600 text-sm" rows="2" placeholder="Descripción obligatoria..." :disabled="!canEdit"></textarea>
               </div>
               <div class="flex flex-column gap-2 text-right">
                 <DsTag :severity="activeRule.status === 'active' ? 'success' : 'warning'" :value="activeRule.status.toUpperCase()" />
                 <span class="text-xs text-surface-500 dark:text-surface-400 font-mono">Versión actual: {{ activeRule.version || 1 }}</span>
                 <div class="flex gap-2 justify-content-end mt-2" v-if="canEdit">
                   <DsButton label="Simular" icon="pi pi-play" class="p-button-outlined" size="small" />
                   <DsButton label="Guardar & Versionar" icon="pi pi-save" size="small" severity="success" @click="saveRule" :loading="saving" />
                 </div>
               </div>
             </div>

             <!-- Rule Configuration Form -->
             <div class="grid mb-4">
                <div class="col-12 lg:col-6">
                  <label class="block text-sm font-bold text-surface-700 dark:text-surface-200 mb-1">Tipo de Regla</label>
                  <select v-model="activeRule.rule_type" class="w-full p-2 border-round border-1 border-surface-300 dark:border-surface-600" :disabled="!canEdit">
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

             <!-- LÓGICA VISUAL BUILDER (AST) -->
             <div class="logic-builder bg-surface-50 dark:bg-surface-950 border-1 border-surface-200 dark:border-surface-700 border-round p-3 flex-1 overflow-auto">
                <h4 class="m-0 mb-3 text-surface-600 dark:text-surface-300"><i class="pi pi-sitemap mr-2"></i>Árbol de Condiciones</h4>
                
                <RuleConditionGroup 
                  v-if="activeRule.conditions_ast" 
                  v-model="activeRule.conditions_ast" 
                  :canEdit="canEdit" 
                  :isRoot="true" 
                />
                
                <h4 class="m-0 mb-3 mt-4 text-surface-600 dark:text-surface-300"><i class="pi pi-bolt mr-2"></i>Acción Resultante</h4>
                <div class="flex gap-3">
                  <div class="flex-1">
                    <label class="block text-xs font-bold text-surface-500 dark:text-surface-400 mb-1">Tipo de Acción</label>
                    <select v-model="activeRule.action.type" class="w-full p-2 border-round border-1 border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0" :disabled="!canEdit">
                      <option value="block">block (Rechazar / Bloquear)</option>
                      <option value="surcharge_percentage">surcharge_percentage (Recargo %)</option>
                      <option value="discount_fixed">discount_fixed (Descuento Fijo)</option>
                      <option value="set_price">set_price (Fijar Precio Unitario)</option>
                      <option value="require_approval">require_approval (Forzar Aprobación Manual)</option>
                    </select>
                  </div>
                  <div class="flex-1">
                    <label class="block text-xs font-bold text-surface-500 dark:text-surface-400 mb-1">Valor</label>
                    <input type="text" v-model="activeRule.action.value" class="w-full p-2 border-round border-1 border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0" placeholder="Ej. 15, 'true', o importe" :disabled="!canEdit" />
                  </div>
                  <div class="flex-1">
                    <label class="block text-xs font-bold text-surface-500 dark:text-surface-400 mb-1">Mensaje / Razón</label>
                    <input type="text" v-model="activeRule.action.message" class="w-full p-2 border-round border-1 border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0" placeholder="Razón a mostrar al usuario..." :disabled="!canEdit" />
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
import { http } from '../api/http';
import { ruleService, type Rule } from '../services/ruleService';
import { useTenantStore } from '../stores/tenantStore';
import { usePermissionsStore } from '../stores/permissions';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';
import RuleConditionGroup from '../components/RuleConditionGroup.vue';

const tenantStore = useTenantStore();
const permissionsStore = usePermissionsStore();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();
const rules = ref<Rule[]>([]);
const activeRule = ref<Rule | null>(null);
const searchQuery = ref('');
const saving = ref(false);

const canEdit = computed(() => permissionsStore.can('config.manage'));

const filteredRules = computed(() => {
  if(!searchQuery.value) return rules.value;
  return rules.value.filter(r => r.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

onMounted(async () => {
  if(tenantStore.activeTenant?.id) {
    rules.value = await ruleService.getFullList({
      filter: `tenant = "${tenantStore.activeTenant.id}"`,
      sort: '-created'
    });
  }
});

const selectRule = (rule: Rule) => {
  const cloned = JSON.parse(JSON.stringify(rule));
  // Ensure we have a valid AST structure
  if (!cloned.conditions_ast || Object.keys(cloned.conditions_ast).length === 0) {
    cloned.conditions_ast = { type: 'AND', rules: [] };
  }
  if (!cloned.action) {
    cloned.action = { type: 'block', value: '', message: '' };
  }
  activeRule.value = cloned;
};

const createNewRule = () => {
  activeRule.value = {
    id: '',
    tenant: tenantStore.activeTenant?.id || '',
    name: 'Nueva Regla',
    description: '',
    rule_type: 'eligibility',
    status: 'draft',
    version: 1,
    priority: 100,
    is_exclusive: false,
    stop_processing: false,
    conditions_ast: { type: 'AND', rules: [] },
    action: { type: 'block', value: '', message: '' }
  } as unknown as Rule;
};

const saveRule = async () => {
  if (!activeRule.value) return;
  saving.value = true;
  try {
    if(activeRule.value.id) {
      // ESTRATEGIA DE VERSIONADO EXIGIDA
      // 1. Archivar la actual
      await ruleService.update(activeRule.value.id, { status: 'archived' });
      
      // 2. Crear nueva versión clonada
      const newVersion = { ...activeRule.value };
      delete (newVersion as any).id;
      delete (newVersion as any).created;
      delete (newVersion as any).updated;
      (newVersion as any).version = ((newVersion as any).version || 1) + 1;
      newVersion.status = 'active';

      const saved = await ruleService.create(newVersion);
      
      // 3. Auditoría obligatoria
      await http.post('/admin_audit_log', {
         tenant: tenantStore.activeTenant?.id,
         user: authStore.user?.id || 'system',
         action: 'RULE_VERSION_UPDATE',
         entity_type: 'rule_registry',
         entity_id: saved.id,
         description: `Regla actualizada de v${(activeRule.value as any).version} a v${(newVersion as any).version}`
      });

      // Recargar
      activeRule.value = saved;
      rules.value = await ruleService.getFullList({ filter: `tenant = "${tenantStore.activeTenant?.id}"`, sort: '-created' });

    } else {
      activeRule.value.status = 'active';
      const saved = await ruleService.create(activeRule.value);
      
      await http.post('/admin_audit_log', {
         tenant: tenantStore.activeTenant?.id,
         user: authStore.user?.id || 'system',
         action: 'RULE_CREATE',
         entity_type: 'rule_registry',
         entity_id: saved.id,
         description: `Regla creada: ${saved.name}`
      });

      activeRule.value = saved;
      rules.value.unshift(saved);
    }
    notificationStore.addNotification({
      type: 'success',
      message: 'Regla guardada y versionada correctamente.',
      domainEvent: 'RULE_SAVED'
    });
  } catch(e: unknown) {
    console.error(e);
    notificationStore.addNotification({
      type: 'error',
      message: 'Error al guardar regla.',
      domainEvent: 'RULE_SAVE_FAILED'
    });
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.rule-builder { display: flex; flex-direction: column; gap: 1rem; }
.card { background: var(--tenant-surface-0); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid var(--tenant-surface-200); }
.dark .card { background: var(--tenant-surface-900); border-color: var(--tenant-surface-700); }
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
.text-surface-800 { color: #1e293b; }
.text-surface-700 { color: #334155; }
.text-surface-600 { color: #475569; }
.text-surface-500 { color: #64748b; }
.text-surface-400 { color: #94a3b8; }
.text-red-500 { color: #ef4444; }
.text-red-600 { color: #dc2626; }
.text-orange-600 { color: #ea580c; }
.text-primary-800 { color: #1e40af; }
.bg-primary-50 { background-color: #eff6ff; }
.bg-blue-100 { background-color: #dbeafe; }
.bg-surface-50 { background-color: #f8fafc; }
.bg-surface-0 { background-color: var(--tenant-surface-0); }
.border-blue-200 { border-color: #bfdbfe; }
.border-surface-200 { border-color: #e2e8f0; }
.border-surface-300 { border-color: #cbd5e1; }
</style>




