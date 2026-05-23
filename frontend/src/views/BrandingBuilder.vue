<template>
  <div class="branding-builder h-full">
    <div class="view-header mb-3">
      <div class="flex justify-content-between align-items-center">
        <div>
          <h1 class="title">Branding Builder</h1>
          <p class="subtitle text-slate-500">Apariencia visual de cotizaciones, recibos y portal de clientes</p>
        </div>
        <Button label="Publicar Branding" severity="success" icon="pi pi-check" v-permission="'branding.manage'" />
      </div>
    </div>

    <div class="grid h-full" style="min-height: 60vh;">
      
      <!-- Controles de Configuración -->
      <div class="col-12 lg:col-4">
         <div class="card h-full flex flex-column gap-4">
            <div v-if="!permissionsStore.can('branding.read')" class="p-3 bg-red-50 text-red-800 border-round text-sm">
               <i class="pi pi-ban mr-2"></i> No tienes permisos (branding.read).
            </div>
            
            <template v-else>
               <div>
                 <label class="block text-sm font-bold text-slate-700 mb-2">Logotipo del Recinto</label>
                 <div class="border-2 border-dashed border-slate-300 border-round p-4 text-center cursor-pointer hover-bg" :class="{'opacity-50': !canEdit}">
                    <i class="pi pi-cloud-upload text-3xl text-slate-400 mb-2"></i>
                    <span class="block text-sm text-slate-500">Arrastra un PNG o SVG (Max 5MB)</span>
                 </div>
               </div>

               <div>
                 <label class="block text-sm font-bold text-slate-700 mb-2">Color Primario (Acentos y Botones)</label>
                 <div class="flex gap-2 align-items-center">
                   <input type="color" value="#0f172a" class="w-3rem h-3rem p-0 border-none cursor-pointer border-round" :disabled="!canEdit" />
                   <input type="text" value="#0f172a" class="flex-1 p-2 border-round border-1 border-slate-300 font-mono text-sm" :disabled="!canEdit" />
                 </div>
               </div>

               <div>
                 <label class="block text-sm font-bold text-slate-700 mb-2">Color Secundario (Fondos)</label>
                 <div class="flex gap-2 align-items-center">
                   <input type="color" value="#f8fafc" class="w-3rem h-3rem p-0 border-none cursor-pointer border-round" :disabled="!canEdit" />
                   <input type="text" value="#f8fafc" class="flex-1 p-2 border-round border-1 border-slate-300 font-mono text-sm" :disabled="!canEdit" />
                 </div>
               </div>

               <div>
                 <label class="block text-sm font-bold text-slate-700 mb-2">Tipografía Corporativa</label>
                 <select class="w-full p-2 border-round border-1 border-slate-300" :disabled="!canEdit">
                    <option>Inter (Default)</option>
                    <option>Roboto</option>
                    <option>Playfair Display (Elegante)</option>
                 </select>
               </div>
            </template>
         </div>
      </div>

      <!-- Branding Preview Engine -->
      <div class="col-12 lg:col-8">
         <div class="card h-full p-0 flex flex-column bg-slate-50 border-1 border-slate-200 overflow-hidden">
            <div class="p-3 border-bottom bg-white flex justify-content-between align-items-center">
               <span class="font-bold text-slate-700"><i class="pi pi-eye mr-2"></i> Branding Preview Engine</span>
               <select class="p-2 border-round border-1 border-slate-300 text-sm">
                 <option>Vista: Cotización PDF</option>
                 <option>Vista: Contrato Legal</option>
                 <option>Vista: Recibo de Pago</option>
                 <option>Vista: Portal del Cliente</option>
               </select>
            </div>
            <div class="flex-1 p-4 overflow-auto flex justify-content-center align-items-start">
               <!-- Iframe Mock / Preview Sheet -->
               <div class="bg-white shadow-2 w-full max-w-30rem p-5 border-round" style="min-height: 400px; border-top: 6px solid #0f172a;">
                  <!-- Logo Placeholder -->
                  <div class="w-4rem h-4rem bg-slate-200 border-circle mb-4 flex align-items-center justify-content-center">
                     <i class="pi pi-image text-slate-400"></i>
                  </div>
                  
                  <h2 class="m-0 mb-2" style="font-family: 'Inter', sans-serif; color: #0f172a;">Cotización Formal</h2>
                  <p class="text-sm text-slate-500 mb-4">Generada automáticamente respetando los lineamientos gráficos del Tenant.</p>

                  <div class="p-3 border-round mb-3" style="background-color: #f8fafc; border: 1px solid #e2e8f0;">
                     <div class="flex justify-content-between mb-2">
                        <span class="text-sm font-bold">Total a Pagar</span>
                        <span class="text-sm font-bold">$120,000.00</span>
                     </div>
                     <div class="w-full border-round h-1rem" style="background-color: #0f172a;"></div>
                  </div>

                  <Button label="Aceptar Cotización" class="w-full border-none" style="background-color: #0f172a; color: white;" />
               </div>
            </div>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePermissionsStore } from '../stores/permissions';
import Button from 'primevue/button';

const permissionsStore = usePermissionsStore();
const canEdit = computed(() => permissionsStore.can('branding.manage'));
</script>

<style scoped>
.branding-builder { display: flex; flex-direction: column; gap: 1rem; }
.card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
.title { margin: 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.subtitle { margin: 0.25rem 0 0 0; font-size: 0.875rem; }
.border-bottom { border-bottom: 1px solid #e2e8f0; }
.hover-bg:hover { background-color: #f8fafc; }
.cursor-pointer { cursor: pointer; }

.grid { display: flex; flex-wrap: wrap; margin: -1rem; }
.col-12 { padding: 1rem; width: 100%; }
@media (min-width: 1024px) { 
  .lg\:col-4 { width: 33.333333%; }
  .lg\:col-8 { width: 66.666667%; }
}
.flex { display: flex; }
.flex-column { flex-direction: column; }
.flex-1 { flex: 1; }
.align-items-center { align-items: center; }
.align-items-start { align-items: flex-start; }
.justify-content-between { justify-content: space-between; }
.justify-content-center { justify-content: center; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1.5rem; }
.m-0 { margin: 0; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.p-0 { padding: 0; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.p-5 { padding: 1.5rem; }
.mr-2 { margin-right: 0.5rem; }
.block { display: block; }
.text-sm { font-size: 0.875rem; }
.text-3xl { font-size: 2rem; }
.font-bold { font-weight: 700; }
.font-mono { font-family: monospace; }
.text-center { text-align: center; }
.h-full { height: 100%; }
.w-full { width: 100%; }
.w-3rem { width: 3rem; }
.h-3rem { height: 3rem; }
.h-1rem { height: 1rem; }
.w-4rem { width: 4rem; }
.h-4rem { height: 4rem; }
.max-w-30rem { max-width: 30rem; }
.border-round { border-radius: 0.5rem; }
.border-circle { border-radius: 50%; }
.border-1 { border-width: 1px; border-style: solid; }
.border-2 { border-width: 2px; border-style: solid; }
.border-dashed { border-style: dashed; }
.border-none { border: none; }
.overflow-hidden { overflow: hidden; }
.overflow-auto { overflow: auto; }
.shadow-2 { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
.opacity-50 { opacity: 0.5; }

.text-slate-700 { color: #334155; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.text-red-800 { color: #991b1b; }
.bg-slate-50 { background-color: #f8fafc; }
.bg-slate-200 { background-color: #e2e8f0; }
.bg-white { background-color: #ffffff; }
.bg-red-50 { background-color: #fef2f2; }
.border-slate-200 { border-color: #e2e8f0; }
.border-slate-300 { border-color: #cbd5e1; }
</style>
