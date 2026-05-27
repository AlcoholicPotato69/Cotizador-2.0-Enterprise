<template>
  <div class="p-8 space-y-8 max-w-7xl mx-auto pb-32">
    <div>
      <h1 class="text-3xl font-black font-mono">Devtools Center</h1>
      <p class="text-surface-500">Central de diagnóstico y simulación (Solo disponible en VITE_APP_ENV=development).</p>
    </div>

    <PermissionSimulator />
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="p-6 bg-surface-0 dark:bg-surface-900 border rounded-lg">
        <h2 class="font-bold mb-2 font-mono">Mock Data Generators</h2>
        <div class="space-y-2 flex flex-col items-start">
          <button class="text-sm bg-surface-100 dark:bg-surface-800 px-3 py-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-700 w-full text-left">
            📇 Generar Clientes CP vs PM
          </button>
          <button class="text-sm bg-surface-100 dark:bg-surface-800 px-3 py-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-700 w-full text-left">
            📅 Generar Calendario (Eventos vs Publicidad)
          </button>
          <button class="text-sm bg-surface-100 dark:bg-surface-800 px-3 py-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-700 w-full text-left">
            📄 Generar Documentos (PDF, XML, Img)
          </button>
        </div>
      </div>
      
      <div class="p-6 bg-surface-0 dark:bg-surface-900 border rounded-lg">
        <h2 class="font-bold mb-2 font-mono">Stores Inspector</h2>
        <div class="bg-surface-950 text-green-400 p-4 rounded text-xs font-mono overflow-auto h-40">
          <pre>{{ JSON.stringify({ theme: themeStore.theme, tenant: tenantStore.activeTenant }, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import PermissionSimulator from '../../components/dev/PermissionSimulator.vue';
import { useThemeStore } from '../../stores/themeStore';
import { useTenantStore } from '../../stores/tenantStore';

const themeStore = useThemeStore();
const tenantStore = useTenantStore();
</script>

