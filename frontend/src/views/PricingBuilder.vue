<template>
  <div class="pricing-builder">
    <div class="view-header mb-4">
      <div class="flex justify-content-between align-items-center">
        <div>
          <h1 class="title">Pricing Engine Builder</h1>
          <p class="subtitle text-slate-500">Reglas de recargos, horas extra y tarifas híbridas</p>
        </div>
        <Button label="Nueva Regla Comercial" icon="pi pi-plus" v-permission="'pricing.manage'" />
      </div>
    </div>

    <div class="card mb-4" v-permission="'pricing.manage'">
       <h3 class="m-0 mb-3 border-bottom pb-2">Variables Expuestas al Rule Engine (Configuration Over Code)</h3>
       <p class="text-sm text-slate-500 mb-4">Las siguientes variables pueden usarse en el Árbol AST para construir fórmulas de precio dinámicas sin modificar Vue ni TypeScript.</p>
       
       <div class="grid">
          <div class="col-12 md:col-4 lg:col-3">
             <div class="p-3 bg-slate-50 border-1 border-slate-200 border-round h-full">
                <span class="font-bold text-slate-800 block mb-1">Dimensiones Temporales</span>
                <ul class="text-sm text-slate-600 m-0 pl-3">
                  <li><code>quote.duration_days</code></li>
                  <li><code>quote.duration_hours</code></li>
                  <li><code>quote.extra_hours</code></li>
                  <li><code>quote.is_high_season</code></li>
                </ul>
             </div>
          </div>
          <div class="col-12 md:col-4 lg:col-3">
             <div class="p-3 bg-slate-50 border-1 border-slate-200 border-round h-full">
                <span class="font-bold text-slate-800 block mb-1">Operativa Física</span>
                <ul class="text-sm text-slate-600 m-0 pl-3">
                  <li><code>quote.mounting_hours</code></li>
                  <li><code>quote.dismantling_hours</code></li>
                  <li><code>quote.has_external_vendor</code></li>
                </ul>
             </div>
          </div>
          <div class="col-12 md:col-4 lg:col-3">
             <div class="p-3 bg-slate-50 border-1 border-slate-200 border-round h-full">
                <span class="font-bold text-slate-800 block mb-1">Entidades Core</span>
                <ul class="text-sm text-slate-600 m-0 pl-3">
                  <li><code>space.base_price</code></li>
                  <li><code>space.category</code></li>
                  <li><code>client.eligibility_score</code></li>
                </ul>
             </div>
          </div>
       </div>
    </div>

    <!-- Pricing Rules Editor Mock -->
    <div class="card">
      <h3 class="m-0 mb-3 text-slate-800 border-bottom pb-2">Reglas de Recargo Activas</h3>
      
      <div class="p-3 bg-red-50 text-red-800 border-round mb-3 text-sm" v-if="!permissionsStore.can('pricing.read')">
         <i class="pi pi-ban mr-2"></i> No tienes permisos (pricing.read).
      </div>
      
      <table class="w-full text-left border-collapse" v-else>
         <thead>
           <tr class="border-bottom">
             <th class="p-3 text-sm text-slate-500">Nombre Regla</th>
             <th class="p-3 text-sm text-slate-500">AST Condition (Mock)</th>
             <th class="p-3 text-sm text-slate-500">AST Action</th>
             <th class="p-3 text-sm text-slate-500 text-right">Acciones</th>
           </tr>
         </thead>
         <tbody>
           <tr class="border-bottom hover-bg">
              <td class="p-3 font-bold">Cuota Descorche (Casa de Piedra)</td>
              <td class="p-3 font-mono text-xs text-slate-600 bg-slate-50 p-2 border-round">quote.has_external_vendor == true</td>
              <td class="p-3 font-mono text-xs text-orange-600">+ $15,000.00 Fijo</td>
              <td class="p-3 text-right">
                 <Button icon="pi pi-pencil" class="p-button-text p-button-sm mr-2" v-permission="'pricing.manage'" />
              </td>
           </tr>
           <tr class="border-bottom hover-bg">
              <td class="p-3 font-bold">Recargo Temporada Alta (Fines de semana)</td>
              <td class="p-3 font-mono text-xs text-slate-600 bg-slate-50 p-2 border-round">quote.is_high_season == true</td>
              <td class="p-3 font-mono text-xs text-orange-600">+ 15% Base</td>
              <td class="p-3 text-right">
                 <Button icon="pi pi-pencil" class="p-button-text p-button-sm mr-2" v-permission="'pricing.manage'" />
              </td>
           </tr>
           <tr class="border-bottom hover-bg">
              <td class="p-3 font-bold">Cobro Horas Extra (Operación)</td>
              <td class="p-3 font-mono text-xs text-slate-600 bg-slate-50 p-2 border-round">quote.extra_hours > 0</td>
              <td class="p-3 font-mono text-xs text-orange-600">+ (space.price_per_hour * 1.5) * extra_hours</td>
              <td class="p-3 text-right">
                 <Button icon="pi pi-pencil" class="p-button-text p-button-sm mr-2" v-permission="'pricing.manage'" />
              </td>
           </tr>
         </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
import { usePermissionsStore } from '../stores/permissions';
import Button from 'primevue/button';

const permissionsStore = usePermissionsStore();
</script>

<style scoped>
.pricing-builder { display: flex; flex-direction: column; gap: 1rem; }
.card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
.title { margin: 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.subtitle { margin: 0.25rem 0 0 0; font-size: 0.875rem; }
.border-bottom { border-bottom: 1px solid #e2e8f0; }
.hover-bg:hover { background-color: #f8fafc; }
.border-collapse { border-collapse: collapse; }

/* Grid Utils */
.grid { display: flex; flex-wrap: wrap; margin: -1rem; }
.col-12 { padding: 1rem; width: 100%; }
@media (min-width: 768px) { 
  .md\:col-4 { width: 33.333333%; }
}
@media (min-width: 1024px) { 
  .lg\:col-3 { width: 25%; }
}
.flex { display: flex; }
.align-items-center { align-items: center; }
.justify-content-between { justify-content: space-between; }
.m-0 { margin: 0; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.pb-2 { padding-bottom: 0.5rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.pl-3 { padding-left: 0.75rem; }
.mr-2 { margin-right: 0.5rem; }
.block { display: block; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.font-bold { font-weight: 700; }
.font-mono { font-family: monospace; }
.text-right { text-align: right; }
.h-full { height: 100%; }
.w-full { width: 100%; }
.border-round { border-radius: 0.5rem; }
.border-1 { border-width: 1px; border-style: solid; }

/* Colors */
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.text-slate-600 { color: #475569; }
.text-slate-500 { color: #64748b; }
.text-orange-600 { color: #ea580c; }
.text-red-800 { color: #991b1b; }
.bg-slate-50 { background-color: #f8fafc; }
.border-slate-200 { border-color: #e2e8f0; }
.bg-red-50 { background-color: #fef2f2; }
</style>
