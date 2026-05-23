<template>
  <div class="client-file-view" v-if="client">
    <!-- Header -->
    <div class="view-header mb-4">
      <div class="flex align-items-center gap-3">
        <div class="avatar bg-blue-100 text-blue-600 font-bold text-2xl flex align-items-center justify-content-center border-circle" style="width: 4rem; height: 4rem;">
          {{ client.nombre_completo?.charAt(0) }}
        </div>
        <div>
          <h1 class="title">{{ client.nombre_completo }}</h1>
          <p class="subtitle">RFC: {{ client.rfc }} | Tipo: {{ client.tipo_persona }}</p>
        </div>
      </div>
      <Button label="Editar Perfil" icon="pi pi-pencil" class="p-button-outlined" />
    </div>

    <div class="grid">
      <!-- Panel Izquierdo: Health & Timeline -->
      <div class="col-12 lg:col-4 flex flex-column gap-4">
        
        <!-- Client Health Dashboard -->
        <div class="card health-dashboard">
          <h3 class="mb-3">Health Dashboard (Elegibilidad)</h3>
          
          <div v-if="loadingEligibility" class="text-center p-3">
            <i class="pi pi-spin pi-spinner text-2xl text-slate-400"></i>
          </div>
          <div v-else>
             <div class="flex justify-content-between mb-3 border-bottom pb-2">
                <span class="font-bold text-slate-600">Puede Cotizar</span>
                <Tag :severity="eligibility.canQuote ? 'success' : 'danger'" :value="eligibility.canQuote ? 'SÍ' : 'NO'" />
             </div>
             <div class="flex justify-content-between mb-3 border-bottom pb-2">
                <span class="font-bold text-slate-600">Puede Contratar</span>
                <Tag :severity="eligibility.canContract ? 'success' : 'danger'" :value="eligibility.canContract ? 'SÍ' : 'NO'" />
             </div>

             <div v-if="eligibility.reasons.length > 0" class="mt-3">
                <span class="text-xs text-slate-500 block mb-2">Bloqueos y Avisos Activos:</span>
                <ul class="m-0 pl-3">
                  <li v-for="r in eligibility.reasons" :key="r" class="text-red-500 text-sm mb-1">{{ r }}</li>
                </ul>
             </div>
             
             <div class="mt-3 text-xs text-slate-400">
               * Reglas evaluadas por el Client Eligibility Engine.
             </div>
          </div>
        </div>

        <!-- Operational Timeline -->
        <div class="card timeline-card">
          <h3 class="mb-3">Línea de Tiempo Operativa</h3>
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

      <!-- Panel Derecho: Data & Docs -->
      <div class="col-12 lg:col-8">
        
        <!-- Workflow Visualization -->
        <div class="card mb-4 workflow-viz bg-slate-900 text-white">
          <h4 class="m-0 mb-3 text-slate-300">Estado del Expediente</h4>
          <div class="flex justify-content-between align-items-center">
             <div class="stage" :class="{'active text-green-400': true}">
               <i class="pi pi-user mb-2 text-xl"></i>
               <span class="text-xs">Cliente Creado</span>
             </div>
             <div class="line active"></div>
             
             <div class="stage" :class="{'active text-green-400': eligibility.canQuote}">
               <i class="pi pi-file mb-2 text-xl"></i>
               <span class="text-xs">Expediente Cotizable</span>
             </div>
             <div class="line" :class="{'active': eligibility.canQuote}"></div>
             
             <div class="stage" :class="{'active text-green-400': eligibility.canContract}">
               <i class="pi pi-check-circle mb-2 text-xl"></i>
               <span class="text-xs">Aprobación Legal</span>
             </div>
             <div class="line" :class="{'active': eligibility.canContract}"></div>
             
             <div class="stage" :class="{'active text-blue-400': stats.activeContracts > 0}">
               <i class="pi pi-briefcase mb-2 text-xl"></i>
               <span class="text-xs">Contratos Activos ({{stats.activeContracts}})</span>
             </div>
          </div>
        </div>

        <div class="card h-full">
           <TabView>
              <TabPanel header="Cotizaciones" value="0">
                <DataTable :value="quotes" responsiveLayout="scroll" emptyMessage="Sin cotizaciones">
                  <Column field="id" header="Folio">
                    <template #body="sp"><router-link :to="'/quotes/'+sp.data.id" class="text-blue-600 font-mono text-sm">#{{ sp.data.id.substring(0,8) }}</router-link></template>
                  </Column>
                  <Column field="fecha_inicio" header="Fecha Evento" />
                  <Column field="precio_final" header="Total">
                    <template #body="sp">{{ formatCurrency(sp.data.precio_final) }}</template>
                  </Column>
                  <Column field="status" header="Estado">
                    <template #body="sp"><Tag :value="sp.data.status" /></template>
                  </Column>
                </DataTable>
              </TabPanel>
              
              <TabPanel header="Contratos Legales" value="1">
                <div class="p-4 text-center text-slate-500">
                  <i class="pi pi-file-pdf text-4xl mb-2 text-slate-300"></i>
                  <p>Módulo de Contratos en desarrollo.</p>
                </div>
              </TabPanel>

              <TabPanel header="Recibos y Facturas" value="2">
                <div class="p-4 text-center text-slate-500">
                  <i class="pi pi-money-bill text-4xl mb-2 text-slate-300"></i>
                  <p>Módulo Financiero en desarrollo.</p>
                </div>
              </TabPanel>
           </TabView>
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

import Button from 'primevue/button';
import Tag from 'primevue/tag';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const route = useRoute();
const tenantStore = useTenantStore();

const client = ref<any>(null);
const quotes = ref<any[]>([]);
const eligibility = ref<any>({ canQuote: false, canContract: false, reasons: [] });
const loadingEligibility = ref(true);

const stats = ref({ activeContracts: 0 });

const operationalTimeline = ref<any[]>([]);

const formatCurrency = (value: number) => {
  return (value || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

onMounted(async () => {
  const id = route.params.id as string;
  try {
    // Fetch Client
    client.value = await pb.collection('clientes').getOne(id);
    
    // Fetch Quotes
    quotes.value = await pb.collection('cotizaciones').getFullList({
      filter: `cliente = "${id}"`,
      sort: '-created'
    });

    // Build Timeline
    operationalTimeline.value.push({
      id: 'evt1', date: new Date(client.value.created).toLocaleDateString(), title: 'Creación de Cliente', description: 'Registro inicial en el sistema', color: 'blue'
    });
    
    quotes.value.forEach(q => {
      operationalTimeline.value.push({
        id: q.id, date: new Date(q.created).toLocaleDateString(), title: `Cotización #${q.id.substring(0,6)}`, description: `Cotización ${q.status} por ${formatCurrency(q.precio_final)}`, color: q.status === 'aprobada' ? 'green' : 'orange'
      });
    });

    // Fetch Rules & Run Eligibility Health
    const rules = await pb.collection('rule_registry').getFullList({
       filter: `tenant = "${tenantStore.activeTenantId}" && rule_type = "eligibility" && status = "active"`
    });
    eligibility.value = evaluateClientEligibility({ cliente: client.value }, rules as any);

  } catch(e) {
    console.error(e);
  } finally {
    loadingEligibility.value = false;
  }
});
</script>

<style scoped>
.client-file-view { display: flex; flex-direction: column; gap: 1.5rem; }
.card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
.title { margin: 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.subtitle { margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #64748b; }
.border-bottom { border-bottom: 1px solid #e2e8f0; }

/* Grid Utils */
.grid { display: flex; flex-wrap: wrap; margin: -1rem; }
.col-12 { padding: 1rem; width: 100%; }
@media (min-width: 1024px) { 
  .lg\:col-4 { width: 33.333333%; }
  .lg\:col-8 { width: 66.666667%; }
}
.flex { display: flex; }
.flex-column { flex-direction: column; }
.align-items-center { align-items: center; }
.justify-content-center { justify-content: center; }
.justify-content-between { justify-content: space-between; }
.gap-3 { gap: 1rem; }
.gap-4 { gap: 1.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.pb-2 { padding-bottom: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.pl-3 { padding-left: 1rem; }
.m-0 { margin: 0; }
.h-full { height: 100%; }
.text-center { text-align: center; }
.block { display: block; }
.border-circle { border-radius: 50%; }

/* Colors */
.text-slate-300 { color: #cbd5e1; }
.text-slate-400 { color: #94a3b8; }
.text-slate-500 { color: #64748b; }
.text-slate-600 { color: #475569; }
.text-blue-600 { color: #2563eb; }
.bg-blue-100 { background-color: #dbeafe; }
.bg-slate-900 { background-color: #0f172a; }
.text-green-400 { color: #4ade80; }
.text-blue-400 { color: #60a5fa; }
.text-white { color: #ffffff; }
.text-red-500 { color: #ef4444; }

/* Font */
.font-bold { font-weight: 700; }
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-4xl { font-size: 2.25rem; }
.font-mono { font-family: monospace; }

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
