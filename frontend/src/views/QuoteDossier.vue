<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-surface-200 dark:border-surface-800 gap-4">
      <div>
        <div class="flex items-center gap-3">
            <Button icon="pi pi-arrow-left" text rounded @click="router.push('/quotes')" aria-label="Volver" />
            <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">
                Expediente de Cotización {{ quoteStore.currentQuote?.folio ? `#${quoteStore.currentQuote.folio}` : '' }}
            </h1>
            <Tag v-if="quoteStore.currentQuote" :value="translateStatus(quoteStore.currentQuote.status)" :severity="getStatusSeverity(quoteStore.currentQuote.status)" />
        </div>
        <p class="text-sm text-surface-600 mt-1 ml-12">Detalle completo, versiones y documentos asociados</p>
      </div>
      <div class="flex gap-2">
        <Button v-if="canApprove" label="Aprobar" icon="pi pi-check" severity="success" @click="changeStatus('approved')" />
        <Button v-if="canReject" label="Rechazar" icon="pi pi-times" severity="danger" outlined @click="changeStatus('rejected')" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="quoteStore.loading || loadingVersions" class="flex justify-center p-12">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <!-- Content -->
    <div v-else-if="quoteStore.currentQuote" class="bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden p-2">
        <Tabs value="detalle">
            <TabList>
                <Tab value="detalle"><i class="pi pi-info-circle mr-2"></i>Detalle</Tab>
                <Tab value="items"><i class="pi pi-list mr-2"></i>Partidas</Tab>
                <Tab value="versiones"><i class="pi pi-history mr-2"></i>Versiones</Tab>
                <Tab value="snapshots"><i class="pi pi-camera mr-2"></i>Historial</Tab>
                <Tab value="pdf"><i class="pi pi-file-pdf mr-2"></i>Visor PDF</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="detalle">
                    <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-surface-600">ID del Cliente</label>
                                <div class="mt-1 text-surface-900 font-medium">{{ quoteStore.currentQuote.client_id }}</div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-surface-600">Subtotal</label>
                                <div class="mt-1 text-surface-900 font-medium">{{ formatCurrency(quoteStore.currentQuote.subtotal) }}</div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-surface-600">Impuestos</label>
                                <div class="mt-1 text-surface-900 font-medium">{{ formatCurrency(quoteStore.currentQuote.tax_amount) }}</div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-surface-600">Total</label>
                                <div class="mt-1 text-surface-900 font-bold text-lg">{{ formatCurrency(quoteStore.currentQuote.total_amount) }}</div>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-surface-600">Válido Hasta</label>
                                <div class="mt-1 text-surface-900 font-medium">{{ formatDate(quoteStore.currentQuote.valid_until) }}</div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-surface-600">Creado Por</label>
                                <div class="mt-1 text-surface-900 font-medium">{{ quoteStore.currentQuote.created_by }}</div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-surface-600">Notas</label>
                                <div class="mt-1 text-surface-900">{{ quoteStore.currentQuote.notes || 'Sin notas' }}</div>
                            </div>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel value="items">
                    <div class="p-2">
                        <DataTable :value="quoteStore.currentItems" class="p-datatable-sm" emptyMessage="No hay partidas en esta cotización.">
                            <Column field="type" header="Tipo"></Column>
                            <Column field="description" header="Descripción"></Column>
                            <Column field="quantity" header="Cantidad">
                                <template #body="{ data }">{{ data.quantity }}</template>
                            </Column>
                            <Column field="unit_price" header="Precio Unitario">
                                <template #body="{ data }">{{ formatCurrency(data.unit_price) }}</template>
                            </Column>
                            <Column field="total_price" header="Total">
                                <template #body="{ data }">
                                    <span class="font-semibold">{{ formatCurrency(data.total_price) }}</span>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </TabPanel>

                <TabPanel value="versiones">
                    <div class="p-2">
                        <DataTable :value="versions" class="p-datatable-sm" emptyMessage="No hay versiones anteriores.">
                            <Column field="version" header="Versión"></Column>
                            <Column field="created_at" header="Fecha">
                                <template #body="{ data }">{{ formatDateTime(data.created_at) }}</template>
                            </Column>
                            <Column field="change_notes" header="Notas de Cambio"></Column>
                            <Column field="total_amount" header="Total">
                                <template #body="{ data }">{{ formatCurrency(data.total_amount) }}</template>
                            </Column>
                            <Column :exportable="false" style="min-width:8rem">
                                <template #body>
                                    <Button icon="pi pi-eye" outlined rounded severity="info" aria-label="Ver Snapshot" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </TabPanel>

                <TabPanel value="snapshots">
                    <div class="p-2">
                         <DataTable :value="history" class="p-datatable-sm" emptyMessage="No hay historial registrado.">
                            <Column field="action" header="Acción"></Column>
                            <Column field="timestamp" header="Fecha">
                                <template #body="{ data }">{{ formatDateTime(data.timestamp) }}</template>
                            </Column>
                            <Column field="user_id" header="Usuario"></Column>
                            <Column field="details" header="Detalles"></Column>
                        </DataTable>
                    </div>
                </TabPanel>

                <TabPanel value="pdf">
                    <div class="p-2 h-[600px] w-full border border-surface-200 dark:border-surface-700 bg-surface-100 flex items-center justify-center">
                        <!-- Asumiendo que el backend puede retornar un PDF de la cotización -->
                        <iframe :src="pdfUrl" class="w-full h-full border-none" v-if="pdfUrl"></iframe>
                        <div v-else class="text-surface-600 flex flex-col items-center">
                            <i class="pi pi-file-pdf text-4xl mb-2"></i>
                            <span>No se pudo cargar el documento o no está disponible.</span>
                        </div>
                    </div>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuoteStore } from '../stores/quoteStore';
import { usePermissionsStore } from '../stores/permissionsStore';
import { quoteService } from '../services/quoteService';

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const route = useRoute();
const router = useRouter();
const quoteStore = useQuoteStore();
const permissionsStore = usePermissionsStore();

const versions = ref<any[]>([]);
const history = ref<any[]>([]);
const loadingVersions = ref(false);

const quoteId = route.params.id as string;

// Para el PDF, construimos la URL del backend real (Dumb Frontend)
const pdfUrl = computed(() => {
    // Si la API base no está en environment, podríamos usar una URL relativa asumiendo un proxy
    return `/api/v1/quotes/${quoteId}/pdf`; 
});

onMounted(async () => {
    if (quoteId) {
        await quoteStore.fetchQuote(quoteId);
        loadVersionsAndHistory();
    }
});

const loadVersionsAndHistory = async () => {
    loadingVersions.value = true;
    try {
        const [vData, hData] = await Promise.all([
            quoteService.getQuoteVersions(quoteId),
            quoteService.getQuoteHistory(quoteId)
        ]);
        versions.value = Array.isArray(vData) ? vData : [];
        history.value = Array.isArray(hData) ? hData : [];
    } catch (err) {
        console.error("Error fetching versions/history", err);
        // Fallback a vacio en caso de error para no romper la UI
        versions.value = [];
        history.value = [];
    } finally {
        loadingVersions.value = false;
    }
};

const changeStatus = async (newStatus: string) => {
    if (!quoteStore.currentQuote) return;
    try {
        await quoteStore.changeQuoteStatus(quoteId, quoteStore.currentQuote.status, newStatus, 'system');
        // Refresh
        await quoteStore.fetchQuote(quoteId);
        loadVersionsAndHistory();
    } catch (err) {
        console.error(err);
    }
};

const canApprove = computed(() => {
    return permissionsStore.can('quotes.approve') && quoteStore.currentQuote?.status === 'pending_approval';
});

const canReject = computed(() => {
    return permissionsStore.can('quotes.approve') && quoteStore.currentQuote?.status === 'pending_approval';
});

const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '$0.00';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
};

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-MX');
};

const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-MX');
};

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
