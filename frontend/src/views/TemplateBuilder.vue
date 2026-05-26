<template>
  <div class="template-builder h-full">
    <div class="view-header mb-3">
      <div class="flex justify-content-between align-items-center">
        <div>
          <h1 class="title">Template Builder</h1>
          <p class="subtitle text-surface-500 dark:text-surface-400">Diseñador de Contratos y Cotizaciones con variables dinámicas</p>
        </div>
        <DsButton label="Guardar Plantilla" severity="success" icon="pi pi-save" v-permission="'templates.manage'" @click="saveTemplate" :loading="saving" />
      </div>
    </div>

    <!-- Template Selector -->
    <div class="mb-3 flex gap-2 align-items-center">
      <select v-model="selectedTemplateId" @change="loadTemplate" class="p-2 border-round border-1 border-surface-300 dark:border-surface-600">
        <option value="">-- Nueva Plantilla --</option>
        <option v-for="t in templates" :key="t.id" :value="t.id">{{ t.name }} ({{ t.type }})</option>
      </select>
    </div>

    <div class="grid h-full" style="min-height: 60vh;">
      
      <!-- Template Variable Registry (Panel Lateral) -->
      <div class="col-12 lg:col-3">
         <div class="card bg-surface-50 dark:bg-surface-950 h-full border-1 border-surface-200 dark:border-surface-700">
            <h3 class="m-0 mb-3 text-surface-800 dark:text-surface-100 border-bottom pb-2">Variable Registry</h3>
            <p class="text-xs text-surface-500 dark:text-surface-400 mb-3">Copia y pega la variable en el editor HTML. (Handlebars syntax)</p>
            
            <div class="registry-group mb-3">
               <span class="block font-bold text-sm text-surface-700 dark:text-surface-200 mb-2">Quote Data (quote.*)</span>
               <div class="variable-chip bg-surface-0 dark:bg-surface-900 border-1 border-surface-300 dark:border-surface-600 p-2 border-round text-xs font-mono cursor-pointer mb-1 hover-bg" title="Copiar al portapapeles">
                  &#123;&#123;quote.total_amount&#125;&#125;
               </div>
               <div class="variable-chip bg-surface-0 dark:bg-surface-900 border-1 border-surface-300 dark:border-surface-600 p-2 border-round text-xs font-mono cursor-pointer mb-1 hover-bg">
                  &#123;&#123;quote.start_date&#125;&#125;
               </div>
               <div class="variable-chip bg-surface-0 dark:bg-surface-900 border-1 border-surface-300 dark:border-surface-600 p-2 border-round text-xs font-mono cursor-pointer hover-bg">
                  &#123;&#123;quote.end_date&#125;&#125;
               </div>
            </div>

            <div class="registry-group mb-3">
               <span class="block font-bold text-sm text-surface-700 dark:text-surface-200 mb-2">Client Data (client.*)</span>
               <div class="variable-chip bg-surface-0 dark:bg-surface-900 border-1 border-surface-300 dark:border-surface-600 p-2 border-round text-xs font-mono cursor-pointer mb-1 hover-bg">
                  &#123;&#123;client.legal_name&#125;&#125;
               </div>
               <div class="variable-chip bg-surface-0 dark:bg-surface-900 border-1 border-surface-300 dark:border-surface-600 p-2 border-round text-xs font-mono cursor-pointer mb-1 hover-bg">
                  &#123;&#123;client.rfc&#125;&#125;
               </div>
            </div>
            
            <div class="registry-group mb-3">
               <span class="block font-bold text-sm text-surface-700 dark:text-surface-200 mb-2">Tenant Data (tenant.*)</span>
               <div class="variable-chip bg-surface-0 dark:bg-surface-900 border-1 border-surface-300 dark:border-surface-600 p-2 border-round text-xs font-mono cursor-pointer mb-1 hover-bg">
                  &#123;&#123;tenant.legal_entity_name&#125;&#125;
               </div>
            </div>
         </div>
      </div>

      <!-- Editor HTML -->
      <div class="col-12 lg:col-9">
         <div class="card h-full flex flex-column p-0 overflow-hidden">
             <div class="p-3 border-bottom bg-surface-0 dark:bg-surface-900 flex align-items-center gap-3">
                <input type="text" class="p-2 border-round border-1 border-surface-300 dark:border-surface-600 flex-1 font-bold bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0" v-model="activeTemplate.name" placeholder="Nombre de la Plantilla" :disabled="!canEdit" />
                <select class="p-2 border-round border-1 border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0" v-model="activeTemplate.type" :disabled="!canEdit">
                  <option value="contract">Tipo: contract</option>
                  <option value="quote">Tipo: quote</option>
                </select>
                <DsTag severity="info" :value="'v' + activeTemplate.version" />
             </div>
             <textarea class="flex-1 w-full p-4 border-none font-mono text-sm editor-textarea" placeholder="<h1>Escribe tu HTML aquí...</h1>" v-model="activeTemplate.html_content" :disabled="!canEdit" spellcheck="false"></textarea>
          </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePermissionsStore } from '../stores/permissionsStore';
import { useTenantStore } from '../stores/tenantStore';
import { useNotificationStore } from '../stores/notificationStore';
import { templateService, type DocumentTemplate } from '../services/templateService';

const permissionsStore = usePermissionsStore();
const tenantStore = useTenantStore();
const notificationStore = useNotificationStore();
const canEdit = computed(() => permissionsStore.hasPermission('templates.manage'));

const templates = ref<DocumentTemplate[]>([]);
const selectedTemplateId = ref('');
const saving = ref(false);

const activeTemplate = ref<Partial<DocumentTemplate>>({
  name: 'Nueva Plantilla',
  type: 'contract',
  version: 1,
  html_content: '<h1>CONTRATO DE ARRENDAMIENTO DE ESPACIOS</h1>\n<p>Conste por el presente contrato, que celebran por una parte <strong>{{tenant.legal_entity_name}}</strong>, y por la otra <strong>{{client.legal_name}}</strong> (RFC: {{client.rfc}}).</p>\n<br>\n<p>El precio acordado es de: <b>${{quote.total_amount}}</b></p>'
});

onMounted(async () => {
  if (!tenantStore.activeTenant?.id) return;
  await fetchTemplates();
});

const fetchTemplates = async () => {
  try {
    templates.value = await templateService.getTemplates();
  } catch(e) {
    console.error('Error fetching templates', e);
  }
};

const loadTemplate = () => {
  if (!selectedTemplateId.value) {
    activeTemplate.value = {
      name: 'Nueva Plantilla',
      type: 'contract',
      version: 1,
      html_content: ''
    };
    return;
  }
  const t = templates.value.find(x => x.id === selectedTemplateId.value);
  if (t) {
    activeTemplate.value = JSON.parse(JSON.stringify(t));
  }
};

const saveTemplate = async () => {
  saving.value = true;
  try {
    const data: Partial<DocumentTemplate> = {
      name: activeTemplate.value.name,
      type: activeTemplate.value.type,
      version: activeTemplate.value.version || 1,
      html_content: activeTemplate.value.html_content
    };

    if (activeTemplate.value.id) {
      data.version = data.version! + 1;
      const updated = await templateService.updateTemplate(activeTemplate.value.id, data);
      activeTemplate.value.version = updated.version;
    } else {
      const created = await templateService.createTemplate(data);
      activeTemplate.value.id = created.id;
      selectedTemplateId.value = created.id || '';
    }
    
    notificationStore.addNotification({ type: 'success', message: 'Plantilla guardada correctamente.', domainEvent: 'UPDATE_SUCCESS' });
    await fetchTemplates();
  } catch (err) {
    console.error('Error saving template', err);
    notificationStore.addNotification({ type: 'error', message: 'Error al guardar la plantilla.', domainEvent: 'UPDATE_ERROR' });
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.template-builder { display: flex; flex-direction: column; gap: 1rem; }
.card { background: var(--tenant-surface-0); border-radius: 1rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid var(--tenant-surface-200); }
.dark .card { background: var(--tenant-surface-900); border-color: var(--tenant-surface-700); }
.title { margin: 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.subtitle { margin: 0.25rem 0 0 0; font-size: 0.875rem; }
.border-bottom { border-bottom: 1px solid #e2e8f0; }
.hover-bg:hover { background-color: #f8fafc; }
.cursor-pointer { cursor: pointer; }

.grid { display: flex; flex-wrap: wrap; margin: -1rem; }
.col-12 { padding: 1rem; width: 100%; }
@media (min-width: 1024px) { 
  .lg\:col-3 { width: 25%; }
  .lg\:col-9 { width: 75%; }
}
.flex { display: flex; }
.flex-column { flex-direction: column; }
.flex-1 { flex: 1; }
.align-items-center { align-items: center; }
.justify-content-between { justify-content: space-between; }
.gap-3 { gap: 1rem; }
.m-0 { margin: 0; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.pb-2 { padding-bottom: 0.5rem; }
.p-0 { padding: 0; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.block { display: block; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.font-bold { font-weight: 700; }
.font-mono { font-family: monospace; }
.h-full { height: 100%; }
.w-full { width: 100%; }
.border-round { border-radius: 0.5rem; }
.border-1 { border-width: 1px; border-style: solid; }
.border-none { border: none; }
.overflow-hidden { overflow: hidden; }
.editor-textarea { resize: none; outline: none; background: #1e293b; color: #38bdf8; line-height: 1.5; }
.editor-textarea:disabled { opacity: 0.7; }

.text-surface-800 { color: #1e293b; }
.text-surface-700 { color: #334155; }
.text-surface-500 { color: #64748b; }
.bg-surface-50 { background-color: #f8fafc; }
.bg-surface-0 { background-color: var(--tenant-surface-0); }
.border-surface-200 { border-color: #e2e8f0; }
.border-surface-300 { border-color: #cbd5e1; }
</style>




