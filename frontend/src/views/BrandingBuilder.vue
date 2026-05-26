<template>
  <div class="branding-builder h-full">
    <div class="view-header mb-3">
      <div class="flex justify-content-between align-items-center">
        <div>
          <h1 class="title">Branding Builder</h1>
          <p class="subtitle text-surface-500 dark:text-surface-400">Apariencia visual de cotizaciones, recibos y portal de clientes</p>
        </div>
        <DsButton label="Publicar Branding" severity="success" icon="pi pi-check" v-permission="'branding.manage'" :loading="saving" @click="saveBranding" />
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
                 <label class="block text-sm font-bold text-surface-700 dark:text-surface-200 mb-2">Logotipo del Recinto</label>
                 <div class="border-2 border-dashed border-surface-300 dark:border-surface-600 border-round p-4 text-center cursor-pointer hover-bg" :class="{'opacity-50': !canEdit}">
                    <i class="pi pi-cloud-upload text-3xl text-surface-400 dark:text-surface-500 mb-2"></i>
                    <span class="block text-sm text-surface-500 dark:text-surface-400">Arrastra un PNG o SVG (Max 5MB)</span>
                 </div>
               </div>

               <div>
                 <label class="block text-sm font-bold text-surface-700 dark:text-surface-200 mb-2">Color Primario (Acentos y Botones)</label>
                 <div class="flex gap-2 align-items-center">
                   <input type="color" v-model="branding.primary_color" class="w-3rem h-3rem p-0 border-none cursor-pointer border-round bg-transparent" :disabled="!canEdit" />
                   <input type="text" v-model="branding.primary_color" class="flex-1 p-2 border-round border-1 border-surface-300 dark:border-surface-600 font-mono text-sm bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0" :disabled="!canEdit" />
                 </div>
               </div>

               <div>
                 <label class="block text-sm font-bold text-surface-700 dark:text-surface-200 mb-2">Color Secundario (Fondos)</label>
                 <div class="flex gap-2 align-items-center">
                   <input type="color" v-model="branding.secondary_color" class="w-3rem h-3rem p-0 border-none cursor-pointer border-round bg-transparent" :disabled="!canEdit" />
                   <input type="text" v-model="branding.secondary_color" class="flex-1 p-2 border-round border-1 border-surface-300 dark:border-surface-600 font-mono text-sm bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0" :disabled="!canEdit" />
                 </div>
               </div>

               <div>
                 <label class="block text-sm font-bold text-surface-700 dark:text-surface-200 mb-2">Tipografía Corporativa</label>
                 <select class="w-full p-2 border-round border-1 border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0" v-model="branding.font_family" :disabled="!canEdit">
                    <option value="Inter">Inter (Default)</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Playfair Display">Playfair Display (Elegante)</option>
                 </select>
               </div>
            </template>
         </div>
      </div>

      <!-- Branding Preview Engine -->
      <div class="col-12 lg:col-8">
         <div class="card h-full p-0 flex flex-column bg-surface-50 dark:bg-surface-950 border-1 border-surface-200 dark:border-surface-700 overflow-hidden">
            <div class="p-3 border-bottom bg-surface-0 dark:bg-surface-900 flex justify-content-between align-items-center">
               <span class="font-bold text-surface-700 dark:text-surface-200"><i class="pi pi-eye mr-2"></i> Branding Preview Engine</span>
               <select class="p-2 border-round border-1 border-surface-300 dark:border-surface-600 text-sm">
                 <option>Vista: Cotización PDF</option>
                 <option>Vista: Contrato Legal</option>
                 <option>Vista: Recibo de Pago</option>
                 <option>Vista: Portal del Cliente</option>
               </select>
            </div>
            <div class="flex-1 p-4 overflow-auto flex justify-content-center align-items-start">
               <!-- Iframe Mock / Preview Sheet -->
               <div class="bg-surface-0 dark:bg-surface-900 shadow-2 w-full max-w-30rem p-5 border-round transition-colors transition-duration-300" :style="{ minHeight: '400px', borderTop: `6px solid ${branding.primary_color}` }">
                  <!-- Logo Placeholder -->
                  <div class="w-4rem h-4rem bg-surface-200 dark:bg-surface-700 border-circle mb-4 flex align-items-center justify-content-center">
                     <i class="pi pi-image text-surface-400 dark:text-surface-500"></i>
                  </div>
                  
                  <h2 class="m-0 mb-2 transition-colors transition-duration-300" :style="{ fontFamily: `${branding.font_family}, sans-serif`, color: branding.primary_color }">Cotización Formal</h2>
                  <p class="text-sm text-surface-500 dark:text-surface-400 mb-4" :style="{ fontFamily: `${branding.font_family}, sans-serif`}">Generada automáticamente respetando los lineamientos gráficos del Tenant.</p>

                  <div class="p-3 border-round mb-3 transition-colors transition-duration-300" :style="{ backgroundColor: branding.secondary_color, border: '1px solid #e2e8f0' }">
                     <div class="flex justify-content-between mb-2">
                        <span class="text-sm font-bold" :style="{ color: branding.primary_color }">Total a Pagar</span>
                        <span class="text-sm font-bold" :style="{ color: branding.primary_color }">$120,000.00</span>
                     </div>
                     <div class="w-full border-round h-1rem transition-colors transition-duration-300" :style="{ backgroundColor: branding.primary_color }"></div>
                  </div>

                  <DsButton label="Aceptar Cotización" class="w-full border-none transition-colors transition-duration-300" :style="{ backgroundColor: branding.primary_color, color: 'white', fontFamily: `${branding.font_family}, sans-serif` }" />
               </div>
            </div>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { tenantService } from '../services/tenantService';
import { useTenantStore } from '../stores/tenantStore';
import { usePermissionsStore } from '../stores/permissionsStore';
import { useNotificationStore } from '../stores/notificationStore';

const tenantStore = useTenantStore();
const permissionsStore = usePermissionsStore();
const notificationStore = useNotificationStore();
const canEdit = computed(() => permissionsStore.hasPermission('branding.manage'));

const saving = ref(false);
const branding = ref({
  primary_color: '#0f172a',
  secondary_color: '#f8fafc',
  font_family: 'Inter'
});

onMounted(async () => {
  if (tenantStore.activeTenant?.id) {
    try {
      const tenant = await tenantService.getTenantById(tenantStore.activeTenant.id);
      if (tenant && tenant.branding) {
        branding.value = { ...branding.value, ...tenant.branding };
      }
    } catch(e) {
      console.warn("Could not load tenant branding", e);
    }
  }
});

const saveBranding = async () => {
  if (!tenantStore.activeTenant?.id) return;
  saving.value = true;
  try {
    await tenantService.updateTenant(tenantStore.activeTenant.id, {
      branding: branding.value
    });
    notificationStore.addNotification({ type: 'success', message: 'Branding actualizado con éxito.', domainEvent: 'UPDATE_SUCCESS' });
  } catch(e) {
    notificationStore.addNotification({ type: 'error', message: 'Error actualizando branding.', domainEvent: 'UPDATE_ERROR' });
    console.error(e);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.branding-builder { display: flex; flex-direction: column; gap: 1rem; }
.card { background: var(--tenant-surface-0); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid var(--tenant-surface-200); }
.dark .card { background: var(--tenant-surface-900); border-color: var(--tenant-surface-700); }
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

.text-surface-700 { color: #334155; }
.text-surface-500 { color: #64748b; }
.text-surface-400 { color: #94a3b8; }
.text-red-800 { color: #991b1b; }
.bg-surface-50 { background-color: #f8fafc; }
.bg-surface-200 { background-color: #e2e8f0; }
.bg-surface-0 { background-color: var(--tenant-surface-0); }
.bg-red-50 { background-color: #fef2f2; }
.border-surface-200 { border-color: #e2e8f0; }
.border-surface-300 { border-color: #cbd5e1; }
</style>




