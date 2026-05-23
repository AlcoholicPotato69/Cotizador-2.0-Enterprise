<template>
  <div class="template-builder h-full">
    <div class="view-header mb-3">
      <div class="flex justify-content-between align-items-center">
        <div>
          <h1 class="title">Template Builder</h1>
          <p class="subtitle text-slate-500">Diseñador de Contratos y Cotizaciones con variables dinámicas</p>
        </div>
        <Button label="Guardar Plantilla" severity="success" icon="pi pi-save" v-permission="'templates.manage'" />
      </div>
    </div>

    <div class="grid h-full" style="min-height: 60vh;">
      
      <!-- Template Variable Registry (Panel Lateral) -->
      <div class="col-12 lg:col-3">
         <div class="card bg-slate-50 h-full border-1 border-slate-200">
            <h3 class="m-0 mb-3 text-slate-800 border-bottom pb-2">Variable Registry</h3>
            <p class="text-xs text-slate-500 mb-3">Copia y pega la variable en el editor HTML. (Handlebars syntax)</p>
            
            <div class="registry-group mb-3">
               <span class="block font-bold text-sm text-slate-700 mb-2">Quote Data (quote.*)</span>
               <div class="variable-chip bg-white border-1 border-slate-300 p-2 border-round text-xs font-mono cursor-pointer mb-1 hover-bg" title="Copiar al portapapeles">
                  &#123;&#123;quote.total_amount&#125;&#125;
               </div>
               <div class="variable-chip bg-white border-1 border-slate-300 p-2 border-round text-xs font-mono cursor-pointer mb-1 hover-bg">
                  &#123;&#123;quote.start_date&#125;&#125;
               </div>
               <div class="variable-chip bg-white border-1 border-slate-300 p-2 border-round text-xs font-mono cursor-pointer hover-bg">
                  &#123;&#123;quote.end_date&#125;&#125;
               </div>
            </div>

            <div class="registry-group mb-3">
               <span class="block font-bold text-sm text-slate-700 mb-2">Client Data (client.*)</span>
               <div class="variable-chip bg-white border-1 border-slate-300 p-2 border-round text-xs font-mono cursor-pointer mb-1 hover-bg">
                  &#123;&#123;client.legal_name&#125;&#125;
               </div>
               <div class="variable-chip bg-white border-1 border-slate-300 p-2 border-round text-xs font-mono cursor-pointer mb-1 hover-bg">
                  &#123;&#123;client.rfc&#125;&#125;
               </div>
            </div>
            
            <div class="registry-group mb-3">
               <span class="block font-bold text-sm text-slate-700 mb-2">Tenant Data (tenant.*)</span>
               <div class="variable-chip bg-white border-1 border-slate-300 p-2 border-round text-xs font-mono cursor-pointer mb-1 hover-bg">
                  &#123;&#123;tenant.legal_entity_name&#125;&#125;
               </div>
            </div>
         </div>
      </div>

      <!-- Editor HTML -->
      <div class="col-12 lg:col-9">
         <div class="card h-full flex flex-column p-0 overflow-hidden">
            <div class="p-3 border-bottom bg-white flex align-items-center gap-3">
               <input type="text" class="p-2 border-round border-1 border-slate-300 flex-1 font-bold" value="Contrato de Arrendamiento Estandar" :disabled="!canEdit" />
               <select class="p-2 border-round border-1 border-slate-300" :disabled="!canEdit">
                 <option>Tipo: contract</option>
                 <option>Tipo: quote</option>
               </select>
               <Tag severity="info" value="v12" />
            </div>
            <textarea class="flex-1 w-full p-4 border-none font-mono text-sm editor-textarea" placeholder="<h1>Escribe tu HTML aquí...</h1>" :disabled="!canEdit" spellcheck="false">&lt;h1&gt;CONTRATO DE ARRENDAMIENTO DE ESPACIOS&lt;/h1&gt;
&lt;p&gt;Conste por el presente contrato, que celebran por una parte &lt;strong&gt;&#123;&#123;tenant.legal_entity_name&#125;&#125;&lt;/strong&gt;, y por la otra &lt;strong&gt;&#123;&#123;client.legal_name&#125;&#125;&lt;/strong&gt; (RFC: &#123;&#123;client.rfc&#125;&#125;).&lt;/p&gt;
&lt;br&gt;
&lt;p&gt;El precio acordado es de: &lt;b&gt;$&#123;&#123;quote.total_amount&#125;&#125;&lt;/b&gt;&lt;/p&gt;</textarea>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePermissionsStore } from '../stores/permissions';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const permissionsStore = usePermissionsStore();
const canEdit = computed(() => permissionsStore.can('templates.manage'));
</script>

<style scoped>
.template-builder { display: flex; flex-direction: column; gap: 1rem; }
.card { background: white; border-radius: 1rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
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

.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.text-slate-500 { color: #64748b; }
.bg-slate-50 { background-color: #f8fafc; }
.bg-white { background-color: #ffffff; }
.border-slate-200 { border-color: #e2e8f0; }
.border-slate-300 { border-color: #cbd5e1; }
</style>
