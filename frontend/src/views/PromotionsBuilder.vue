<template>
  <div class="p-4 md:p-8 max-w-[1400px] mx-auto flex flex-col gap-8 w-full animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-0/50 dark:bg-surface-900/50 backdrop-blur-xl p-6 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 shadow-sm">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <i class="pi pi-bolt text-white text-xl"></i>
        </div>
        <div>
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-0 m-0">Constructor de Reglas</h1>
          <p class="text-surface-500 dark:text-surface-400 m-0 mt-1 text-sm">Gestor de descuentos dinámicos (Rule Engine)</p>
        </div>
      </div>
      <DsButton label="Nueva Regla" icon="pi pi-plus" class="p-button-primary p-button-rounded px-5 font-medium shadow-md transition-transform hover:scale-105" @click="createNewRule" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Listado de Promociones -->
      <div class="lg:col-span-5 flex flex-col gap-6">
        <div class="bg-surface-0 dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6 flex-1">
           <h3 class="text-lg font-bold text-surface-900 dark:text-surface-0 mb-4 pb-4 border-b border-surface-100 dark:border-surface-800 flex items-center gap-2">
             <i class="pi pi-list text-purple-500"></i> Promociones Activas
           </h3>
           
           <div class="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-xl mb-4 text-sm font-medium border border-red-200 dark:border-red-800/50" v-if="!hasPermission">
              <i class="pi pi-ban mr-2"></i> No tienes permisos para gestionar reglas comerciales.
           </div>

           <div v-else class="flex flex-col gap-3">
             <div 
               v-for="(rule, idx) in activeRules" :key="idx"
               class="group p-4 rounded-xl border border-surface-200 dark:border-surface-700 hover:border-purple-300 dark:hover:border-purple-700 bg-surface-50 dark:bg-surface-950/50 hover:bg-surface-0 dark:hover:bg-surface-900 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md flex justify-between items-center"
               @click="selectRule(rule)"
               :class="{'border-purple-500 dark:border-purple-500 ring-1 ring-purple-500 bg-purple-50/50 dark:bg-purple-900/10': selectedRule?.id === rule.id}"
             >
                <div class="flex-1">
                   <span class="font-bold block text-surface-900 dark:text-surface-0 mb-1">{{ rule.name }}</span>
                   <span class="text-xs text-surface-500 dark:text-surface-400 block font-mono bg-surface-200/50 dark:bg-surface-800/50 p-1 rounded inline-block mb-2">{{ formatCondition(rule.condition) }}</span>
                   <span class="text-xs text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                     <i class="pi pi-tag text-[10px]"></i> Descuento: -{{ rule.discount }}%
                   </span>
                </div>
                <DsTag severity="success" :value="'v' + rule.version" class="ml-3 font-mono text-[10px]" v-tooltip.top="'Versión Inmutable'" />
             </div>
           </div>
        </div>
      </div>

      <!-- Builder / Simulator Panel -->
      <div class="lg:col-span-7 flex flex-col gap-6">
         <!-- Builder Form -->
         <div class="bg-surface-0 dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6">
            <h3 class="text-lg font-bold text-surface-900 dark:text-surface-0 mb-4 pb-4 border-b border-surface-100 dark:border-surface-800 flex items-center gap-2">
              <i class="pi pi-cog text-purple-500"></i> Editor Lógico
            </h3>
            
            <div v-if="selectedRule" class="flex flex-col gap-5">
              <div class="field">
                <label class="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Nombre de la Regla</label>
                <DsInput v-model="selectedRule.name" class="w-full rounded-xl border-surface-300 dark:border-surface-600" />
              </div>

              <!-- Logic Builder -->
              <div class="bg-surface-50 dark:bg-surface-950 p-4 rounded-xl border border-surface-200 dark:border-surface-800">
                <label class="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-3">Si (Condición)</label>
                <div class="flex flex-col sm:flex-row gap-3">
                  <select v-model="selectedRule.condition.field" class="flex-1 p-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0 outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="client.type">client.type</option>
                    <option value="quote.duration_days">quote.duration_days</option>
                    <option value="event.season">event.season</option>
                  </select>
                  <select v-model="selectedRule.condition.operator" class="w-24 p-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0 outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="==">==</option>
                    <option value=">">></option>
                    <option value="<"><</option>
                    <option value="!=">!=</option>
                  </select>
                  <DsInput v-model="selectedRule.condition.value" class="flex-1 rounded-xl border-surface-300 dark:border-surface-600" placeholder="Valor..." />
                </div>
              </div>

              <!-- Action Builder -->
              <div class="bg-surface-50 dark:bg-surface-950 p-4 rounded-xl border border-surface-200 dark:border-surface-800">
                <label class="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-3">Entonces (Acción)</label>
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium text-surface-600 dark:text-surface-400">Aplicar Descuento del</span>
                  <DsInputNumber v-model="selectedRule.discount" suffix="%" :min="0" :max="100" class="w-32" :pt="{ input: { class: 'rounded-xl border-surface-300 dark:border-surface-600 text-center font-bold text-purple-600' } }" />
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
                <DsButton label="Guardar Regla" icon="pi pi-save" class="p-button-primary p-button-rounded px-6 font-medium" @click="saveRule" />
              </div>
            </div>

            <div v-else class="py-12 flex flex-col items-center justify-center text-surface-400 dark:text-surface-500 text-center">
              <i class="pi pi-sitemap text-4xl mb-3"></i>
              <p>Selecciona o crea una regla para comenzar a editar.</p>
            </div>
         </div>

         <!-- Simulator Panel -->
         <div class="bg-surface-0 dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6">
            <h3 class="text-lg font-bold text-surface-900 dark:text-surface-0 mb-4 pb-4 border-b border-surface-100 dark:border-surface-800 flex items-center gap-2">
              <i class="pi pi-play-circle text-emerald-500"></i> Rule Simulator
            </h3>
            <p class="text-sm text-surface-500 dark:text-surface-400 mb-6">Inyecta un contexto ficticio para validar la evaluación de las reglas.</p>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
               <div>
                 <label class="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-2 uppercase tracking-wider">client.type</label>
                 <select v-model="simulationContext.clientType" class="w-full p-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0 outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="Nuevo">Nuevo</option>
                    <option value="Frecuente">Frecuente</option>
                 </select>
               </div>
               <div>
                 <label class="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-2 uppercase tracking-wider">event.season</label>
                 <select v-model="simulationContext.eventSeason" class="w-full p-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0 outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="high">High Season</option>
                    <option value="low">Low Season</option>
                 </select>
               </div>
               <div>
                 <label class="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-2 uppercase tracking-wider">Precio Original</label>
                 <DsInputNumber v-model="simulationContext.basePrice" mode="currency" currency="MXN" locale="es-MX" class="w-full" :pt="{ input: { class: 'rounded-xl border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-950 font-mono' } }" />
               </div>
            </div>
            
            <div class="flex justify-end mb-6">
              <DsButton label="Ejecutar Simulación" icon="pi pi-bolt" class="p-button-success p-button-rounded px-6 font-medium shadow-md" @click="runSimulation" />
            </div>

            <div v-if="simulationResult" class="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl relative overflow-hidden">
               <div class="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
               <h4 class="m-0 mb-3 text-emerald-800 dark:text-emerald-400 font-bold flex items-center gap-2">
                 <i class="pi pi-check-circle"></i> Resultado del Rule Engine
               </h4>
               
               <ul class="text-sm text-emerald-900 dark:text-emerald-300 m-0 pl-0 list-none space-y-2 mb-4 font-mono">
                 <li v-for="(log, i) in simulationResult.logs" :key="i" class="flex items-center gap-2">
                   <i class="pi pi-angle-right text-[10px]"></i> {{ log }}
                 </li>
               </ul>
               
               <div class="pt-4 border-t border-emerald-200/50 dark:border-emerald-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span class="font-bold text-emerald-800 dark:text-emerald-400 text-sm uppercase tracking-wider">Precio Final Calculado:</span>
                  <div class="flex items-baseline gap-2">
                    <span class="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-300">{{ formatCurrency(simulationResult.finalPrice) }}</span>
                    <span v-if="simulationResult.totalDiscount > 0" class="text-sm font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full shadow-sm">-{{ simulationResult.totalDiscount }}%</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePermissionsStore } from '../stores/permissionsStore';
import { useNotificationStore } from '../stores/notificationStore';


const permissionsStore = usePermissionsStore();
const notificationStore = useNotificationStore();

const hasPermission = computed(() => {
  return permissionsStore.hasPermission('promotions.manage');
});

interface RuleCondition {
  field: string;
  operator: string;
  value: string;
}

interface Rule {
  id: string;
  name: string;
  condition: RuleCondition;
  discount: number;
  version: number;
}

const activeRules = ref<Rule[]>([
  {
    id: 'r1',
    name: 'Descuento de Temporada Baja',
    condition: { field: 'event.season', operator: '==', value: 'low' },
    discount: 15,
    version: 3
  },
  {
    id: 'r2',
    name: 'Premio Cliente Frecuente',
    condition: { field: 'client.type', operator: '==', value: 'Frecuente' },
    discount: 10,
    version: 1
  }
]);

const selectedRule = ref<Rule | null>(null);

const selectRule = (rule: Rule) => {
  // Create a deep copy to edit without affecting the list directly until saved
  selectedRule.value = JSON.parse(JSON.stringify(rule));
};

const createNewRule = () => {
  selectedRule.value = {
    id: 'new_' + Date.now(),
    name: 'Nueva Regla',
    condition: { field: 'client.type', operator: '==', value: '' },
    discount: 0,
    version: 1
  };
};

const saveRule = () => {
  if (!selectedRule.value) return;
  
  const existingIdx = activeRules.value.findIndex(r => r.id === selectedRule.value!.id);
  if (existingIdx >= 0) {
    selectedRule.value.version++;
    activeRules.value[existingIdx] = { ...selectedRule.value };
    notificationStore.addNotification({ type: 'success', message: 'Regla actualizada (v' + selectedRule.value.version + ')', domainEvent: 'RULE_UPDATED' });
  } else {
    activeRules.value.push({ ...selectedRule.value });
    notificationStore.addNotification({ type: 'success', message: 'Nueva regla activada', domainEvent: 'RULE_CREATED' });
  }
};

const formatCondition = (cond: RuleCondition) => {
  return `${cond.field} ${cond.operator} '${cond.value}'`;
};

// Simulator Logic
const simulationContext = ref({
  clientType: 'Frecuente',
  eventSeason: 'low',
  basePrice: 100000
});

const simulationResult = ref<any>(null);

const formatCurrency = (val: number) => {
  return val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

const runSimulation = () => {
  const logs: string[] = [];
  let totalDiscount = 0;
  
  activeRules.value.forEach(rule => {
    let contextValue = '';
    if (rule.condition.field === 'client.type') contextValue = simulationContext.value.clientType;
    if (rule.condition.field === 'event.season') contextValue = simulationContext.value.eventSeason;
    
    // Evaluate (basic rule evaluator)
    let isMatch = false;
    if (rule.condition.operator === '==') isMatch = (contextValue === rule.condition.value);
    if (rule.condition.operator === '!=') isMatch = (contextValue !== rule.condition.value);
    
    if (isMatch) {
      logs.push(`Regla '${rule.name}' aplicó: -${rule.discount}% (Condición: ${formatCondition(rule.condition)} es VERDADERA)`);
      totalDiscount += rule.discount;
    } else {
      logs.push(`Regla '${rule.name}' ignorada. (Condición es FALSA)`);
    }
  });

  // Cap max discount at 100% just in case
  totalDiscount = Math.min(totalDiscount, 100);
  
  const discountAmount = simulationContext.value.basePrice * (totalDiscount / 100);
  const finalPrice = simulationContext.value.basePrice - discountAmount;

  if (totalDiscount === 0) {
    logs.push("No se aplicó ninguna regla de descuento.");
  }

  simulationResult.value = {
    logs,
    totalDiscount,
    finalPrice
  };
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

