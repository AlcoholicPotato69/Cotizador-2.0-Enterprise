const fs = require('fs');
const path = require('path');

const devComponentsDir = path.join(__dirname, 'frontend', 'src', 'components', 'dev');
const devViewsDir = path.join(__dirname, 'frontend', 'src', 'views', 'devtools');
const routerDir = path.join(__dirname, 'frontend', 'src', 'router', 'modules');

[devComponentsDir, devViewsDir, routerDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const files = {
    // === DEV TOOLBAR ===
    [path.join(devComponentsDir, 'DevToolbar.vue')]: `<template>
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
import { useRouter } from 'vue-router';

const tenantStore = useTenantStore();
const themeStore = useThemeStore();
const router = useRouter();

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
</script>`,

    // === PERMISSION SIMULATOR ===
    [path.join(devComponentsDir, 'PermissionSimulator.vue')]: `<template>
  <div class="p-6 bg-surface-0 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 space-y-6">
    <div class="border-b pb-4">
      <h2 class="text-xl font-bold font-mono">RBAC Sandbox</h2>
      <p class="text-sm text-surface-500">Validador de reglas lógicas: DENY > ALLOW > ROLE</p>
    </div>
    
    <div class="grid grid-cols-3 gap-6">
      <div class="p-4 border rounded bg-surface-50 dark:bg-surface-950">
        <h3 class="font-bold mb-3 text-red-500 flex items-center gap-2">
          <span>⛔ DENY Rules</span>
          <span class="text-[10px] bg-red-100 text-red-800 px-1 rounded">Prioridad 1</span>
        </h3>
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked> client.delete</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox"> contract.approve</label>
        </div>
      </div>

      <div class="p-4 border rounded bg-surface-50 dark:bg-surface-950">
        <h3 class="font-bold mb-3 text-green-500 flex items-center gap-2">
          <span>✅ ALLOW Rules</span>
          <span class="text-[10px] bg-green-100 text-green-800 px-1 rounded">Prioridad 2</span>
        </h3>
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked> contract.approve</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox"> client.banking.update</label>
        </div>
      </div>

      <div class="p-4 border rounded bg-surface-50 dark:bg-surface-950">
        <h3 class="font-bold mb-3 text-blue-500 flex items-center gap-2">
          <span>👥 ROLE Base</span>
          <span class="text-[10px] bg-blue-100 text-blue-800 px-1 rounded">Prioridad 3</span>
        </h3>
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked disabled> client.read</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked disabled> client.create</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked disabled> client.delete</label>
        </div>
      </div>
    </div>

    <div class="p-4 bg-surface-900 text-green-400 font-mono text-sm rounded mt-4">
      <div class="text-surface-500 mb-2">// Resultados Evaluados en Tiempo Real:</div>
      <div>> can('client.read') // true (Heredado de ROLE)</div>
      <div>> can('client.create') // true (Heredado de ROLE)</div>
      <div class="text-red-400">> can('client.delete') // false (DENY sobreescribe ROLE)</div>
      <div>> can('contract.approve') // true (ALLOW otorgado explícitamente)</div>
    </div>
  </div>
</template>`,

    // === DEVTOOLS VIEWS & ROUTER ===
    [path.join(devViewsDir, 'DevtoolsIndex.vue')]: `<template>
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
          <pre>{{ JSON.stringify({ theme: themeStore.mode, tenant: tenantStore.activeTenant }, null, 2) }}</pre>
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
</script>`,

    [path.join(routerDir, 'devtools.ts')]: `export default [
  {
    path: '/devtools',
    name: 'DevtoolsCenter',
    component: () => import('../../views/devtools/DevtoolsIndex.vue'),
    beforeEnter: (to, from, next) => {
      if (import.meta.env.VITE_APP_ENV !== 'development') {
        next('/');
      } else {
        next();
      }
    }
  }
];`
};

for (const [filename, content] of Object.entries(files)) {
    fs.writeFileSync(filename, content, 'utf8');
    console.log('Creado: ' + filename);
}

console.log('Devtools Architecture generated successfully.');
