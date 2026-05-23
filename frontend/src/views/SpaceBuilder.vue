<template>
  <div class="space-builder">
    <div class="view-header mb-4">
      <div class="flex justify-content-between align-items-center">
        <div>
          <h1 class="title">Space Catalog Builder</h1>
          <p class="subtitle">Administración de recintos, salones, y espacios digitales. (Permission-Driven)</p>
        </div>
        <!-- V-PERMISSION DIRECTIVE IN ACTION -->
        <Button label="Crear Nuevo Espacio" icon="pi pi-plus" v-permission="'spaces.manage'" />
      </div>
    </div>

    <div class="card mb-4" v-if="permissionsStore.can('spaces.manage')">
       <div class="p-4 bg-slate-50 border-round border-1 border-slate-200">
         <h4 class="m-0 mb-3 text-slate-700">Edición de Catálogo (Mock UI)</h4>
         
         <div class="grid">
           <div class="col-12 lg:col-4">
              <label class="block text-sm font-bold text-slate-700 mb-1">Nombre del Espacio</label>
              <input type="text" class="w-full p-2 border-round border-1 border-slate-300" placeholder="Ej. Pantalla Norte" />
           </div>
           <div class="col-12 lg:col-4">
              <label class="block text-sm font-bold text-slate-700 mb-1">Categoría</label>
              <select class="w-full p-2 border-round border-1 border-slate-300">
                <option>Publicidad Digital</option>
                <option>Publicidad Física</option>
                <option>Salones de Eventos</option>
              </select>
           </div>
           <div class="col-12 lg:col-4">
              <label class="block text-sm font-bold text-red-600 mb-1" title="Define cómo se comporta en el Availability Engine">Occupancy Policy (Obligatorio)</label>
              <select class="w-full p-2 border-round border-1 border-red-300 bg-red-50 text-red-800">
                <option value="exclusive">Exclusive (Bloqueo Total del Espacio)</option>
                <option value="shared">Shared (Sobreventa Permitida)</option>
                <option value="segmented">Segmented (Varias campañas simultáneas)</option>
              </select>
           </div>
         </div>
         
         <div class="flex justify-content-end mt-3">
            <Button label="Guardar Configuración de Espacio" icon="pi pi-save" severity="success" size="small" />
         </div>
       </div>
    </div>

    <div class="card">
       <h3 class="m-0 mb-3">Catálogo Existente</h3>
       <div class="p-3 bg-red-50 text-red-800 border-round mb-3 text-sm" v-if="!permissionsStore.can('spaces.read')">
          <i class="pi pi-ban mr-2"></i> No tienes permisos para visualizar el catálogo de espacios.
       </div>
       <div v-else>
         <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-bottom">
                <th class="p-3 text-sm text-slate-500">Espacio</th>
                <th class="p-3 text-sm text-slate-500">Categoría</th>
                <th class="p-3 text-sm text-slate-500">Occupancy Policy</th>
                <th class="p-3 text-sm text-slate-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-bottom hover-bg" v-for="n in 3" :key="n">
                 <td class="p-3 font-bold">Salón Magno {{n}}</td>
                 <td class="p-3">Salones de Eventos</td>
                 <td class="p-3"><Tag value="Exclusive" severity="danger" /></td>
                 <td class="p-3 text-right">
                    <!-- Action-Level Authorization -->
                    <Button icon="pi pi-pencil" class="p-button-text p-button-sm mr-2" v-permission="'spaces.manage'" />
                    <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" v-permission="'spaces.manage'" />
                 </td>
              </tr>
            </tbody>
         </table>
       </div>
    </div>

    <AvailabilitySimulator v-permission="'spaces.manage'" />

  </div>
</template>

<script setup lang="ts">
import { usePermissionsStore } from '../stores/permissions';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import AvailabilitySimulator from './AvailabilitySimulator.vue';

const permissionsStore = usePermissionsStore();
</script>

<style scoped>
.space-builder { display: flex; flex-direction: column; gap: 1rem; }
.card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
.title { margin: 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.subtitle { margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #64748b; }
.border-bottom { border-bottom: 1px solid #e2e8f0; }
.hover-bg:hover { background-color: #f8fafc; }

/* Grid Utils */
.grid { display: flex; flex-wrap: wrap; margin: -1rem; }
.col-12 { padding: 1rem; width: 100%; }
@media (min-width: 1024px) { 
  .lg\:col-4 { width: 33.333333%; }
}
.flex { display: flex; }
.align-items-center { align-items: center; }
.justify-content-between { justify-content: space-between; }
.justify-content-end { justify-content: flex-end; }
.m-0 { margin: 0; }
.mt-3 { margin-top: 0.75rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.mr-2 { margin-right: 0.5rem; }
.block { display: block; }
.text-sm { font-size: 0.875rem; }
.font-bold { font-weight: 700; }
.w-full { width: 100%; }
.text-right { text-align: right; }
.border-round { border-radius: 0.5rem; }
.border-1 { border-width: 1px; border-style: solid; }
.border-collapse { border-collapse: collapse; }

/* Colors */
.text-slate-700 { color: #334155; }
.text-slate-500 { color: #64748b; }
.text-red-600 { color: #dc2626; }
.text-red-800 { color: #991b1b; }
.bg-slate-50 { background-color: #f8fafc; }
.bg-red-50 { background-color: #fef2f2; }
.border-slate-200 { border-color: #e2e8f0; }
.border-slate-300 { border-color: #cbd5e1; }
.border-red-300 { border-color: #fca5a5; }
</style>
