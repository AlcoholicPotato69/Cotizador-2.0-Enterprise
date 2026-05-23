<template>
  <div class="permission-debugger" v-permission="'system.audit'">
    <div class="card bg-slate-50 border-1 border-slate-200">
      <h3 class="m-0 mb-2 border-bottom pb-2 text-slate-800">
        <i class="pi pi-shield mr-2 text-indigo-500"></i> IAM Permission Debugger
      </h3>
      <p class="text-sm text-slate-500 mb-4">Auditoría en tiempo real del motor Hybrid RBAC (DENY > ALLOW > ROLE).</p>
      
      <div class="grid">
        <div class="col-12 lg:col-4">
          <label class="block text-xs font-bold mb-1 text-slate-700">Usuario ID</label>
          <input type="text" class="p-2 border-round border-1 border-slate-300 w-full" v-model="userId" placeholder="Ej. usr_888999" />
        </div>
        <div class="col-12 lg:col-4">
          <label class="block text-xs font-bold mb-1 text-slate-700">Tenant ID</label>
          <input type="text" class="p-2 border-round border-1 border-slate-300 w-full" v-model="tenantId" placeholder="Ej. pm_123" />
        </div>
        <div class="col-12 lg:col-4 flex align-items-end">
          <Button label="Ejecutar Trace" icon="pi pi-play" class="w-full bg-indigo-600 hover-bg-indigo-700 text-white" @click="runDebugger" />
        </div>
      </div>
      
      <div v-if="traceResult" class="mt-4 pt-3 border-top grid">
        <!-- Trace Layers -->
        <div class="col-12 lg:col-4">
           <h4 class="text-sm font-bold text-slate-700">1. Role Base Layer</h4>
           <div class="p-2 bg-white border-round border-1 border-slate-200 min-h-100">
             <span v-for="p in traceResult.rolePerms" :key="p" class="tag bg-slate-100 text-slate-600 mr-1 mb-1">{{ p }}</span>
             <span v-if="!traceResult.rolePerms.length" class="text-xs text-slate-400">Ninguno</span>
           </div>
        </div>
        
        <div class="col-12 lg:col-4">
           <h4 class="text-sm font-bold text-slate-700">2. Explicit ALLOW (+ OVR)</h4>
           <div class="p-2 bg-white border-round border-1 border-slate-200 min-h-100">
             <span v-for="p in traceResult.allows" :key="p" class="tag bg-green-100 text-green-700 mr-1 mb-1">+ {{ p }}</span>
             <span v-if="!traceResult.allows.length" class="text-xs text-slate-400">Ninguno</span>
           </div>
        </div>

        <div class="col-12 lg:col-4">
           <h4 class="text-sm font-bold text-slate-700">3. Explicit DENY (- OVR)</h4>
           <div class="p-2 bg-white border-round border-1 border-slate-200 min-h-100">
             <span v-for="p in traceResult.denies" :key="p" class="tag bg-red-100 text-red-700 mr-1 mb-1">- {{ p }}</span>
             <span v-if="!traceResult.denies.length" class="text-xs text-slate-400">Ninguno</span>
           </div>
        </div>

        <div class="col-12 mt-4 bg-indigo-50 p-3 border-round border-1 border-indigo-100">
           <h4 class="text-md font-bold text-indigo-900 m-0 mb-2">Effective Permissions (Resultado Matemático)</h4>
           <div class="flex flex-wrap gap-2">
             <span v-for="p in traceResult.effective" :key="p" class="tag bg-indigo-600 text-white shadow-1">{{ p }}</span>
           </div>
        </div>

        <div class="col-12 mt-3" v-if="Object.keys(traceResult.fls).length > 0">
           <h4 class="text-sm font-bold text-slate-700 border-bottom pb-1">Field Level Security (FLS) Activo</h4>
           <pre class="bg-slate-800 text-green-400 p-2 border-round text-xs">{{ traceResult.fls }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';

const userId = ref('usr_mock_123');
const tenantId = ref('tenant_plaza_mayor');
const traceResult = ref<any>(null);

const runDebugger = () => {
  // Mocking the backend trace logic based on the 4 Cases requested
  
  // Caso 2: Pierde acceso a función aunque su rol lo permita (Explicit DENY Override)
  traceResult.value = {
    rolePerms: ['quotes.read', 'quotes.create', 'spaces.read'],
    allows: ['contracts.read'], // Caso 1: Acceso adicional no incluido en rol
    denies: ['quotes.create'], // Caso 2: Deny mata el rol
    effective: ['quotes.read', 'spaces.read', 'contracts.read'], // El create desapareció.
    fls: {
      "quotes": {
        "descuento_especial": { "read": true, "write": false }
      }
    }
  };
};
</script>

<style scoped>
.permission-debugger { width: 100%; }
.card { border-radius: 0.75rem; padding: 1.5rem; }
.tag { font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; display: inline-block; font-weight: 500; }
.min-h-100 { min-height: 100px; }
.shadow-1 { box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.bg-indigo-600 { background-color: #4f46e5; }
.hover-bg-indigo-700:hover { background-color: #4338ca; }
.bg-indigo-50 { background-color: #eef2ff; }
.border-indigo-100 { border-color: #e0e7ff; }
.text-indigo-900 { color: #312e81; }
.text-indigo-500 { color: #6366f1; }
/* Rest of utility classes are similar to tailwind standard */
</style>
