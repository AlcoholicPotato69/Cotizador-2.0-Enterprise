<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-surface-200 dark:border-surface-800 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">Motor de Cotizaciones</h1>
        <p class="text-sm text-surface-500">Gestión Comercial (Ola 3) - Sin Mocks</p>
      </div>
      <DsButton v-if="permissionsStore.can('quotes.create')" label="Nueva Cotización" icon="pi pi-plus" @click="createQuote" severity="primary" />
    </div>

    <!-- Data Table Container -->
    <div class="bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden p-4">
      <DsTable 
        :value="quoteStore.quotes" 
        :loading="quoteStore.loading" 
        paginator 
        :rows="10" 
        dataKey="id" 
        filterDisplay="row" 
        v-model:filters="filters"
        :globalFilterFields="['folio', 'client_id', 'status']"
        emptyMessage="No hay cotizaciones registradas."
        class="p-datatable-sm"
      >
        <template #header>
            <div class="flex justify-end">
                <span class="relative">
                    <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-500" />
                    <DsInput v-model="filters['global'].value" placeholder="Buscar cotización..." class="pl-10 w-full sm:w-auto" />
                </span>
            </div>
        </template>
        <DsColumn field="folio" header="Folio" sortable>
          <template #body="{ data }">
            <button @click="openDossier(data.id)" class="text-primary-600 hover:underline font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1">
              {{ data.folio || 'N/A' }}
            </button>
          </template>
        </DsColumn>
        <DsColumn field="client_id" header="Cliente (ID)" sortable></DsColumn>
        <DsColumn field="status" header="Estado" sortable>
          <template #body="{ data }">
            <DsTag :value="translateStatus(data.status)" :severity="getStatusSeverity(data.status)" />
          </template>
        </DsColumn>
        <DsColumn field="total_amount" header="Total" sortable>
          <template #body="{ data }">
            <span class="font-bold">{{ formatCurrency(data.total_amount) }}</span>
          </template>
        </DsColumn>
        <DsColumn field="updated" header="Última Actualización" sortable>
            <template #body="{ data }">
                {{ formatDate(data.updated) }}
            </template>
        </DsColumn>
        <DsColumn :exportable="false" style="min-width:8rem">
          <template #body="{ data }">
            <DsButton icon="pi pi-eye" outlined rounded severity="info" class="mr-2" @click="openDossier(data.id)" aria-label="Revisar" />
          </template>
        </DsColumn>
      </DsTable>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @module QuotesView
 * @description Main view for listing and managing commercial quotes.
 * Consumes `quoteStore` for state management and `permissionsStore` to evaluate if the user can create new quotes.
 * Displays data in a PrimeVue DataTable with global filtering.
 */
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePermissionsStore } from '../stores/permissionsStore';
import { useQuoteStore } from '../stores/quoteStore';


const router = useRouter();
const permissionsStore = usePermissionsStore();
const quoteStore = useQuoteStore();

/**
 * @type {import('vue').Ref<Record<string, any>>}
 * @description State object holding filter configurations for the PrimeVue DataTable
 */
const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

onMounted(() => {
  quoteStore.fetchQuotes();
});

/**
 * Navigates to the detailed dossier view of a specific quote.
 * 
 * @param {string} id - The ID of the quote to review
 */
const openDossier = (id: string) => {
    router.push(`/quotes/${id}/dossier`);
};

/**
 * Action triggered to initialize the creation of a new quote.
 */
const createQuote = () => {
    // Redirigir a creador o abrir modal
};

/**
 * Formats a numeric amount into a standard MXN currency string.
 * 
 * @param {number | undefined} value - The numerical amount
 * @returns {string} The formatted currency string
 */
const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '$0.00';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
};

/**
 * Formats an ISO date string into a localized Mexican date format.
 * 
 * @param {string | undefined} dateString - The ISO date string
 * @returns {string} The formatted date string
 */
const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-MX');
};

/**
 * Translates machine-readable quote statuses into human-readable Spanish strings.
 * 
 * @param {string} status - The raw state machine status (e.g., 'pending_approval')
 * @returns {string} The humanized status string
 */
const translateStatus = (status: string) => {
    const map: Record<string, string> = {
        'draft': 'Borrador',
        'pending_approval': 'Por Aprobar',
        'approved': 'Aprobada',
        'rejected': 'Rechazada',
        'expired': 'Expirada',
        'converted': 'Convertida'
    };
    return map[status] || status;
};

/**
 * Maps a quote status to a semantic UI severity level for PrimeVue Tags.
 * 
 * @param {string} status - The quote status
 * @returns {'success' | 'warn' | 'danger' | 'info'} The visual severity
 */
const getStatusSeverity = (status: string) => {
    switch (status) {
        case 'approved':
        case 'converted':
            return 'success';
        case 'pending_approval':
        case 'draft':
            return 'warn';
        case 'rejected':
        case 'expired':
            return 'danger';
        default:
            return 'info';
    }
};
</script>

