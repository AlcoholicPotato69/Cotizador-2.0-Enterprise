<template>
  <div class="promotions-builder">
    <div class="view-header mb-4">
      <div class="flex justify-content-between align-items-center">
        <div>
          <h1 class="title">Promotions Builder</h1>
          <p class="subtitle text-slate-500">Gestor de descuentos comerciales dinámicos con Rule Engine</p>
        </div>
        <Button label="Nueva Promoción" icon="pi pi-plus" v-permission="'promotions.manage'" />
      </div>
    </div>

    <div class="grid">
      <!-- Listado de Promociones -->
      <div class="col-12 lg:col-5">
        <div class="card h-full">
           <h3 class="m-0 mb-3 border-bottom pb-2">Promociones Activas</h3>
           
           <div class="p-3 bg-red-50 text-red-800 border-round mb-3 text-sm" v-if="!permissionsStore.can('promotions.read')">
              <i class="pi pi-ban mr-2"></i> No tienes permisos (promotions.read).
           </div>

           <ul v-else class="list-none p-0 m-0">
             <li class="p-3 border-bottom flex justify-content-between align-items-center hover-bg cursor-pointer bg-blue-50 border-blue-200">
                <div>
                   <span class="font-bold block text-slate-800">Descuento de Verano 2026</span>
                   <span class="text-xs text-slate-500 block">Aplica si: client.type == 'Frecuente' AND event.season == 'low'</span>
                   <span class="text-xs text-green-600 font-bold"><i class="pi pi-tag"></i> Descuento: -15%</span>
                </div>
                <Tag severity="success" value="v3" title="Versión Inmutable para Snapshots" />
             </li>
             <li class="p-3 border-bottom flex justify-content-between align-items-center hover-bg cursor-pointer">
                <div>
                   <span class="font-bold block text-slate-800">Día de Montaje Gratis</span>
                   <span class="text-xs text-slate-500 block">Aplica si: quote.duration_days > 3</span>
                   <span class="text-xs text-green-600 font-bold"><i class="pi pi-clock"></i> Descuento: -24 horas extra</span>
                </div>
                <Tag severity="success" value="v1" />
             </li>
           </ul>
        </div>
      </div>

      <!-- Simulator Panel -->
      <div class="col-12 lg:col-7">
         <div class="card bg-slate-50 border-1 border-slate-200 h-full flex flex-column">
            <h3 class="m-0 mb-3 text-slate-700 border-bottom pb-2"><i class="pi pi-play-circle mr-2"></i> Promotion Simulator</h3>
            <p class="text-sm text-slate-500 mb-4">Simula el Rule Engine inyectando un contexto de cotización ficticio para validar si la promoción aplica antes de publicarla.</p>
            
            <div class="grid mb-4" v-permission="'promotions.manage'">
               <div class="col-12 lg:col-6">
                 <label class="block text-xs font-bold text-slate-700 mb-1">Cliente (Mock)</label>
                 <select class="w-full p-2 border-round border-1 border-slate-300">
                    <option>Nuevo Cliente</option>
                    <option selected>Cliente Frecuente</option>
                 </select>
               </div>
               <div class="col-12 lg:col-6">
                 <label class="block text-xs font-bold text-slate-700 mb-1">Temporada (Mock)</label>
                 <select class="w-full p-2 border-round border-1 border-slate-300">
                    <option>High Season</option>
                    <option selected>Low Season</option>
                 </select>
               </div>
               <div class="col-12 lg:col-6">
                 <label class="block text-xs font-bold text-slate-700 mb-1">Precio Base Original</label>
                 <input type="text" class="w-full p-2 border-round border-1 border-slate-300" value="$100,000.00" disabled />
               </div>
               <div class="col-12 mt-3 text-right">
                  <Button label="Ejecutar Simulador (Rule Engine)" icon="pi pi-cog" />
               </div>
            </div>

            <div class="p-3 bg-green-50 border-1 border-green-200 border-round mt-auto">
               <h4 class="m-0 mb-2 text-green-800">Resultado de la Simulación</h4>
               <ul class="text-sm text-green-900 m-0 pl-3">
                 <li>Condición <code>client.type == 'Frecuente'</code>: <strong>TRUE</strong></li>
                 <li>Condición <code>event.season == 'low'</code>: <strong>TRUE</strong></li>
               </ul>
               <div class="mt-3 pt-3 border-top border-green-300 flex justify-content-between align-items-center">
                  <span class="font-bold text-green-800">Precio Final Calculado:</span>
                  <span class="text-2xl font-bold text-green-700">$85,000.00 <span class="text-xs font-normal">(-15%)</span></span>
               </div>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePermissionsStore } from '../stores/permissions';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const permissionsStore = usePermissionsStore();
</script>

<style scoped>
.promotions-builder { display: flex; flex-direction: column; gap: 1rem; height: 100%; }
.card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
.title { margin: 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.subtitle { margin: 0.25rem 0 0 0; font-size: 0.875rem; }
.border-bottom { border-bottom: 1px solid #e2e8f0; }
.border-top { border-top: 1px solid; }
.hover-bg:hover { background-color: #f8fafc; }
.cursor-pointer { cursor: pointer; }

/* Grid Utils */
.grid { display: flex; flex-wrap: wrap; margin: -1rem; }
.col-12 { padding: 1rem; width: 100%; }
@media (min-width: 1024px) { 
  .lg\:col-5 { width: 41.666667%; }
  .lg\:col-6 { width: 50%; }
  .lg\:col-7 { width: 58.333333%; }
}
.flex { display: flex; }
.flex-column { flex-direction: column; }
.align-items-center { align-items: center; }
.justify-content-between { justify-content: space-between; }
.m-0 { margin: 0; }
.mt-3 { margin-top: 0.75rem; }
.mt-auto { margin-top: auto; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.pb-2 { padding-bottom: 0.5rem; }
.pt-3 { padding-top: 0.75rem; }
.p-0 { padding: 0; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.pl-3 { padding-left: 0.75rem; }
.mr-2 { margin-right: 0.5rem; }
.block { display: block; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.text-2xl { font-size: 1.5rem; }
.font-bold { font-weight: 700; }
.font-normal { font-weight: 400; }
.text-right { text-align: right; }
.h-full { height: 100%; }
.w-full { width: 100%; }
.list-none { list-style: none; }
.border-round { border-radius: 0.5rem; }
.border-1 { border-width: 1px; border-style: solid; }

/* Colors */
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.text-slate-500 { color: #64748b; }
.text-green-900 { color: #14532d; }
.text-green-800 { color: #166534; }
.text-green-700 { color: #15803d; }
.text-green-600 { color: #16a34a; }
.text-red-800 { color: #991b1b; }
.bg-blue-50 { background-color: #eff6ff; }
.border-blue-200 { border-color: #bfdbfe; }
.bg-slate-50 { background-color: #f8fafc; }
.border-slate-200 { border-color: #e2e8f0; }
.border-slate-300 { border-color: #cbd5e1; }
.bg-red-50 { background-color: #fef2f2; }
.bg-green-50 { background-color: #f0fdf4; }
.border-green-200 { border-color: #bbf7d0; }
.border-green-300 { border-color: #86efac; }
</style>
