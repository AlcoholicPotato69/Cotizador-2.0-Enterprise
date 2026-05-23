<template>
  <div class="quotes-view">
    <div class="view-header">
      <div>
        <h1 class="title">Motor de Cotizaciones</h1>
        <p class="subtitle">Generación de propuestas con Rule Engine y Trazabilidad</p>
      </div>
      <Button label="Nueva Cotización" icon="pi pi-plus" @click="openWizard" class="p-button-primary" />
    </div>

    <!-- Data Table -->
    <div class="card mt-4">
      <DataTable 
        :value="quotes" 
        :paginator="true" 
        :rows="10" 
        dataKey="id" 
        :loading="loading"
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['expand.cliente.nombre_completo', 'status']"
        responsiveLayout="scroll"
        emptyMessage="No hay cotizaciones registradas."
      >
        <template #header>
          <div class="flex justify-content-between">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Buscar cotización..." />
            </span>
          </div>
        </template>
        
        <Column field="id" header="Folio" sortable>
          <template #body="slotProps">
            <span class="font-mono text-sm text-slate-500">#{{ slotProps.data.id.substring(0,8) }}</span>
          </template>
        </Column>

        <Column field="expand.cliente.nombre_completo" header="Cliente" sortable>
          <template #body="slotProps">
            <span class="font-bold">{{ slotProps.data.expand?.cliente?.nombre_completo }}</span>
          </template>
        </Column>
        
        <Column field="status" header="Estado" sortable>
          <template #body="slotProps">
            <Tag :severity="getStatusSeverity(slotProps.data.status)" :value="slotProps.data.status.toUpperCase()" />
          </template>
        </Column>

        <Column field="precio_final" header="Total" sortable>
          <template #body="slotProps">
            <span class="font-bold text-green-600">
              {{ formatCurrency(slotProps.data.precio_final) }}
            </span>
          </template>
        </Column>

        <Column header="Acciones" :exportable="false" style="min-width:8rem">
          <template #body="slotProps">
            <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-info" @click="viewQuote(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Wizard Dialog -->
    <Dialog v-model:visible="showWizard" header="Nueva Cotización" :modal="true" class="p-fluid" :style="{width: '700px'}" :closable="!saving">
      
      <!-- Step 1: Client & Dates -->
      <div v-if="wizardStep === 1" class="wizard-step">
        <h3 class="step-title">Paso 1: Selección de Cliente y Elegibilidad</h3>
        
        <div class="field mb-4">
          <label>Cliente</label>
          <select v-model="quoteForm.cliente" @change="checkEligibility" class="p-inputtext custom-select">
            <option value="">Seleccione un cliente</option>
            <option v-for="client in activeClients" :key="client.id" :value="client.id">
              {{ client.nombre_completo }} ({{ client.rfc }})
            </option>
          </select>
        </div>

        <div v-if="eligibilityResult && quoteForm.cliente" class="mb-4">
          <Tag :severity="eligibilityResult.canQuote ? 'success' : 'danger'" :value="eligibilityResult.canQuote ? 'ELEGIBLE PARA COTIZAR' : 'BLOQUEADO'" class="mb-2" />
          <ul class="text-sm text-red-600 mt-1 pl-3" v-if="eligibilityResult.reasons.length">
             <li v-for="r in eligibilityResult.reasons" :key="r">{{ r }}</li>
          </ul>
        </div>

        <div class="grid-dates mb-4" v-if="eligibilityResult?.canQuote">
          <div class="field">
            <label>Fecha Inicio</label>
            <input type="date" v-model="quoteForm.fecha_inicio" class="p-inputtext w-full" />
          </div>
          <div class="field">
            <label>Fecha Fin</label>
            <input type="date" v-model="quoteForm.fecha_fin" class="p-inputtext w-full" />
          </div>
        </div>
      </div>

      <!-- Step 2: Space & Base Engine -->
      <div v-if="wizardStep === 2" class="wizard-step">
        <h3 class="step-title">Paso 2: Inventario y Operativa Física</h3>
        
        <div class="field mb-4">
          <label>Espacio</label>
          <select v-model="quoteForm.espacio" class="p-inputtext custom-select">
            <option value="">Seleccione un espacio</option>
            <option v-for="sp in activeSpaces" :key="sp.id" :value="sp.id">
              {{ sp.nombre }} - Tarifa Base Sugerida: {{ formatCurrency(sp.precio_base) }}
            </option>
          </select>
        </div>

        <div class="grid-dates mb-4" v-if="quoteForm.espacio">
           <div class="field">
             <label>Pax Estimado (Capacidad)</label>
             <input type="number" v-model="quoteForm.pax_estimado" class="p-inputtext w-full" placeholder="Ej. 150" />
           </div>
           <div class="field">
             <label>Tipo de Evento</label>
             <select v-model="quoteForm.tipo_evento" class="p-inputtext custom-select">
               <option>Boda</option>
               <option>Congreso</option>
               <option>Campaña Publicitaria</option>
             </select>
           </div>
        </div>

        <div class="grid-dates mb-4" v-if="quoteForm.espacio">
           <div class="field">
             <label>Horas Extra</label>
             <input type="number" v-model="quoteForm.extra_hours" class="p-inputtext w-full" placeholder="0" />
           </div>
           <div class="field">
             <label>¿Servicios Externos? (Ej. Descorche)</label>
             <select v-model="quoteForm.has_external_vendor" class="p-inputtext custom-select">
               <option :value="false">No</option>
               <option :value="true">Sí, banqueteros o proveedores externos</option>
             </select>
           </div>
        </div>

        <div class="grid-dates mb-4" v-if="quoteForm.espacio">
           <div class="field">
             <label>Horas de Montaje Previo</label>
             <input type="number" v-model="quoteForm.mounting_hours" class="p-inputtext w-full" placeholder="0" />
           </div>
           <div class="field">
             <label>Horas de Desmontaje Posterior</label>
             <input type="number" v-model="quoteForm.dismantling_hours" class="p-inputtext w-full" placeholder="0" />
           </div>
        </div>
        
        <!-- Availability Engine Feedback -->
        <div v-if="availabilityResult" class="mt-3">
          <Tag :severity="availabilityResult.isAvailable ? 'success' : 'danger'" :value="availabilityResult.isAvailable ? 'DISPONIBLE' : 'CONFLICTO DE DISPONIBILIDAD'" class="mb-2" />
          <ul class="text-sm text-red-600 mt-1 pl-3" v-if="availabilityResult.reasons.length">
             <li v-for="r in availabilityResult.reasons" :key="r">{{ r }}</li>
          </ul>
        </div>
      </div>

      <!-- Step 3: Rule Engine Processing & Math Summary -->
      <div v-if="wizardStep === 3" class="wizard-step">
        <h3 class="step-title">Paso 3: Snapshot Matemático (Rule Engine)</h3>
        
        <div v-if="isCalculating" class="flex justify-content-center p-4">
           <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
           <span class="ml-2">Evaluando reglas de negocio...</span>
        </div>

        <div v-else class="financial-snapshot p-4 bg-slate-800 text-white border-round mt-3">
          <div class="flex justify-content-between mb-3 border-bottom pb-2">
            <span>Subtotal (Tarifa Base Catálogo):</span>
            <span>{{ formatCurrency(mathSnapshot.subtotal) }}</span>
          </div>
          
          <div v-if="mathSnapshot.pricingRules.length > 0">
             <div class="text-sm text-blue-300 mb-1">Reglas de Precio Aplicadas:</div>
             <div v-for="rule in mathSnapshot.pricingRules" :key="rule.name" class="flex justify-content-between mb-2 pl-2">
               <span class="text-xs">> {{ rule.name }} (v{{ rule.version }})</span>
               <span class="text-xs">+ {{ formatCurrency(rule.amount) }}</span>
             </div>
          </div>

          <div v-if="mathSnapshot.promotionRules.length > 0" class="mt-3">
             <div class="text-sm text-orange-300 mb-1">Promociones Aplicadas:</div>
             <div v-for="rule in mathSnapshot.promotionRules" :key="rule.name" class="flex justify-content-between mb-2 pl-2">
               <span class="text-xs">> {{ rule.name }} (v{{ rule.version }})</span>
               <span class="text-xs">- {{ formatCurrency(rule.amount) }}</span>
             </div>
          </div>

          <!-- Tax is no longer hardcoded -->
          <div v-if="mathSnapshot.taxes.length > 0" class="mt-3 border-top pt-2">
             <div v-for="tax in mathSnapshot.taxes" :key="tax.name" class="flex justify-content-between mb-2">
               <span>{{ tax.name }} ({{ tax.rate }}%):</span>
               <span>{{ formatCurrency(tax.amount) }}</span>
             </div>
          </div>

          <div class="flex justify-content-between text-xl font-bold mt-4 pt-2 border-top border-2">
            <span class="text-green-400">Total a Cotizar:</span>
            <span class="text-green-400">{{ formatCurrency(mathSnapshot.total) }}</span>
          </div>
        </div>

        <p class="text-xs text-slate-500 mt-3" v-if="!isCalculating">
          Al guardar, este desglose y las versiones de las reglas aplicadas se convertirán en un Snapshot Inmutable.
        </p>
      </div>

      <template #footer>
        <div class="flex justify-content-between w-full">
          <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="closeWizard" v-if="!saving" />
          <div class="flex gap-2">
            <Button label="Atrás" icon="pi pi-arrow-left" class="p-button-secondary" @click="wizardStep--" v-if="wizardStep > 1 && !saving" />
            <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" class="p-button-primary" @click="goNext" v-if="wizardStep < 3 && canProceed" />
            <Button label="Congelar Cotización" icon="pi pi-check" class="p-button-success" @click="saveQuote" :loading="saving" v-if="wizardStep === 3 && !isCalculating" />
          </div>
        </div>
      </template>
    </Dialog>

    <!-- View Quote Dialog -->
    <Dialog v-model:visible="showViewDialog" header="Detalle de Cotización" :modal="true" class="p-fluid" :style="{width: '600px'}">
      <div v-if="selectedQuote" class="quote-detail">
        <div class="flex justify-content-between mb-4">
          <div>
            <h3 class="m-0 text-xl">{{ selectedQuote.client_snapshot?.nombre_completo || selectedQuote.expand?.cliente?.nombre_completo }}</h3>
            <span class="text-slate-500">Folio: {{ selectedQuote.id }}</span>
          </div>
          <Tag :severity="getStatusSeverity(selectedQuote.status)" :value="selectedQuote.status.toUpperCase()" class="text-lg px-3 py-2" />
        </div>
        
        <div class="surface-ground p-3 border-round mb-4">
          <div class="flex justify-content-between mb-2">
            <span class="font-bold">Periodo:</span>
            <span>{{ selectedQuote.fecha_inicio }} al {{ selectedQuote.fecha_fin }}</span>
          </div>
        </div>

        <h4>Trazabilidad y Snapshot Financiero (Inmutable)</h4>
        <div class="financial-snapshot p-4 bg-slate-800 text-white border-round">
          <p class="text-sm mb-1 text-slate-400">Reglas Aplicadas en el momento de creación:</p>
          <ul class="text-xs mb-4 pl-3">
             <li v-for="r in (selectedQuote.eligibility_audit || [])" :key="'e'+r" class="text-blue-300">Eligibility: {{ r }}</li>
             <li v-for="r in (selectedQuote.pricing_audit || [])" :key="'p'+r.rule" class="text-purple-300">Pricing: {{ r.rule }}</li>
             <li v-for="r in (selectedQuote.promotion_audit || [])" :key="'pr'+r.rule" class="text-orange-300">Promo: {{ r.rule }}</li>
          </ul>
          
          <pre class="m-0 text-sm font-mono overflow-auto" style="max-height: 200px; border-top: 1px solid #334155; padding-top: 1rem;">{{ JSON.stringify(selectedQuote.desglose_precios, null, 2) }}</pre>
          
          <div class="flex justify-content-between text-xl font-bold mt-4 pt-4 border-top">
            <span class="text-green-400">Gran Total:</span>
            <span class="text-green-400">{{ formatCurrency(selectedQuote.precio_final) }}</span>
          </div>
        </div>

        <div class="mt-4 flex gap-2 justify-content-end" v-if="selectedQuote.status === 'pendiente'">
          <Button label="Rechazar" class="p-button-danger p-button-outlined" icon="pi pi-times" @click="updateStatus('rechazada')" />
          <Button label="Aprobar Cotización" class="p-button-success" icon="pi pi-check" @click="updateStatus('aprobada')" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { pb } from '../services/pb';
import { useTenantStore } from '../stores/tenant';
import { evaluateClientEligibility } from '../utils/ClientEligibilityEngine';
import { evaluateRules } from '../utils/RuleEvaluator';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';

const tenantStore = useTenantStore();

// State
const quotes = ref<any[]>([]);
const activeClients = ref<any[]>([]);
const activeSpaces = ref<any[]>([]);
const loading = ref(true);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Wizard State
const showWizard = ref(false);
const showViewDialog = ref(false);
const wizardStep = ref(1);
const saving = ref(false);
const isCalculating = ref(false);
const selectedQuote = ref<any>(null);

const quoteForm = ref({
  cliente: '',
  fecha_inicio: '',
  fecha_fin: '',
  espacio: '',
  pax_estimado: 0,
  tipo_evento: '',
  extra_hours: 0,
  has_external_vendor: false,
  mounting_hours: 0,
  dismantling_hours: 0
});

const eligibilityResult = ref<any>(null);

const selectedSpaceObj = computed(() => {
  return activeSpaces.value.find(s => s.id === quoteForm.value.espacio);
});
const selectedClientObj = computed(() => {
  return activeClients.value.find(c => c.id === quoteForm.value.cliente);
});

// Math Snapshot & Audit
const mathSnapshot = ref({
  subtotal: 0,
  pricingRules: [] as any[],
  promotionRules: [] as any[],
  taxes: [] as any[],
  total: 0,
  espacio_nombre: ''
});

const canProceed = computed(() => {
  if (wizardStep.value === 1) {
    return quoteForm.value.cliente && eligibilityResult.value?.canQuote && quoteForm.value.fecha_inicio && quoteForm.value.fecha_fin;
  }
  if (wizardStep.value === 2) {
    return !!quoteForm.value.espacio;
  }
  return true;
});

const formatCurrency = (value: number) => {
  return (value || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

const getStatusSeverity = (status: string) => {
  switch(status) {
    case 'aprobada': return 'success';
    case 'rechazada': return 'danger';
    case 'finalizada': return 'info';
    default: return 'warning';
  }
};

// Fetching
const fetchQuotes = async () => {
  if (!tenantStore.activeTenantId) return;
  loading.value = true;
  try {
    const records = await pb.collection('cotizaciones').getFullList({
      filter: `tenant = "${tenantStore.activeTenantId}"`,
      expand: 'cliente',
      sort: '-created'
    });
    quotes.value = records;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const fetchDependencies = async () => {
  if (!tenantStore.activeTenantId) return;
  try {
    const [c, s] = await Promise.all([
      pb.collection('clientes').getFullList({ filter: `tenant = "${tenantStore.activeTenantId}"` }),
      pb.collection('espacios').getFullList({ filter: `tenant = "${tenantStore.activeTenantId}" && activo = true` })
    ]);
    activeClients.value = c;
    activeSpaces.value = s;
  } catch (err) {
    console.error(err);
  }
};

watch(() => tenantStore.activeTenantId, () => {
  fetchQuotes();
  fetchDependencies();
});

onMounted(() => {
  fetchQuotes();
  fetchDependencies();
});

// Wizard Actions
const openWizard = () => {
  quoteForm.value = {
    cliente: '',
    fecha_inicio: '',
    fecha_fin: '',
    espacio: '',
    pax_estimado: 0,
    tipo_evento: '',
    extra_hours: 0,
    has_external_vendor: false,
    mounting_hours: 0,
    dismantling_hours: 0
  };
  eligibilityResult.value = null;
  wizardStep.value = 1;
  showWizard.value = true;
};

const closeWizard = () => {
  showWizard.value = false;
};

const checkEligibility = async () => {
  if(!quoteForm.value.cliente) {
    eligibilityResult.value = null;
    return;
  }
  
  // Extraemos las reglas del tenant
  const rules = await pb.collection('rule_registry').getFullList({
     filter: `tenant = "${tenantStore.activeTenantId}" && rule_type = "eligibility" && status = "active"`
  });

  const context = {
    cliente: selectedClientObj.value,
    cotizacion: quoteForm.value
  };

  eligibilityResult.value = evaluateClientEligibility(context, rules as any);
};

import { AvailabilityEngine } from '../utils/AvailabilityEngine';

const availabilityResult = ref<any>(null);

const checkAvailability = async () => {
  const req = {
    espacio_id: quoteForm.value.espacio,
    fecha_inicio: quoteForm.value.fecha_inicio,
    fecha_fin: quoteForm.value.fecha_fin,
    mounting_hours: quoteForm.value.mounting_hours || 0,
    dismantling_hours: quoteForm.value.dismantling_hours || 0,
    pax_estimado: quoteForm.value.pax_estimado || 0,
    tipo_evento: quoteForm.value.tipo_evento || ''
  };
  
  const policy = {
    capacity_min: selectedSpaceObj.value?.capacity_min || 0,
    capacity_max: selectedSpaceObj.value?.capacity_max || 99999,
    allowed_event_types: selectedSpaceObj.value?.allowed_event_types || [],
    occupancy_policy: selectedSpaceObj.value?.occupancy_policy || 'exclusive'
  };

  // Fetch existing reservations
  const existing = await pb.collection('event_reservations').getFullList({
     filter: `tenant = "${tenantStore.activeTenantId}" && espacio = "${quoteForm.value.espacio}"`
  });

  availabilityResult.value = AvailabilityEngine.validateAvailability(req, policy, existing as any);
  return availabilityResult.value.isAvailable;
};

const goNext = async () => {
  if (wizardStep.value === 1) {
    wizardStep.value++;
  } else if (wizardStep.value === 2) {
    const isAvail = await checkAvailability();
    if (isAvail) {
      wizardStep.value = 3;
      await runRuleEngines();
    }
  }
};

// Store for deep snapshotting
const tenantSettingsObj = ref<any>({});
const activeTemplate = ref<any>({});

const runRuleEngines = async () => {
  isCalculating.value = true;
  
  try {
    const context = {
      tenant: { id: tenantStore.activeTenantId },
      espacio: selectedSpaceObj.value,
      cliente: selectedClientObj.value,
      cotizacion: quoteForm.value,
      date: new Date().toISOString()
    };

    // NO HARDCODING. Everything comes from DB
    const [pricingRules, promoRules, settingsRecords, templateRecords] = await Promise.all([
      pb.collection('rule_registry').getFullList({ filter: `tenant = "${tenantStore.activeTenantId}" && rule_type = "pricing" && status = "active"` }),
      pb.collection('rule_registry').getFullList({ filter: `tenant = "${tenantStore.activeTenantId}" && rule_type = "promotion" && status = "active"` }),
      pb.collection('tenant_settings').getFullList({ filter: `tenant = "${tenantStore.activeTenantId}"` }),
      pb.collection('template_registry').getFullList({ filter: `tenant = "${tenantStore.activeTenantId}" && type = "quote" && status = "active"` })
    ]);

    const tenantSettings = settingsRecords.length ? settingsRecords[0] : { tax_rules: [], branding: {} };
    tenantSettingsObj.value = tenantSettings;
    activeTemplate.value = templateRecords.length ? templateRecords[0] : {};

    let currentBase = selectedSpaceObj.value?.precio_base || 0;
    
    // 1. Evaluate Pricing Rules (Surcharges / Overrides)
    const appliedPricing = evaluateRules(pricingRules as any, context);
    const pricingAudit: any[] = [];
    
    appliedPricing.forEach(rule => {
      rule.actions.forEach((act: any) => {
         let amt = 0;
         if(act.type === 'surcharge') {
           amt = act.unit === 'percentage' ? (currentBase * (act.value / 100)) : act.value;
           currentBase += amt;
         } else if (act.type === 'override') {
           amt = act.value - currentBase;
           currentBase = act.value;
         }
         pricingAudit.push({ rule: `${rule.name} v${rule.version}`, amount: amt });
      });
    });

    let currentTotal = currentBase;

    // 2. Evaluate Promotion Rules (Discounts)
    const appliedPromo = evaluateRules(promoRules as any, context);
    const promoAudit: any[] = [];

    appliedPromo.forEach(rule => {
      rule.actions.forEach((act: any) => {
         if(act.type === 'discount') {
           let amt = act.unit === 'percentage' ? (currentTotal * (act.value / 100)) : act.value;
           currentTotal -= amt;
           promoAudit.push({ rule: `${rule.name} v${rule.version}`, amount: amt });
         }
      });
    });

    // 3. Apply Taxes dynamically from Tenant Settings
    const taxesAudit: any[] = [];
    if(tenantSettings.tax_rules && Array.isArray(tenantSettings.tax_rules)) {
       tenantSettings.tax_rules.forEach((tax: any) => {
          const taxAmt = currentTotal * (tax.rate / 100);
          taxesAudit.push({ name: tax.name, rate: tax.rate, amount: taxAmt });
          currentTotal += taxAmt;
       });
    }

    // Prepare Snapshot
    mathSnapshot.value = {
      subtotal: selectedSpaceObj.value?.precio_base || 0,
      pricingRules: pricingAudit,
      promotionRules: promoAudit,
      taxes: taxesAudit,
      total: currentTotal,
      espacio_nombre: selectedSpaceObj.value?.nombre || ''
    };

  } catch(e) {
    console.error(e);
  } finally {
    isCalculating.value = false;
  }
};

const saveQuote = async () => {
  saving.value = true;
  try {
    const clientData = selectedClientObj.value || {};
    const spaceData = selectedSpaceObj.value || {};
    
    await pb.collection('cotizaciones').create({
      tenant: tenantStore.activeTenantId,
      cliente: quoteForm.value.cliente,
      fecha_inicio: quoteForm.value.fecha_inicio,
      fecha_fin: quoteForm.value.fecha_fin,
      status: 'pendiente',
      precio_final: mathSnapshot.value.total,
      desglose_precios: mathSnapshot.value,
      
      // COMPLETE IMMUTABILITY STRATEGY (Deep Snapshots)
      client_snapshot: JSON.parse(JSON.stringify(clientData)), // Deep copy of entire client
      space_snapshot: JSON.parse(JSON.stringify(spaceData)), // Deep copy of entire space
      tenant_snapshot: { id: tenantStore.activeTenantId },
      branding_snapshot: tenantSettingsObj.value?.branding || {},
      template_snapshot: activeTemplate.value || {}, // Snapshot de la plantilla HTML
      
      // RULE AUDIT TRAIL
      eligibility_snapshot: eligibilityResult.value.rulesApplied,
      pricing_snapshot: mathSnapshot.value.pricingRules,
      promotion_snapshot: mathSnapshot.value.promotionRules,
      tax_snapshot: mathSnapshot.value.taxes
    });
    
    closeWizard();
    fetchQuotes();
  } catch (err) {
    console.error(err);
  } finally {
    saving.value = false;
  }
};

const viewQuote = (quote: any) => {
  selectedQuote.value = quote;
  showViewDialog.value = true;
};

const updateStatus = async (newStatus: string) => {
  if (!selectedQuote.value) return;
  try {
    await pb.collection('cotizaciones').update(selectedQuote.value.id, {
      status: newStatus
    });
    selectedQuote.value.status = newStatus;
    fetchQuotes(); 
  } catch(err) {
    console.error(err);
  }
};
</script>

<style scoped>
.quotes-view { display: flex; flex-direction: column; gap: 1.5rem; }
.view-header { display: flex; justify-content: space-between; align-items: center; }
.title { margin: 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.subtitle { margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #64748b; }
.card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
.custom-select { width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 6px; background-color: #ffffff; }
.grid-dates { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.step-title { margin-top: 0; color: #1e293b; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
.border-bottom { border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.border-top { border-top: 1px solid rgba(255, 255, 255, 0.2); }
.border-2 { border-width: 2px !important; }
.surface-ground { background-color: #f8fafc; }
.bg-slate-800 { background-color: #1e293b; }
.flex { display: flex; }
.justify-content-between { justify-content: space-between; }
.justify-content-end { justify-content: flex-end; }
.justify-content-center { justify-content: center; }
.align-items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.mt-1 { margin-top: 0.25rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.pb-2 { padding-bottom: 0.5rem; }
.pt-2 { padding-top: 0.5rem; }
.pt-4 { padding-top: 1rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.pl-2 { padding-left: 0.5rem; }
.pl-3 { padding-left: 1rem; }
.border-round { border-radius: 0.5rem; }
.text-green-600 { color: #16a34a; }
.text-green-400 { color: #4ade80; }
.text-blue-300 { color: #93c5fd; }
.text-orange-300 { color: #fdba74; }
.text-purple-300 { color: #d8b4fe; }
.text-red-600 { color: #dc2626; }
.text-slate-400 { color: #94a3b8; }
.font-bold { font-weight: 700; }
.font-mono { font-family: monospace; }
.w-full { width: 100%; }
.text-xl { font-size: 1.25rem; }
.text-lg { font-size: 1.125rem; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.text-slate-500 { color: #64748b; }
.overflow-auto { overflow: auto; }
.m-0 { margin: 0; }
</style>
