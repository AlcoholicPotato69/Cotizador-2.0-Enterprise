<template>
  <div class="quote-file-view" v-if="quote">
    <!-- Header -->
    <div class="view-header mb-4 flex justify-content-between align-items-center">
      <div>
        <h1 class="title" v-if="quote?.id">Cotización #{{ quote.id.substring(0,8) }}</h1>
        <p class="subtitle" v-if="quote?.created">
          Creada el {{ new Date(quote.created).toLocaleDateString() }} | 
          Cliente: <router-link :to="'/clients/'+quote.client_snapshot?.id" class="text-blue-500 font-bold">{{ quote.client_snapshot?.nombre_completo }}</router-link>
        </p>
      </div>
      <div class="flex gap-2">
         <DsTag :value="quote.status" class="text-lg py-2 px-3" :severity="quote.status === 'APPROVED' || quote.status === 'CONTRACT_GENERATED' ? 'success' : 'warning'" />
         <DsButton v-if="quote.status === 'SENT'" label="Aprobar Cotización" severity="success" icon="pi pi-check" @click="approveQuote" />
      </div>
    </div>

    <!-- Workflow Visualization -->
    <div class="card mb-4 workflow-viz bg-surface-900 dark:bg-surface-0 text-surface-0 dark:text-surface-900">
      <h4 class="m-0 mb-3 text-surface-300 dark:text-surface-600">Progreso del Trámite</h4>
          <div class="flex justify-content-between align-items-center">
          <div class="stage active text-green-400">
            <i class="pi pi-file-edit mb-2 text-xl"></i>
            <span class="text-xs">Cotización Emitida</span>
          </div>
          <div class="line" :class="{'active': quote.status === 'APPROVED' || quote.status === 'CONTRACT_GENERATED' || hasContract}"></div>
          
          <div class="stage" :class="{'active text-green-400': quote.status === 'APPROVED' || quote.status === 'CONTRACT_GENERATED' || hasContract}">
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
        <div class="card bg-surface-50 dark:bg-surface-950 border-blue-100 border-2">
          <div class="flex align-items-center justify-content-between mb-3">
             <h3 class="m-0 text-primary-800 dark:text-primary-200">Panel Legal & Contratos</h3>
             <i class="pi pi-verified text-blue-500 text-2xl"></i>
          </div>
          <p class="text-sm text-surface-600 dark:text-surface-300 mb-4">Esta vista valida la elegibilidad legal del cliente antes de permitir la generación o firma del contrato definitivo.</p>
          
          <div v-if="hasContract" class="p-3 bg-green-50 text-green-800 border-round mb-3">
             <i class="pi pi-check-circle mr-2"></i> Contrato generado exitosamente.
             <DsButton label="Ver Contrato" link class="p-0 ml-3 font-bold" />
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
                 <DsButton
                   v-if="quote.status === 'APPROVED' || quote.status === 'CONTRACT_GENERATED'"
                   label="Generar Contrato Legal"
                   icon="pi pi-file-pdf"
                   class="w-full"
                   severity="primary"
                   @click="generateContract"
                   :loading="generatingContract"
                 />
                 <div v-else class="text-xs text-surface-500 dark:text-surface-400">
                   Se requiere aprobar la cotización para habilitar la generación de contrato.
                 </div>
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
                <span class="text-xs text-surface-400 dark:text-surface-500">{{ evt.date }}</span>
                <p class="m-0 font-bold text-sm">{{ evt.title }}</p>
                <span class="text-xs text-surface-500 dark:text-surface-400">{{ evt.description }}</span>
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
               <span class="text-xs text-surface-500 dark:text-surface-400 block">Espacio Reservado</span>
               <div class="font-bold text-lg">{{ quote.space_snapshot?.nombre }}</div>
               <div class="text-sm mt-1">Capacidad: {{ quote.space_snapshot?.capacidad_maxima }} pax</div>
            </div>
            <div class="flex-1">
               <span class="text-xs text-surface-500 dark:text-surface-400 block">Fechas</span>
               <div class="font-bold text-sm">Inicio: {{ quote.fecha_inicio ? new Date(quote.fecha_inicio).toLocaleString() : 'N/A' }}</div>
               <div class="font-bold text-sm mt-1">Fin: {{ quote.fecha_fin ? new Date(quote.fecha_fin).toLocaleString() : 'N/A' }}</div>
            </div>
          </div>
        </div>

        <!-- Financial Audit Trail -->
        <div class="card p-0 overflow-hidden">
          <div class="p-3 bg-surface-100 dark:bg-surface-800 border-bottom">
             <h3 class="m-0">Audit Trail Financiero Inmutable</h3>
             <span class="text-xs text-surface-500 dark:text-surface-400">Este cálculo fue congelado usando el Universal Rule Engine al momento de creación.</span>
          </div>
          
          <div class="p-4">
             <div class="flex justify-content-between mb-3">
               <span class="font-bold">Costo Base del Espacio</span>
               <span>{{ formatCurrency(quote.desglose_precios?.subtotal) }}</span>
             </div>

             <div v-if="quote.pricing_snapshot && quote.pricing_snapshot.length > 0" class="mb-3">
               <div class="text-xs font-bold text-surface-500 dark:text-surface-400 mb-1 uppercase tracking-wide">Reglas de Cargo Aplicadas</div>
               <div class="flex justify-content-between text-sm mb-1 text-surface-700 dark:text-surface-200 pl-2 border-left-2 border-blue-400" v-for="p in quote.pricing_snapshot" :key="p.rule">
                 <span>{{ p.rule }}</span>
                 <span>+ {{ formatCurrency(p.amount) }}</span>
               </div>
             </div>

             <div v-if="quote.promotion_snapshot && quote.promotion_snapshot.length > 0" class="mb-3">
               <div class="text-xs font-bold text-surface-500 dark:text-surface-400 mb-1 uppercase tracking-wide">Promociones Aplicadas</div>
               <div class="flex justify-content-between text-sm mb-1 text-green-600 pl-2 border-left-2 border-green-400" v-for="p in quote.promotion_snapshot" :key="p.rule">
                 <span>{{ p.rule }}</span>
                 <span>- {{ formatCurrency(p.amount) }}</span>
               </div>
             </div>

             <div v-if="quote.tax_snapshot && quote.tax_snapshot.length > 0" class="mb-3">
               <div class="text-xs font-bold text-surface-500 dark:text-surface-400 mb-1 uppercase tracking-wide">Impuestos Activos</div>
               <div class="flex justify-content-between text-sm mb-1 text-surface-700 dark:text-surface-200 pl-2 border-left-2 border-surface-400 dark:border-surface-500" v-for="t in quote.tax_snapshot" :key="t.name">
                 <span>{{ t.name }} ({{ t.rate }}%)</span>
                 <span>+ {{ formatCurrency(t.amount) }}</span>
               </div>
             </div>

             <div class="flex justify-content-between mt-4 pt-3 border-top-2 border-surface-800 dark:border-surface-100 text-xl font-bold">
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
import { quoteService, type Quote } from '../services/quoteService';
import { contractService } from '../services/contractService';
import { useNotificationStore } from '../stores/notificationStore';
import { clientService, type ClientEligibilityResult } from '../services/clientService';

const route = useRoute();
const notificationStore = useNotificationStore();

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  color: string;
}

// Extending Quote to include snapshot props used in the template
interface ExpandedQuote extends Quote {
  clientId?: string;
  currencyCode?: string;
  currency_code?: string;
  space_snapshot?: any;
  desglose_precios?: any;
  pricing_snapshot?: any;
  promotion_snapshot?: any;
  tax_snapshot?: any;
  precio_final?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  client_snapshot?: any;
}

const quote = ref<ExpandedQuote | null>(null);
const eligibility = ref({ canQuote: false, canContract: false, reasons: [] as string[] });
const loadingEligibility = ref(true);
const generatingContract = ref(false);
const hasContract = ref(false);

const operationalTimeline = ref<TimelineEvent[]>([]);

const formatCurrency = (value: number | undefined) => {
  return (value || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

onMounted(async () => {
  const id = route.params.id as string;
  try {
    // 1. Fetch Quote
    quote.value = await quoteService.getQuoteById(id) as ExpandedQuote;

    // 2. Build Timeline
    if (quote.value.created) {
      operationalTimeline.value.push({
        id: 'evt1', date: new Date(quote.value.created).toLocaleString(), title: 'Emisión de Cotización', description: `Emitida por ${formatCurrency(quote.value.precio_final || quote.value.total_amount)}`, color: 'blue'
      });
    }

    if(quote.value.status === 'APPROVED' || quote.value.status === 'CONTRACT_GENERATED') {
       operationalTimeline.value.push({
         id: 'evt2', date: new Date(quote.value.updated || quote.value.created || '').toLocaleString(), title: 'Cotización Aprobada', description: `Validación comercial finalizada.`, color: 'green'
       });
    }

    // 3. Fetch Contracts to check if one exists
    const contractsRes = await contractService.getContracts();
    const contracts = Array.isArray(contractsRes) ? contractsRes : (contractsRes.data || []);
    const contractForQuote = contracts.find((contract: any) => {
      const linkedQuoteId = contract.quoteId || contract.quoteSnapshotId || contract.quote_id;
      return linkedQuoteId === id;
    });
    if (contractForQuote) {
       hasContract.value = true;
       operationalTimeline.value.push({
         id: 'evt3',
         date: new Date(
           contractForQuote.createdAt
             || contractForQuote.created_at
             || '',
         ).toLocaleString(),
         title: 'Contrato Legal Generado',
         description: `Versión de Plantilla: ${(contractForQuote as any).template_snapshot?.version_aplicada || '1.0'}`,
         color: 'blue'
       });
    }

    // 4. Obtener elegibilidad desde el backend
    const clientId = quote.value.clientId
      || quote.value.client_id
      || quote.value.client_snapshot?.id;

    if (!clientId) {
      eligibility.value = {
        canQuote: false,
        canContract: false,
        reasons: ['No se pudo identificar el cliente de la cotización'],
      };
    } else {
      const eligibilityResponse: ClientEligibilityResult = await clientService.evaluateEligibility(
        clientId,
        'CONTRACT_GENERATION',
      );
      eligibility.value = {
        canQuote: eligibilityResponse.eligible,
        canContract: eligibilityResponse.eligible,
        reasons: eligibilityResponse.reasons,
      };
    }

  } catch(e: unknown) {
    console.error(e);
  } finally {
    loadingEligibility.value = false;
  }
});

const approveQuote = async () => {
  if (!quote.value?.id) return;
  try {
    await quoteService.transitionStatus(quote.value.id, 'APPROVED');
    quote.value.status = 'APPROVED';
    operationalTimeline.value.push({
         id: `evt_app_${Date.now()}`, date: new Date().toLocaleString(), title: 'Cotización Aprobada', description: `Aprobación manual.`, color: 'green'
    });
  } catch(e: unknown) { console.error(e); }
};

const generateContract = async () => {
  if (!quote.value?.id) return;

  generatingContract.value = true;
  try {
    const clientId = quote.value.clientId
      || quote.value.client_id
      || quote.value.client_snapshot?.id;

    if (!clientId) {
      notificationStore.addNotification({
          type: 'error',
          message: 'No se encontró cliente asociado para generar contrato.',
          domainEvent: 'CONTRACT_GENERATION_FAILED'
      });
      return;
    }

    const created = await contractService.createContract({
      clientId,
      quoteId: quote.value.id,
      currencyCode: quote.value.currencyCode || quote.value.currency_code || 'MXN',
    });

    hasContract.value = true;
    operationalTimeline.value.push({
         id: `evt_contract_${created.id || Date.now()}`,
         date: new Date(created.createdAt || created.created_at || Date.now()).toLocaleString(),
         title: 'Contrato Legal Generado',
         description: `Contrato ${created.id || ''} generado por Backend.`,
         color: 'blue'
    });
    
    notificationStore.addNotification({
        type: 'success',
        message: 'Petición enviada al Backend',
        domainEvent: 'CONTRACT_GENERATION_REQUESTED'
    });

  } catch(e) {
    console.error(e);
    notificationStore.addNotification({
        type: 'error',
        message: 'Error de servidor',
        domainEvent: 'SERVER_ERROR'
    });
  } finally {
    generatingContract.value = false;
  }
};
</script>

<style scoped>
.quote-file-view { display: flex; flex-direction: column; gap: 1.5rem; }
.card { background: var(--tenant-surface-0); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid var(--tenant-surface-200); }
.dark .card { background: var(--tenant-surface-900); border-color: var(--tenant-surface-700); }
.title { margin: 0; font-size: 1.5rem; font-weight: 800; color: var(--tenant-surface-900); }
.dark .title { color: var(--tenant-surface-100); }
.subtitle { margin: 0.25rem 0 0 0; font-size: 0.875rem; color: var(--tenant-surface-500); }
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
.text-surface-300 { color: #cbd5e1; }
.text-surface-400 { color: #94a3b8; }
.text-surface-500 { color: #64748b; }
.text-surface-600 { color: #475569; }
.text-surface-700 { color: #334155; }
.text-blue-500 { color: #3b82f6; }
.text-primary-800 { color: #1e40af; }
.bg-surface-50 { background-color: #f8fafc; }
.bg-surface-100 { background-color: #f1f5f9; }
.bg-surface-900 { background-color: #0f172a; }
.text-green-400 { color: #4ade80; }
.text-green-600 { color: #16a34a; }
.text-green-800 { color: #166534; }
.bg-green-50 { background-color: #f0fdf4; }
.text-blue-400 { color: #60a5fa; }
.text-surface-0 { color: var(--tenant-surface-0); }
.text-red-800 { color: #991b1b; }
.bg-red-50 { background-color: #fef2f2; }
.border-blue-100 { border-color: #dbeafe; }
.border-surface-800 { border-color: #1e293b; }
.border-surface-400 { border-color: #94a3b8; }
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
.timeline-point { position: absolute; left: 0; top: 0.25rem; width: 0.75rem; height: 0.75rem; border-radius: 50%; border: 2px solid var(--tenant-surface-0); z-index: 1; }
.bg-primary-500 { background-color: #3b82f6; }
.bg-green-500 { background-color: #22c55e; }
.bg-orange-500 { background-color: #f97316; }

/* Workflow Viz */
.workflow-viz .stage { display: flex; flex-direction: column; align-items: center; color: #475569; opacity: 0.5; }
.workflow-viz .stage.active { opacity: 1; }
.workflow-viz .line { flex-grow: 1; height: 2px; background: #334155; margin: 0 1rem; position: relative; top: -10px; }
.workflow-viz .line.active { background: #4ade80; }
</style>




