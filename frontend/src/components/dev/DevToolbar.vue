<template>
  <div class="fixed bottom-0 left-0 right-0 h-12 bg-surface-900 text-surface-50 z-[9999] flex items-center justify-between px-4 text-xs font-mono border-t-2 border-red-500 shadow-2xl">
    <div class="flex items-center gap-4">
      <div class="font-bold text-red-500 bg-red-900/30 px-2 py-1 rounded">DEV MODE</div>
      
      <!-- User Switcher -->
      <div class="flex items-center gap-2">
        <span class="text-surface-400">User:</span>
        <select class="bg-surface-800 border-none outline-none text-surface-50 py-1 px-2 rounded cursor-pointer hover:bg-surface-700" @change="switchUser($event)">
          <option value="superadmin">SuperAdmin</option>
          <option value="comercial_pm">Comercial PM</option>
          <option value="finanzas_pm">Finanzas PM</option>
          <option value="operaciones_pm">Operaciones PM</option>
          <option value="comercial_cp">Comercial CP</option>
          <option value="finanzas_cp">Finanzas CP</option>
          <option value="operaciones_cp">Operaciones CP</option>
        </select>
      </div>

      <!-- Tenant Switcher -->
      <div class="flex items-center gap-2">
        <span class="text-surface-400">Tenant:</span>
        <select v-model="tenantStore.activeTenant" class="bg-surface-800 border-none outline-none text-surface-50 py-1 px-2 rounded cursor-pointer hover:bg-surface-700">
          <option value="pm">Plaza Mayor (PM)</option>
          <option value="cp">Casa de Piedra (CP)</option>
        </select>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button @click="$router.push('/devtools')" class="hover:text-primary-400 transition-colors bg-surface-800 px-3 py-1 rounded border border-surface-700">
        🛠 Devtools Center
      </button>
      <button @click="themeStore.toggleMode()" class="hover:text-primary-400 transition-colors bg-surface-800 px-3 py-1 rounded border border-surface-700">
        Toggle {{ themeStore.mode }}
      </button>
      <button @click="triggerNotification" class="hover:text-primary-400 transition-colors bg-surface-800 px-3 py-1 rounded border border-surface-700">
        🔔 Emit Mock SSE
      </button>
      <button @click="seedDB" class="text-red-400 hover:text-red-300 transition-colors bg-red-900/20 px-3 py-1 rounded border border-red-900/50">
        🌱 Seed Data
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTenantStore } from '../../stores/tenantStore';
import { useThemeStore } from '../../stores/themeStore';

const tenantStore = useTenantStore();
const themeStore = useThemeStore();

function switchUser(event: any) {
  console.log('Switching user to', event.target.value);
  // Re-init auth logic here
}

function triggerNotification() {
  console.log('Mock notification emitted: quote.approved');
  alert('Simulando SSE: quote.approved');
}

function seedDB() {
  console.log('Running Dev Seed...');
  alert('Seeding Database with Dev_Data_Strategy...');
}
</script>