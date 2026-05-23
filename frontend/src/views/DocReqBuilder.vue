<template>
  <div class="doc-req-builder">
    <div class="view-header mb-4">
      <div class="flex justify-content-between align-items-center">
        <div>
          <h1 class="title">Document Requirements Builder</h1>
          <p class="subtitle">Gobernanza de expedientes. Alimenta directamente al Eligibility Engine.</p>
        </div>
        <Button label="Nuevo Requisito" icon="pi pi-plus" v-permission="'config.manage'" />
      </div>
    </div>

    <div class="grid">
      <!-- Persona Física -->
      <div class="col-12 lg:col-6">
         <div class="card h-full">
            <h3 class="m-0 mb-3 text-slate-800 border-bottom pb-2">Expediente: Persona Física</h3>
            <ul class="list-none p-0 m-0">
               <li v-for="n in 3" :key="'pf-'+n" class="p-3 border-bottom flex justify-content-between align-items-center hover-bg">
                 <div>
                    <span class="font-bold block text-slate-800">Identificación Oficial (INE/Pasaporte)</span>
                    <span class="text-xs text-slate-500">Vigencia máxima: 3 años | Obligatorio</span>
                 </div>
                 <div class="flex gap-2">
                    <Tag severity="danger" value="Bloqueante" v-if="n === 1" title="El Eligibility Engine bloqueará cotizaciones si falta" />
                    <Button icon="pi pi-pencil" class="p-button-text p-button-sm p-button-secondary" v-permission="'config.manage'" />
                 </div>
               </li>
            </ul>
         </div>
      </div>

      <!-- Persona Moral -->
      <div class="col-12 lg:col-6">
         <div class="card h-full">
            <h3 class="m-0 mb-3 text-slate-800 border-bottom pb-2">Expediente: Persona Moral</h3>
            <ul class="list-none p-0 m-0">
               <li v-for="n in 4" :key="'pm-'+n" class="p-3 border-bottom flex justify-content-between align-items-center hover-bg">
                 <div>
                    <span class="font-bold block text-slate-800">Acta Constitutiva</span>
                    <span class="text-xs text-slate-500">Documento base | Obligatorio</span>
                 </div>
                 <div class="flex gap-2">
                    <Tag severity="danger" value="Bloqueante" title="El Eligibility Engine bloqueará cotizaciones si falta" />
                    <Button icon="pi pi-pencil" class="p-button-text p-button-sm p-button-secondary" v-permission="'config.manage'" />
                 </div>
               </li>
            </ul>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Tag from 'primevue/tag';
// const permissionsStore = usePermissionsStore();
</script>

<style scoped>
.doc-req-builder { display: flex; flex-direction: column; gap: 1rem; }
.card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
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
.text-slate-800 { color: #1e293b; }
.text-slate-500 { color: #64748b; }
</style>
