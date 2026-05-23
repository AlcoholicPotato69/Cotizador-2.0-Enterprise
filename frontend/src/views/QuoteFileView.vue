<template>
  <div class="quote-file-view" v-if="quote">
    <!-- Header -->
    <div class="view-header mb-4 flex justify-content-between align-items-center">
      <div>
        <h1 class="title">Cotización #{{ quote.id.substring(0,8) }}</h1>
        <p class="subtitle">
          Creada el {{ new Date(quote.created).toLocaleDateString() }} | 
          Cliente: <router-link :to="'/clients/'+quote.client_snapshot?.id" class="text-blue-500 font-bold">{{ quote.client_snapshot?.nombre_completo }}</router-link>
        </p>
      </div>
      <div class="flex gap-2">
         <Tag :value="quote.status" class="text-lg py-2 px-3" :severity="quote.status === 'aprobada' ? 'success' : 'warning'" />
         <Button v-if="quote.status === 'pendiente'" label="Aprobar Cotización" severity="success" icon="pi pi-check" @click="approveQuote" />
      </div>
    </div>

    <!-- Workflow Visualization -->
    <div class="card mb-4 workflow-viz bg-slate-900 text-white">
      <h4 class="m-0 mb-3 text-slate-300">Progreso del Trámite</h4>
      <div class="flex justify-content-between align-items-center">
          <div class="stage active text-green-400">
            <i class="pi pi-file-edit mb-2 text-xl"></i>
            <span class="text-xs">Cotización Emitida</span>
          </div>
          <div class="line" :class="{'active': quote.status === 'aprobada' || hasContract}"></div>
          
          <div class="stage" :class="{'active text-green-400': quote.status === 'aprobada' || hasContract}">
            <i class="pi pi-thumbs-up mb-2 text-xl"></i>
            <span class="text-xs">Aprobación</span>
          </div>
          <div class="line" :class="{'active': hasContract}"></div>
          
          <div class="stage" :class="{'active text-blue-400': hasContract}">
            <i class="pi pi-briefcase mb-2 text-xl"></i>
            <span class="text-xs">Contrato Legal</span>
          </div>
          <div class="line"></div>
          
          <div class="stage">
            <i class="pi pi-money-bill mb-2 text-xl"></i>
            <span class="text-xs">Cobranza</span>
          </div>
      </div>
    </div>

    <div class="grid">
      <!-- Panel Izquierdo: Timeline & Legal -->
      <div class="col-12 lg:col-5 flex flex-column gap-4">
        
        <!-- Legal Panel -->
        <div class="card bg-slate-50 border-blue-100 border-2">
          <div class="flex align-items-center justify-content-between mb-3">
             <h3 class="m-0 text-blue-800">Panel Legal & Contratos</h3>
             <i class="pi pi-verified text-blue-500 text-2xl"></i>
          </div>
          <p class="text-sm text-slate-600 mb-4">Esta vista valida la elegibilidad legal del cliente antes de permitir la generación o firma del contrato definitivo.</p>
          
          <div v-if="hasContract" class="p-3 bg-green-50 text-green-800 border-round mb-3">
             <i class="pi pi-check-circle mr-2"></i> Contrato generado exitosamente.
             <Button label="Ver Contrato" link class="p-0 ml-3 font-bold" />
          </div>
          <div v-else>
             <div v-if="loadingEligibility" class="text-center p-3">
               <i class="pi pi-spin pi-spinner text-2xl"></i>
             </div>
             <div v-else>
               <div v-if="eligibility.canContract">
                 <div class="p-3 bg-green-50 text-green-800 border-round mb-3 text-sm">
                   <i class="pi pi-check mr-2"></i> El cliente cumple todos los requisitos legales para firmar.
                 </div>
                 <Button label="Generar Contrato Legal" icon="pi pi-file-pdf" class="w-full" severity="primary" @click="generateContract" :loading="generatingContract" />
               </div>
               <div v-else class="p-3 bg-red-50 text-red-800 border-round mb-3 text-sm">
                 <i class="pi pi-ban mr-2"></i> <strong>Elegibilidad Rechazada:</strong>
                 <ul class="mt-2 pl-3 mb-0">
                   <li v-for="r in eligibility.reasons" :key="r">{{ r }}</li>
                 </ul>
                 <p class="mt-2 text-xs">Resuelva estos bloqueos en el expediente del cliente.</p>
               </div>
             </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="card timeline-card">
          <h3 class="mb-3">Bitácora Operativa</h3>
          <div class="timeline">
            <div class="timeline-event" v-for="evt in operationalTimeline" :key="evt.id">
              <div class="timeline-point" :class="'bg-' + evt.color + '-500'"></div>
              <div class="timeline-content">
                <span class="text-xs text-slate-400">{{ evt.date }}</span>
                <p class="m-0 font-bold text-sm">{{ evt.title }}</p>
                <span class="text-xs text-slate-500">{{ evt.description }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Panel Derecho: Snapshots & Finances -->
      <div class="col-12 lg:col-7 flex flex-column gap-4">
        
        <!-- Snapshot Principal -->
        <div class="card">
          <h3 class="mb-3 border-bottom pb-2">Información del Evento (Space Snapshot)</h3>
          <div class="flex gap-4">
            <div class="flex-1">
               <span class="text-xs text-slate-500 block">Espacio Reservado</span>
               <div class="font-bold text-lg">{{ quote.space_snapshot?.nombre }}</div>
               <div class="text-sm mt-1">Capacidad: {{ quote.space_snapshot?.capacidad_maxima }} pax</div>
            </div>
            <div class="flex-1">
               <span class="text-xs text-slate-500 block">Fechas</span>
               <div class="font-bold text-sm">Inicio: {{ new Date(quote.fecha_inicio).toLocaleString() }}</div>
               <div class="font-bold text-sm mt-1">Fin: {{ new Date(quote.fecha_fin).toLocaleString() }}</div>
            </div>
          </div>
        </div>

        <!-- Financial Audit Trail -->
        <div class="card p-0 overflow-hidden">
          <div class="p-3 bg-slate-100 border-bottom">
             <h3 class="m-0">Audit Trail Financiero Inmutable</h3>
             <span class="text-xs text-slate-500">Este cálculo fue congelado usando el Universal Rule Engine al momento de creación.</span>
          </div>
          
          <div class="p-4">
             <div class="flex justify-content-between mb-3">
               <span class="font-bold">Costo Base del Espacio</span>
               <span>{{ formatCurrency(quote.desglose_precios?.subtotal) }}</span>
             </div>

             <div v-if="quote.pricing_snapshot && quote.pricing_snapshot.length > 0" class="mb-3">
               <div class="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Reglas de Cargo Aplicadas</div>
               <div class="flex justify-content-between text-sm mb-1 text-slate-700 pl-2 border-left-2 border-blue-400" v-for="p in quote.pricing_snapshot" :key="p.rule">
                 <span>{{ p.rule }}</span>
                 <span>+ {{ formatCurrency(p.amount) }}</span>
               </div>
             </div>

             <div v-if="quote.promotion_snapshot && quote.promotion_snapshot.length > 0" class="mb-3">
               <div class="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Promociones Aplicadas</div>
               <div class="flex justify-content-between text-sm mb-1 text-green-600 pl-2 border-left-2 border-green-400" v-for="p in quote.promotion_snapshot" :key="p.rule">
                 <span>{{ p.rule }}</span>
                 <span>- {{ formatCurrency(p.amount) }}</span>
               </div>
             </div>

             <div v-if="quote.tax_snapshot && quote.tax_snapshot.length > 0" class="mb-3">
               <div class="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Impuestos Activos</div>
               <div class="flex justify-content-between text-sm mb-1 text-slate-700 pl-2 border-left-2 border-slate-400" v-for="t in quote.tax_snapshot" :key="t.name">
                 <span>{{ t.name }} ({{ t.rate }}%)</span>
                 <span>+ {{ formatCurrency(t.amount) }}</span>
               </div>
             </div>

             <div class="flex justify-content-between mt-4 pt-3 border-top-2 border-slate-800 text-xl font-bold">
               <span>Total Final Autorizado</span>
               <span>{{ formatCurrency(quote.precio_final) }}</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { pb } from '../services/pb';
import { useTenantStore } from '../stores/tenant';
import { evaluateClientEligibility } from '../utils/ClientEligibilityEngine';
import { generateContractContent } from '../utils/ContractEngine';

import Button from 'primevue/button';
import Tag from 'primevue/tag';

const route = useRoute();
const tenantStore = useTenantStore();

const quote = ref<any>(null);
const eligibility = ref<any>({ canQuote: false, canContract: false, reasons: [] });
const loadingEligibility = ref(true);
const generatingContract = ref(false);
const hasContract = ref(false);

const operationalTimeline = ref<any[]>([]);

const formatCurrency = (value: number) => {
  return (value || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

onMounted(async () => {
  const id = route.params.id as string;
  try {
    // 1. Fetch Quote
    quote.value = await pb.collection('cotizaciones').getOne(id);

    // 2. Build Timeline
    operationalTimeline.value.push({
      id: 'evt1', date: new Date(quote.value.created).toLocaleString(), title: 'Emisión de Cotización', description: `Emitida por ${formatCurrency(quote.value.precio_final)}`, color: 'blue'
    });

    if(quote.value.status === 'aprobada') {
       operationalTimeline.value.push({
         id: 'evt2', date: new Date(quote.value.updated).toLocaleString(), title: 'Cotización Aprobada', description: `Validación comercial finalizada.`, color: 'green'
       });
    }

    // 3. Fetch Contracts to check if one exists
    const contracts = await pb.collection('contratos').getFullList({ filter: `cotizacion = "${id}"` });
    if(contracts.length > 0) {
       hasContract.value = true;
       operationalTimeline.value.push({
         id: 'evt3', date: new Date(contracts[0].created).toLocaleString(), title: 'Contrato Legal Generado', description: `Versión de Plantilla: ${contracts[0].template_snapshot?.version_aplicada}`, color: 'blue'
       });
    }

    // 4. Run Eligibility Health for Contracting
    const rules = await pb.collection('rule_registry').getFullList({
       filter: `tenant = "${tenantStore.activeTenantId}" && rule_type = "eligibility" && status = "active"`
    });
    // Use the deep clone snapshot for validation to be true to the time
    eligibility.value = evaluateClientEligibility({ cliente: quote.value.client_snapshot }, rules as any);

  } catch(e) {
    console.error(e);
  } finally {
    loadingEligibility.value = false;
  }
});

const approveQuote = async () => {
  try {
    await pb.collection('cotizaciones').update(quote.value.id, { status: 'aprobada' });
    quote.value.status = 'aprobada';
    operationalTimeline.value.push({
         id: `evt_app_${Date.now()}`, date: new Date().toLocaleString(), title: 'Cotización Aprobada', description: `Aprobación manual.`, color: 'green'
    });
  } catch(e) { console.error(e); }
};

const generateContract = async () => {
  generatingContract.value = true;
  try {
    // Call Contract Engine
    const res = await generateContractContent(tenantStore.activeTenantId || '', quote.value);

    if(!res.success) {
      alert("Error al generar contrato");
      return;
    }

    // Save to DB
    await pb.collection('contratos').create({
      tenant: tenantStore.activeTenantId,
      cliente: quote.value.client_snapshot.id,
      cotizacion: quote.value.id,
      status: 'borrador',
      // SNAPSHOT STRATEGY
      client_snapshot: quote.value.client_snapshot,
      branding_snapshot: quote.value.branding_snapshot,
      template_snapshot: res.templateSnapshot,
      rules_applied_audit: quote.value.eligibility_snapshot // or similar audit
    });

    hasContract.value = true;
    operationalTimeline.value.push({
         id: `evt_contract_${Date.now()}`, date: new Date().toLocaleString(), title: 'Contrato Legal Generado', description: `Versión de Plantilla: ${res.templateSnapshot?.version_aplicada}`, color: 'blue'
    });

  } catch(e) {
    console.error(e);
  } finally {
    generatingContract.value = false;
  }
};
</script>

<style scoped>
.quote-file-view { display: flex; flex-direction: column; gap: 1.5rem; }
.card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
.title { margin: 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.subtitle { margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #64748b; }
.border-bottom { border-bottom: 1px solid #e2e8f0; }
.border-top-2 { border-top: 2px solid #e2e8f0; }
.border-left-2 { border-left: 2px solid; }

/* Grid Utils */
.grid { display: flex; flex-wrap: wrap; margin: -1rem; }
.col-12 { padding: 1rem; width: 100%; }
@media (min-width: 1024px) { 
  .lg\:col-5 { width: 41.666667%; }
  .lg\:col-7 { width: 58.333333%; }
}
.flex { display: flex; }
.flex-column { flex-direction: column; }
.flex-1 { flex: 1; }
.align-items-center { align-items: center; }
.justify-content-center { justify-content: center; }
.justify-content-between { justify-content: space-between; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1.5rem; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1.5rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.ml-3 { margin-left: 1rem; }
.pb-2 { padding-bottom: 0.5rem; }
.pt-3 { padding-top: 1rem; }
.p-0 { padding: 0; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.pl-2 { padding-left: 0.5rem; }
.pl-3 { padding-left: 1rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.px-3 { padding-left: 1rem; padding-right: 1rem; }
.m-0 { margin: 0; }
.w-full { width: 100%; }
.text-center { text-align: center; }
.block { display: block; }
.border-round { border-radius: 0.5rem; }
.overflow-hidden { overflow: hidden; }

/* Colors */
.text-slate-300 { color: #cbd5e1; }
.text-slate-400 { color: #94a3b8; }
.text-slate-500 { color: #64748b; }
.text-slate-600 { color: #475569; }
.text-slate-700 { color: #334155; }
.text-blue-500 { color: #3b82f6; }
.text-blue-800 { color: #1e40af; }
.bg-slate-50 { background-color: #f8fafc; }
.bg-slate-100 { background-color: #f1f5f9; }
.bg-slate-900 { background-color: #0f172a; }
.text-green-400 { color: #4ade80; }
.text-green-600 { color: #16a34a; }
.text-green-800 { color: #166534; }
.bg-green-50 { background-color: #f0fdf4; }
.text-blue-400 { color: #60a5fa; }
.text-white { color: #ffffff; }
.text-red-800 { color: #991b1b; }
.bg-red-50 { background-color: #fef2f2; }
.border-blue-100 { border-color: #dbeafe; }
.border-slate-800 { border-color: #1e293b; }
.border-slate-400 { border-color: #94a3b8; }
.border-blue-400 { border-color: #60a5fa; }
.border-green-400 { border-color: #4ade80; }

/* Font */
.font-bold { font-weight: 700; }
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.uppercase { text-transform: uppercase; }
.tracking-wide { letter-spacing: 0.025em; }

/* Timeline */
.timeline { position: relative; padding-left: 1rem; }
.timeline::before { content: ''; position: absolute; top: 0; bottom: 0; left: 1.3rem; width: 2px; background: #e2e8f0; }
.timeline-event { position: relative; margin-bottom: 1.5rem; padding-left: 2rem; }
.timeline-point { position: absolute; left: 0; top: 0.25rem; width: 0.75rem; height: 0.75rem; border-radius: 50%; border: 2px solid white; z-index: 1; }
.bg-blue-500 { background-color: #3b82f6; }
.bg-green-500 { background-color: #22c55e; }
.bg-orange-500 { background-color: #f97316; }

/* Workflow Viz */
.workflow-viz .stage { display: flex; flex-direction: column; align-items: center; color: #475569; opacity: 0.5; }
.workflow-viz .stage.active { opacity: 1; }
.workflow-viz .line { flex-grow: 1; height: 2px; background: #334155; margin: 0 1rem; position: relative; top: -10px; }
.workflow-viz .line.active { background: #4ade80; }
</style>
