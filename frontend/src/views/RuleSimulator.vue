<template>
  <div class="rule-simulator">
    <div class="view-header mb-4">
      <h1 class="title">Simulador de Reglas Empresarial</h1>
      <p class="subtitle">Prueba configuraciones de negocio, precios y elegibilidad sin afectar producción.</p>
    </div>

    <div class="grid">
      <!-- Panel de Contexto de Prueba -->
      <div class="col-12 md:col-6">
        <div class="card">
          <h3>1. Definir Contexto (Entradas)</h3>
          <p class="text-sm text-slate-500 mb-3">Simula las variables exactas que el sistema recibe al cotizar o verificar un cliente.</p>
          
          <div class="field mb-3">
            <label class="block font-bold mb-1">Tipo de Simulación</label>
            <select v-model="simulationType" class="p-inputtext w-full">
              <option value="pricing">Precio y Promociones</option>
              <option value="eligibility">Elegibilidad de Cliente</option>
            </select>
          </div>

          <div class="field mb-3">
            <label class="block font-bold mb-1">Contexto JSON</label>
            <textarea v-model="contextJSON" rows="12" class="p-inputtext w-full font-mono text-sm" placeholder="{ 'espacio': { 'categoria': 'Digitales' } }"></textarea>
            <small class="text-green-600" v-if="isValidJSON">JSON Válido</small>
            <small class="text-red-600" v-else>JSON Inválido</small>
          </div>

          <Button label="Ejecutar Simulación" icon="pi pi-play" class="p-button-primary w-full" @click="runSimulation" :disabled="!isValidJSON" />
        </div>
      </div>

      <!-- Panel de Resultados (Traceability) -->
      <div class="col-12 md:col-6">
        <div class="card h-full surface-ground">
          <h3>2. Resultados de Simulación</h3>
          
          <div v-if="!simulationRan" class="flex align-items-center justify-content-center h-full text-slate-400">
            Presiona Ejecutar para ver la Trazabilidad
          </div>

          <div v-else>
            <!-- Eligibility Result -->
            <div v-if="simulationType === 'eligibility'">
              <Tag :severity="eligibilityResult.eligible ? 'success' : 'danger'" :value="eligibilityResult.eligible ? 'ELEGIBLE' : 'BLOQUEADO'" class="text-xl mb-3" />
              
              <div class="mb-3">
                <strong>¿Puede Cotizar?</strong> {{ eligibilityResult.canQuote ? 'Sí' : 'No' }}<br/>
                <strong>¿Puede Contratar?</strong> {{ eligibilityResult.canContract ? 'Sí' : 'No' }}
              </div>

              <div class="mb-3" v-if="eligibilityResult.reasons.length">
                <strong>Motivos / Avisos:</strong>
                <ul class="mt-1 pl-3">
                  <li v-for="reason in eligibilityResult.reasons" :key="reason" class="text-red-600">{{ reason }}</li>
                </ul>
              </div>
            </div>

            <!-- Pricing/Promotion Result -->
            <div v-if="simulationType === 'pricing'">
               <h4 class="mb-2">Trazabilidad de Precios:</h4>
               <p v-if="appliedRules.length === 0" class="text-slate-500">Ninguna regla aplicó al contexto actual.</p>
               <ul class="mt-1 pl-3">
                 <li v-for="rule in appliedRules" :key="rule.id" class="mb-2">
                   <strong>{{ rule.name }} (v{{ rule.version }})</strong><br/>
                   <span class="text-sm text-blue-600">Acción: {{ JSON.stringify(rule.actions) }}</span>
                 </li>
               </ul>
            </div>

            <!-- Audit Trail Global -->
            <div class="mt-4 pt-3 border-top-1 border-300">
              <h4 class="mb-2 text-slate-600">Rule Engine Audit Trail (Motor Universal)</h4>
              <p class="text-sm"><strong>Reglas Evaluadas:</strong> {{ rulesEvaluatedCount }}</p>
              <p class="text-sm"><strong>Reglas que Aplicaron:</strong> {{ appliedRules.length }}</p>
              <div class="text-xs bg-gray-800 text-green-400 p-2 border-round mt-2 overflow-auto" style="max-height: 150px;">
                 <div v-for="rule in appliedRules" :key="'audit'+rule.id">
                   > Match Condition: {{ JSON.stringify(rule.conditions) }}
                 </div>
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
import Button from 'primevue/button';
import Tag from 'primevue/tag';
// import { http } from '../api/http';
import { useNotificationStore } from '../stores/notificationStore';

const notificationStore = useNotificationStore();
const simulationType = ref('pricing');
const contextJSON = ref(`{
  "tenant": { "slug": "casa_de_piedra" },
  "espacio": { "tipo": "Salon" },
  "cotizacion": { "requiere_premontaje": true }
}`);

const simulationRan = ref(false);
const rulesEvaluatedCount = ref(0);
const appliedRules = ref<any[]>([]);
const eligibilityResult = ref<any>({});

const isValidJSON = computed(() => {
  try {
    JSON.parse(contextJSON.value);
    return true;
  } catch(e) {
    return false;
  }
});

const runSimulation = async () => {
  try {
    JSON.parse(contextJSON.value);
    
    // Fetch rules from DB based on type
    // Fetch rules metadata for the UI (Optional)
    // In real app, we filter by tenant as well
    // const rules = await pb.collection('rule_registry').getFullList({ filter: `rule_type = "${ruleType}" && status = "active"` });

    // En lugar de evaluar localmente, delegamos al backend:
    // const response = await http.post('/api/simulator/evaluate', { type: ruleType, context: context });
    
    // MOCK RESPUESTA BACKEND (hasta que esté listo)
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency
    
    rulesEvaluatedCount.value = 5; // MOCK

    if (simulationType.value === 'pricing') {
       appliedRules.value = []; // MOCK: response.data.appliedRules
    } else {
       eligibilityResult.value = { eligible: true, canQuote: true, canContract: true, reasons: [] }; // MOCK: response.data.eligibilityResult
       appliedRules.value = []; // MOCK: response.data.appliedRules
    }

    simulationRan.value = true;
    notificationStore.addNotification({
        type: 'success',
        message: 'Simulación procesada en Backend',
        domainEvent: 'SIMULATION_COMPLETED'
    });
  } catch (err) {
    console.error(err);
    notificationStore.addNotification({
      type: 'error',
      message: 'Error ejecutando simulación. Revisa la consola.',
      domainEvent: 'SIMULATION_ERROR'
    });
  }
};
</script>

<style scoped>
.rule-simulator { display: flex; flex-direction: column; }
.card {
  background: white; border-radius: 1rem; padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid #e2e8f0;
}
.surface-ground { background-color: #f8fafc; }
.border-top-1 { border-top: 1px solid; }
.border-300 { border-color: #cbd5e1; }
/* Grid Utils */
.grid { display: flex; flex-wrap: wrap; margin: -1rem; }
.col-12 { padding: 1rem; width: 100%; }
@media (min-width: 768px) { .md\:col-6 { width: 50%; } }
.w-full { width: 100%; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.pt-3 { padding-top: 0.75rem; }
.pl-3 { padding-left: 1rem; }
.flex { display: flex; }
.align-items-center { align-items: center; }
.justify-content-center { justify-content: center; }
.h-full { height: 100%; }
/* Typography */
.title { margin: 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.subtitle { margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #64748b; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.text-xl { font-size: 1.25rem; }
.font-bold { font-weight: 700; }
.font-mono { font-family: monospace; }
.text-slate-400 { color: #94a3b8; }
.text-slate-500 { color: #64748b; }
.text-slate-600 { color: #475569; }
.text-green-600 { color: #16a34a; }
.text-red-600 { color: #dc2626; }
.text-blue-600 { color: #2563eb; }
.bg-gray-800 { background-color: #1e293b; }
.text-green-400 { color: #4ade80; }
.border-round { border-radius: 0.5rem; }
.overflow-auto { overflow: auto; }
</style>
