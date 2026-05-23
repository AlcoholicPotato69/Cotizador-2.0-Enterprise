<template>
  <div class="dashboard-layout bg-slate-50 min-h-screen p-4">
    <!-- Expediente-Centric Navigation Header -->
    <header class="flex justify-content-between align-items-center mb-5 border-bottom pb-3">
      <div class="flex align-items-center gap-3">
        <!-- Branding Preservation (Tenant Asset) -->
        <img v-if="branding?.logo_url" :src="branding.logo_url" alt="Tenant Logo" class="h-3rem" />
        <h2 class="m-0 text-slate-800 font-bold tracking-tight">Expediente Central</h2>
      </div>
      <div class="flex gap-2">
         <Button label="Client File" icon="pi pi-users" class="p-button-text" v-permission="'clients.read'" />
         <Button label="Quote File" icon="pi pi-file" class="p-button-text" v-permission="'quotes.read'" />
         <Button label="Contract File" icon="pi pi-verified" class="p-button-text" v-permission="'contracts.read'" />
      </div>
    </header>

    <div class="grid">
      <!-- Widgets Dinámicos (Solo renderizados si Tenant lo permite && el usuario tiene el Permiso) -->
      
      <!-- Widget: Finanzas (Operaciones / Finanzas) -->
      <div class="col-12 lg:col-4" v-if="isWidgetActive('finance_summary')" v-permission="'invoices.read'">
        <div class="card p-4 border-round-xl border-1 border-slate-200 shadow-sm bg-white hover-shadow transition-all">
          <div class="flex justify-content-between align-items-center mb-3">
            <span class="text-sm font-bold text-slate-500 uppercase">Cuentas por Cobrar</span>
            <i class="pi pi-dollar text-green-500 text-xl"></i>
          </div>
          <div class="text-3xl font-bold text-slate-800 mb-1">$1,245,000.00</div>
          <span class="text-xs text-green-600 bg-green-50 px-2 py-1 border-round">+14% vs mes anterior</span>
        </div>
      </div>

      <!-- Widget: Auditoría y Verificación (Verificador) -->
      <div class="col-12 lg:col-4" v-if="isWidgetActive('verification_queue')" v-permission="'system.audit'">
        <div class="card p-4 border-round-xl border-1 border-slate-200 shadow-sm bg-white hover-shadow transition-all">
          <div class="flex justify-content-between align-items-center mb-3">
            <span class="text-sm font-bold text-slate-500 uppercase">Cola de Verificación</span>
            <i class="pi pi-check-circle text-orange-500 text-xl"></i>
          </div>
          <div class="text-3xl font-bold text-slate-800 mb-1">12</div>
          <span class="text-xs text-slate-500">Expedientes pendientes de revisión documental</span>
        </div>
      </div>

      <!-- Widget: Comercial (Ventas / Comercial) -->
      <div class="col-12 lg:col-4" v-if="isWidgetActive('active_quotes')" v-permission="'quotes.read'">
        <div class="card p-4 border-round-xl border-1 border-slate-200 shadow-sm bg-white hover-shadow transition-all">
          <div class="flex justify-content-between align-items-center mb-3">
            <span class="text-sm font-bold text-slate-500 uppercase">Cotizaciones Activas</span>
            <i class="pi pi-file-export text-indigo-500 text-xl"></i>
          </div>
          <div class="text-3xl font-bold text-slate-800 mb-1">45</div>
          <span class="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 border-round">7 por vencer hoy</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';

// Mocking Tenant Store Settings for Dashboard Config
const tenantSettings = ref({
  active_widgets: ['finance_summary', 'active_quotes', 'verification_queue']
});

const branding = ref({
  logo_url: '/assets/pm-logo.svg' // Loaded via PB Snapshot
});

const isWidgetActive = (widgetId: string) => {
  return tenantSettings.value.active_widgets.includes(widgetId);
};
</script>

<style scoped>
.hover-shadow:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
.transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.tracking-tight { letter-spacing: -0.025em; }
.border-round-xl { border-radius: 0.75rem; }
/* Standard Tailwind/PrimeFlex classes applied */
</style>
