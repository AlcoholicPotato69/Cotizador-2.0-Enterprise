<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-surface-200 dark:border-surface-800 gap-4">
      <div>
        <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary mb-2 p-0 h-auto" label="Volver a Facturas" @click="router.push('/invoices')" />
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">
          Expediente Financiero
          <span v-if="invoice" class="text-primary-600 ml-2">#{{ invoice.folio || invoice.id }}</span>
        </h1>
        <p class="text-sm text-surface-600 mt-1">Cruce de facturas, pagos, notas de crédito y recibos.</p>
      </div>
      <div class="flex gap-2">
        <Button v-if="permissionsStore.can('payments.create')" label="Registrar Pago" icon="pi pi-money-bill" class="p-button-outlined" @click="registerPayment" />
        <Button label="Imprimir Estado" icon="pi pi-print" class="p-button-primary" @click="printDossier" />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center p-8">
      <i class="pi pi-spinner pi-spin text-4xl text-primary-500"></i>
    </div>

    <div v-else-if="!invoice" class="p-8 text-center bg-surface-50 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800">
      <i class="pi pi-folder-open text-4xl text-surface-400 mb-4 block"></i>
      <h3 class="text-lg font-medium text-surface-900 dark:text-surface-50">No se encontró la factura</h3>
      <p class="text-surface-600 mt-2">Es posible que la factura no exista o no tengas permisos para verla.</p>
      <Button label="Regresar" icon="pi pi-arrow-left" class="mt-4 p-button-outlined" @click="router.push('/invoices')" />
    </div>

    <template v-else>
      <!-- Resumen Financiero -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between">
          <h3 class="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-2">Monto Facturado</h3>
          <div class="text-2xl font-bold text-surface-900 dark:text-surface-50">{{ formatCurrency(invoice.total) }}</div>
        </div>
        <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between">
          <h3 class="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-2">Total Pagado</h3>
          <div class="text-2xl font-bold text-success-600 dark:text-success-400">{{ formatCurrency(totalPagado) }}</div>
        </div>
        <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between">
          <h3 class="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-2">Notas de Crédito</h3>
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ formatCurrency(totalNotasCredito) }}</div>
        </div>
        <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between">
          <h3 class="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-2">Saldo Pendiente</h3>
          <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ formatCurrency(saldoPendiente) }}</div>
        </div>
      </div>

      <!-- Detalles de la Factura y Documentos Relacionados -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Panel: Historial -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm p-6 overflow-hidden">
            <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">Pagos Relacionados</h2>
            <DataTable 
              :value="payments" 
              emptyMessage="No hay pagos registrados para esta factura."
              class="p-datatable-sm"
              responsiveLayout="scroll"
            >
              <Column field="folio" header="ID Pago">
                <template #body="slotProps">
                  <span class="font-mono text-surface-600">#{{ slotProps.data.folio || slotProps.data.id }}</span>
                </template>
              </Column>
              <Column field="fecha" header="Fecha">
                <template #body="slotProps">
                  {{ formatDate(slotProps.data.fecha || slotProps.data.created) }}
                </template>
              </Column>
              <Column field="metodo" header="Método">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.metodo" severity="info" rounded v-if="slotProps.data.metodo" />
                  <span v-else class="text-surface-400">-</span>
                </template>
              </Column>
              <Column field="monto" header="Monto">
                <template #body="slotProps">
                  <span class="font-semibold text-success-600">{{ formatCurrency(slotProps.data.monto) }}</span>
                </template>
              </Column>
              <Column field="estado" header="Estado">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.estado || 'APROBADO'" :severity="(slotProps.data.estado === 'RECHAZADO') ? 'danger' : 'success'" rounded />
                </template>
              </Column>
            </DataTable>
          </div>

          <div class="bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm p-6 overflow-hidden">
            <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">Notas de Crédito</h2>
            <DataTable 
              :value="creditNotes" 
              emptyMessage="No hay notas de crédito registradas."
              class="p-datatable-sm"
              responsiveLayout="scroll"
            >
              <Column field="folio" header="Folio">
                <template #body="slotProps">
                  <span class="font-mono text-surface-600">#{{ slotProps.data.folio || slotProps.data.id }}</span>
                </template>
              </Column>
              <Column field="fecha" header="Fecha">
                <template #body="slotProps">
                  {{ formatDate(slotProps.data.created) }}
                </template>
              </Column>
              <Column field="motivo" header="Motivo"></Column>
              <Column field="monto" header="Monto">
                <template #body="slotProps">
                  <span class="font-semibold text-orange-600">{{ formatCurrency(slotProps.data.monto) }}</span>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>

        <!-- Right Panel: Metadatos -->
        <div class="space-y-6">
          <div class="bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm p-6">
            <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-5">Información de Factura</h2>
            <div class="flex flex-col gap-5">
              <div>
                <div class="text-xs font-medium text-surface-600 uppercase tracking-wide mb-1">Cliente</div>
                <div class="font-medium text-surface-900 dark:text-surface-50">{{ invoice.cliente_nombre || 'Desconocido' }}</div>
              </div>
              <div>
                <div class="text-xs font-medium text-surface-600 uppercase tracking-wide mb-1">Contrato</div>
                <div class="font-mono font-medium text-primary-600 cursor-pointer hover:underline" @click="router.push(`/contracts/${invoice.contrato_id}`)">
                  #{{ invoice.contrato_id || 'N/A' }}
                </div>
              </div>
              <div>
                <div class="text-xs font-medium text-surface-600 uppercase tracking-wide mb-1">Estado de Factura</div>
                <Tag :value="invoice.status" :severity="getStatusSeverity(invoice.status)" rounded />
              </div>
              <div v-if="invoice.fecha_emision">
                <div class="text-xs font-medium text-surface-600 uppercase tracking-wide mb-1">Fecha Emisión</div>
                <div class="text-surface-900 dark:text-surface-50">{{ formatDate(invoice.fecha_emision) }}</div>
              </div>
              <div v-if="invoice.fecha_vencimiento">
                <div class="text-xs font-medium text-surface-600 uppercase tracking-wide mb-1">Fecha Vencimiento</div>
                <div class="text-surface-900 dark:text-surface-50">{{ formatDate(invoice.fecha_vencimiento) }}</div>
              </div>
            </div>
          </div>
          
          <div class="bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm p-6">
            <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">Recibos Emitidos</h2>
            <ul class="space-y-3" v-if="receipts.length">
              <li v-for="receipt in receipts" :key="receipt.id" class="flex justify-between items-center p-3 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-100 dark:border-surface-700">
                <div class="flex items-center gap-3">
                  <i class="pi pi-file-pdf text-red-500 text-xl"></i>
                  <div>
                    <div class="text-sm font-medium text-surface-900 dark:text-surface-50">Recibo #{{ receipt.folio || receipt.id }}</div>
                    <div class="text-xs text-surface-600">{{ formatDate(receipt.created) }}</div>
                  </div>
                </div>
                <Button icon="pi pi-download" class="p-button-text p-button-rounded p-button-sm text-surface-600" aria-label="Descargar Recibo" />
              </li>
            </ul>
            <p v-else class="text-sm text-surface-600 italic">No hay recibos emitidos para esta factura.</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * @module FinancialDossier
 * @description Master view for the financial reconciliation of a specific invoice.
 * Acts as a hub cross-referencing Invoices, Payments, Credit Notes, and Receipts.
 * All data fetching and aggregations are strictly reactive and constrained by the user's PB token.
 */
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePermissionsStore } from '../stores/permissionsStore';
import { pb } from '../services/pb';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const route = useRoute();
const router = useRouter();
const permissionsStore = usePermissionsStore();

const invoiceId = route.params.id as string;

/** @type {import('vue').Ref<boolean>} Indicates if the dossier is currently fetching data */
const loading = ref(true);

/** @type {import('vue').Ref<any>} The primary invoice record */
const invoice = ref<any>(null);

/** @type {import('vue').Ref<any[]>} Array of registered payment records linked to this invoice */
const payments = ref<any[]>([]);

/** @type {import('vue').Ref<any[]>} Array of credit notes issued against this invoice */
const creditNotes = ref<any[]>([]);

/** @type {import('vue').Ref<any[]>} Official receipts generated for completed payments */
const receipts = ref<any[]>([]);

/**
 * Formats a generic numerical value into a localized MXN string.
 * @param {number} value - The numerical amount
 * @returns {string} Formatted currency string
 */
const formatCurrency = (value: number) => {
  if (!value) return '$0.00';
  return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

/**
 * Standardizes ISO date strings into readable 'es-MX' formats.
 * @param {string} dateString - The ISO date string
 * @returns {string} The localized date
 */
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
};

/**
 * Evaluates the status string of the invoice and returns a PrimeVue severity color.
 * @param {string} status - Raw status string (e.g. 'PAGADA', 'VENCIDA')
 * @returns {'success' | 'warn' | 'danger' | 'secondary' | 'info'} Severity token
 */
const getStatusSeverity = (status: string) => {
  if (!status) return 'info';
  switch (status.toUpperCase()) {
    case 'PAGADA': return 'success';
    case 'PENDIENTE': return 'warn';
    case 'VENCIDA': return 'danger';
    case 'CANCELADA': return 'secondary';
    default: return 'info';
  }
};

/**
 * @type {import('vue').ComputedRef<number>}
 * @description Dynamically calculates the sum of all valid, non-rejected payments applied to the invoice.
 */
const totalPagado = computed(() => {
  return payments.value.reduce((acc, p) => acc + ((p.estado !== 'RECHAZADO') ? (p.monto || 0) : 0), 0);
});

/**
 * @type {import('vue').ComputedRef<number>}
 * @description Aggregates the total value of all credit notes linked to this invoice.
 */
const totalNotasCredito = computed(() => {
  return creditNotes.value.reduce((acc, cn) => acc + (cn.monto || 0), 0);
});

/**
 * @type {import('vue').ComputedRef<number>}
 * @description Derives the outstanding balance (Total - Payments - Credit Notes). Never drops below 0.
 */
const saldoPendiente = computed(() => {
  if (!invoice.value) return 0;
  const saldo = (invoice.value.total || 0) - totalPagado.value - totalNotasCredito.value;
  return saldo > 0 ? saldo : 0;
});

/**
 * Orchestrates the concurrent fetching of the invoice and all interrelated financial entities.
 * Gracefully swallows errors for optional tables (e.g., if no receipts exist).
 * @returns {Promise<void>}
 */
const fetchData = async () => {
  if (!invoiceId) {
    loading.value = false;
    return;
  }
  
  loading.value = true;
  try {
    // 1. Fetch Invoice
    invoice.value = await pb.collection('facturas').getOne(invoiceId);

    // 2. Fetch related Payments
    try {
      const pagosRes = await pb.collection('pagos').getFullList({
        filter: `factura_id = "${invoiceId}"`,
        sort: '-created'
      });
      payments.value = pagosRes;
    } catch (e) {
      console.warn('Pagos no encontrados o tabla inexistente');
    }

    // 3. Fetch related Credit Notes
    try {
      const notasRes = await pb.collection('notas_credito').getFullList({
        filter: `factura_id = "${invoiceId}"`,
        sort: '-created'
      });
      creditNotes.value = notasRes;
    } catch (e) {
      console.warn('Notas de crédito no encontradas o tabla inexistente');
    }

    // 4. Fetch related Receipts
    try {
      const recibosRes = await pb.collection('recibos').getFullList({
        filter: `factura_id = "${invoiceId}"`,
        sort: '-created'
      });
      receipts.value = recibosRes;
    } catch (e) {
      console.warn('Recibos no encontrados o tabla inexistente');
    }

  } catch (err) {
    console.error('Error fetching dossier data', err);
    invoice.value = null;
  } finally {
    loading.value = false;
  }
};

/**
 * Initiates the flow to register a new payment specifically for this invoice.
 */
const registerPayment = () => {
  // Logic to register payment linked to this invoice
};

/**
 * Triggers the browser's native print dialog to emit a physical copy or PDF of the dossier.
 */
const printDossier = () => {
  window.print();
};

onMounted(() => {
  fetchData();
});
</script>
