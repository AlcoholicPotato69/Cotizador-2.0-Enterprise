<template>
  <div class="h-full flex flex-col space-y-6">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-display font-bold text-surface-900 dark:text-surface-0 tracking-tight">Centro de Control de Entorno</h1>
        <p class="text-sm text-surface-500 mt-1 font-body">Ajustes globales del Tenant y configuración operativa (Settings Registry Engine).</p>
      </div>
      <div class="flex items-center gap-3">
        <DsButton 
          icon="pi pi-save" 
          label="Guardar Configuración" 
          @click="saveAllSettings" 
          :loading="settingsStore.loading" 
          class="bg-primary-600 hover:bg-primary-500 text-surface-0 border-none px-4 py-2 font-medium text-sm rounded-md" 
        />
      </div>
    </header>
    
    <div v-if="settingsStore.loading && settingsStore.settings.length === 0" class="flex justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
    
    <div v-else class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
       <div class="bg-surface-0 dark:bg-surface-800 rounded-3xl border border-surface-200 dark:border-white/5 shadow-sm p-6 overflow-y-auto">
          <h2 class="font-bold mb-4 text-xl">Identidad</h2>
          <p class="text-sm text-surface-500 mb-6">Logo, nombre y variables gráficas.</p>
          
          <div class="space-y-4">
             <div v-for="setting in identitySettings" :key="setting.id || setting.key" class="field flex flex-col gap-2">
               <label class="text-sm font-semibold text-surface-700 dark:text-surface-300">
                 {{ formatLabel(setting.key) }}
                 <span v-if="setting.description" class="text-xs text-surface-400 block font-normal">{{ setting.description }}</span>
               </label>
               
               <template v-if="setting.type === 'string'">
                 <DsInput v-model="setting.value" class="w-full" />
               </template>
               <template v-else-if="setting.type === 'number'">
                 <DsInputNumber v-model="setting.value" class="w-full" />
               </template>
               <template v-else-if="setting.type === 'boolean'">
                 <ToggleSwitch v-model="setting.value" />
               </template>
             </div>
             
             <div v-if="identitySettings.length === 0" class="text-sm text-surface-400 italic">
               No hay configuraciones de identidad definidas en el registro.
             </div>
          </div>
       </div>
       
       <div class="bg-surface-0 dark:bg-surface-800 rounded-3xl border border-surface-200 dark:border-white/5 shadow-sm p-6 overflow-y-auto">
          <h2 class="font-bold mb-4 text-xl">Parámetros Financieros</h2>
          <p class="text-sm text-surface-500 mb-6">Impuestos, folios y prefijos.</p>
          
          <div class="space-y-4">
             <div v-for="setting in financeSettings" :key="setting.id || setting.key" class="field flex flex-col gap-2">
               <label class="text-sm font-semibold text-surface-700 dark:text-surface-300">
                 {{ formatLabel(setting.key) }}
                 <span v-if="setting.description" class="text-xs text-surface-400 block font-normal">{{ setting.description }}</span>
               </label>
               
               <template v-if="setting.type === 'string'">
                 <DsInput v-model="setting.value" class="w-full" />
               </template>
               <template v-else-if="setting.type === 'number'">
                 <DsInputNumber v-model="setting.value" class="w-full" />
               </template>
               <template v-else-if="setting.type === 'boolean'">
                 <ToggleSwitch v-model="setting.value" />
               </template>
             </div>
             
             <div v-if="financeSettings.length === 0" class="text-sm text-surface-400 italic">
               No hay configuraciones financieras definidas en el registro.
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useSettingsStore } from '../stores/settingsStore';
import { useToast } from 'primevue/usetoast';
import type { Setting } from '../types/settings';

const settingsStore = useSettingsStore();
const toast = useToast();

const identitySettings = computed(() => settingsStore.settings.filter(s => s.category === 'identity'));
const financeSettings = computed(() => settingsStore.settings.filter(s => s.category === 'finance'));

onMounted(async () => {
  try {
    // Load all settings
    await settingsStore.loadSettings();
    
    // Seed some defaults if they don't exist
    seedDefaults();
  } catch (error) {
    console.error('Error loading settings:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las configuraciones globales.', life: 3000 });
  }
});

const formatLabel = (key: string) => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const seedDefaults = () => {
  // Normally the backend should supply these, but we ensure they exist in UI for demo/test purposes
  const defaults: Setting[] = [
    { category: 'identity', key: 'tenant_name', value: 'Empresa Demo', type: 'string', description: 'Nombre oficial de la empresa.' },
    { category: 'identity', key: 'primary_color', value: '#4f46e5', type: 'string', description: 'Color primario de la marca.' },
    { category: 'finance', key: 'default_vat', value: 16, type: 'number', description: 'Porcentaje de IVA por defecto.' },
    { category: 'finance', key: 'invoice_prefix', value: 'FAC-', type: 'string', description: 'Prefijo para las facturas generadas.' },
    { category: 'finance', key: 'enable_discounts', value: true, type: 'boolean', description: 'Permitir descuentos manuales en cotizaciones.' },
  ];
  
  defaults.forEach(def => {
    if (!settingsStore.settings.some(s => s.category === def.category && s.key === def.key)) {
      settingsStore.settings.push(def);
    }
  });
};

const saveAllSettings = async () => {
  try {
    const changes = [...identitySettings.value, ...financeSettings.value];
    await settingsStore.bulkSave(changes);
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Configuraciones guardadas correctamente.', life: 3000 });
  } catch (error) {
    console.error('Error saving settings:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron guardar las configuraciones.', life: 3000 });
  }
};
</script>

