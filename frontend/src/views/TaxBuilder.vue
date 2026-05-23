<template>
  <div class="tax-builder">
    <div class="view-header mb-4">
      <div class="flex justify-content-between align-items-center">
        <div>
          <h1 class="title">Tax Builder</h1>
          <p class="subtitle text-slate-500">Configuración Fiscal Dinámica. Cero Código Duro.</p>
        </div>
        <Button label="Añadir Regla Fiscal" icon="pi pi-plus" v-permission="'taxes.manage'" />
      </div>
    </div>

    <div class="card mb-4">
       <h3 class="m-0 mb-3 border-bottom pb-2">Impuestos Activos (Tenant)</h3>
       
       <div class="p-3 bg-red-50 text-red-800 border-round mb-3 text-sm" v-if="!permissionsStore.can('taxes.read')">
          <i class="pi pi-ban mr-2"></i> No tienes permisos (taxes.read).
       </div>
       
       <table class="w-full text-left border-collapse" v-else>
         <thead>
           <tr class="border-bottom">
             <th class="p-3 text-sm text-slate-500">Impuesto</th>
             <th class="p-3 text-sm text-slate-500">Condición AST (Exenciones)</th>
             <th class="p-3 text-sm text-slate-500">Valor (%)</th>
             <th class="p-3 text-sm text-slate-500">Acciones</th>
           </tr>
         </thead>
         <tbody>
           <tr class="border-bottom hover-bg">
              <td class="p-3 font-bold">I.V.A (Nacional)</td>
              <td class="p-3 font-mono text-xs text-slate-600 bg-slate-50 p-2 border-round">client.country == 'MX'</td>
              <td class="p-3 text-green-700 font-bold">16%</td>
              <td class="p-3">
                 <Button icon="pi pi-pencil" class="p-button-text p-button-sm" v-permission="'taxes.manage'" />
              </td>
           </tr>
           <tr class="border-bottom hover-bg">
              <td class="p-3 font-bold">I.S.H (Estatal)</td>
              <td class="p-3 font-mono text-xs text-slate-600 bg-slate-50 p-2 border-round">space.category == 'Hospedaje'</td>
              <td class="p-3 text-green-700 font-bold">3%</td>
              <td class="p-3">
                 <Button icon="pi pi-pencil" class="p-button-text p-button-sm" v-permission="'taxes.manage'" />
              </td>
           </tr>
           <tr class="border-bottom hover-bg">
              <td class="p-3 font-bold">Retención Extranjeros</td>
              <td class="p-3 font-mono text-xs text-slate-600 bg-slate-50 p-2 border-round">client.country != 'MX'</td>
              <td class="p-3 text-green-700 font-bold">0% (Tasa Cero)</td>
              <td class="p-3">
                 <Button icon="pi pi-pencil" class="p-button-text p-button-sm" v-permission="'taxes.manage'" />
              </td>
           </tr>
         </tbody>
       </table>
    </div>

    <div class="p-3 bg-blue-50 border-1 border-blue-200 border-round text-sm text-blue-800">
      <i class="pi pi-info-circle mr-2"></i> **Snapshot Strategy:** Cualquier cambio en la tasa de I.V.A solo afectará cotizaciones futuras. Los recibos e históricos preservan el snapshot del impuesto congelado.
    </div>

  </div>
</template>

<script setup lang="ts">
import { usePermissionsStore } from '../stores/permissions';
import Button from 'primevue/button';

const permissionsStore = usePermissionsStore();
</script>

<style scoped>
.tax-builder { display: flex; flex-direction: column; gap: 1rem; }
.card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
.title { margin: 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.subtitle { margin: 0.25rem 0 0 0; font-size: 0.875rem; }
.border-bottom { border-bottom: 1px solid #e2e8f0; }
.hover-bg:hover { background-color: #f8fafc; }
.border-collapse { border-collapse: collapse; }

.flex { display: flex; }
.align-items-center { align-items: center; }
.justify-content-between { justify-content: space-between; }
.m-0 { margin: 0; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.pb-2 { padding-bottom: 0.5rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.mr-2 { margin-right: 0.5rem; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.font-bold { font-weight: 700; }
.font-mono { font-family: monospace; }
.w-full { width: 100%; }
.border-round { border-radius: 0.5rem; }
.border-1 { border-width: 1px; border-style: solid; }

.text-slate-600 { color: #475569; }
.text-slate-500 { color: #64748b; }
.text-green-700 { color: #15803d; }
.text-red-800 { color: #991b1b; }
.text-blue-800 { color: #1e40af; }
.bg-slate-50 { background-color: #f8fafc; }
.bg-red-50 { background-color: #fef2f2; }
.bg-blue-50 { background-color: #eff6ff; }
.border-blue-200 { border-color: #bfdbfe; }
</style>
