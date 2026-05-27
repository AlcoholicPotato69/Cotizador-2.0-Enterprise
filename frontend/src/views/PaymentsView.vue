<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-surface-200 dark:border-surface-800 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">Pagos</h1>
        <p class="text-sm text-surface-500 mt-1">Registro de cobros, conciliación y flujos de revisión</p>
      </div>
      <DsButton v-if="permissionsStore.can('payments.create')" label="Registrar Pago" icon="pi pi-money-bill" class="p-button-primary shadow-md hover:shadow-lg transition-all" @click="openNew" />
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold text-surface-500 uppercase tracking-wider">Recaudado (Aprobado)</h3>
          <i class="pi pi-wallet text-xl text-primary-500"></i>
        </div>
        <div class="mt-2 text-4xl font-black text-surface-900 dark:text-surface-50 tracking-tight">{{ formatCurrency(summary.approvedTotal) }}</div>
      </div>
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold text-surface-500 uppercase tracking-wider">En Revisión</h3>
          <i class="pi pi-clock text-xl text-warning-500"></i>
        </div>
        <div class="mt-2 text-4xl font-black text-warning-600 dark:text-warning-400 tracking-tight">{{ summary.reviewCount }} Pagos</div>
      </div>
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold text-surface-500 uppercase tracking-wider">Reembolsos</h3>
          <i class="pi pi-refresh text-xl text-danger-500"></i>
        </div>
        <div class="mt-2 text-4xl font-black text-danger-600 dark:text-danger-400 tracking-tight">{{ formatCurrency(summary.refundTotal) }}</div>
      </div>
    </div>

    <!-- Data Table Container -->
    <div class="bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden p-1">
      <DsTable 
        :value="paymentStore.payments" 
        :loading="paymentStore.loading" 
        paginator 
        :rows="10" 
        :rowsPerPageOptions="[10, 20, 50]"
        dataKey="id" 
        v-model:filters="filters" 
        filterDisplay="menu"
        emptyMessage="No hay pagos registrados."
        class="p-datatable-lg"
      >
        <template #header>
          <div class="flex justify-between items-center p-3">
            <span class="p-input-icon-left w-full max-w-md">
              <i class="pi pi-search text-surface-400" />
              <DsInput v-model="filters['global'].value" placeholder="Buscar por ID o factura..." class="w-full !rounded-xl" />
            </span>
            <DsButton icon="pi pi-refresh" class="p-button-rounded p-button-text p-button-secondary" @click="fetchData" />
          </div>
        </template>

        <DsColumn field="id" header="ID Pago" sortable style="width: 15%">
          <template #body="{ data }">
            <span class="font-mono text-surface-900 dark:text-surface-50 font-medium">{{ data.id?.substring(0,8) }}</span>
          </template>
        </DsColumn>

        <DsColumn field="invoiceId" header="Factura Asociada" sortable style="width: 20%">
          <template #body="{ data }">
            <span class="font-mono text-primary-600 dark:text-primary-400 font-semibold cursor-pointer hover:underline" @click="viewInvoiceDossier(data.invoiceId)">
              {{ data.invoiceId?.substring(0,8) || 'N/A' }}
            </span>
          </template>
        </DsColumn>

        <DsColumn field="created_at" header="Fecha" sortable style="width: 15%">
          <template #body="{ data }">
            <span class="text-surface-600 dark:text-surface-300">{{ formatDate(data.createdAt || data.created_at) }}</span>
          </template>
        </DsColumn>

        <DsColumn field="status" header="Estado" sortable style="width: 15%">
          <template #body="{ data }">
            <DsTag :value="getStatusLabel(data.status)" :severity="getStatusSeverity(data.status)" class="!rounded-md !px-2 uppercase text-xs font-bold" />
          </template>
        </DsColumn>

        <DsColumn field="paymentAmount" header="Monto" sortable style="width: 15%">
          <template #body="{ data }">
            <span class="font-bold text-success-600 dark:text-success-400 text-lg">{{ formatCurrency(data.paymentAmount) }}</span>
          </template>
        </DsColumn>

        <DsColumn header="Acciones" :exportable="false" style="width: 20%" alignFrozen="right" frozen>
          <template #body="{ data }">
            <div class="flex justify-end gap-1">
              <DsButton v-if="data.status === 'UNDER_REVIEW'" icon="pi pi-check" class="p-button-rounded p-button-text p-button-success" @click="approvePayment(data)" v-tooltip.top="'Aprobar Pago'" />
              <DsButton v-if="data.status === 'UNDER_REVIEW'" icon="pi pi-times" class="p-button-rounded p-button-text p-button-danger" @click="openReject(data)" v-tooltip.top="'Rechazar Pago'" />
              <DsButton v-if="data.status === 'APPROVED'" icon="pi pi-refresh" class="p-button-rounded p-button-text p-button-warning" @click="openRefund(data)" v-tooltip.top="'Reembolsar Pago'" />
            </div>
          </template>
        </DsColumn>
      </DsTable>
    </div>

    <!-- Submit Payment Dialog -->
    <DsModal v-model:visible="paymentDialog" :style="{width: '450px'}" header="Registrar Pago" :modal="true" class="p-fluid">
      <div class="flex flex-col gap-4 mt-4">
        <div class="field">
          <label for="invoiceId" class="text-sm font-medium text-surface-700 dark:text-surface-300">ID de Factura</label>
          <DsInput id="invoiceId" v-model="submitForm.invoiceId" placeholder="UUID de factura" required autofocus />
        </div>
        <div class="field">
          <label for="paymentAmount" class="text-sm font-medium text-surface-700 dark:text-surface-300">Monto del Pago</label>
          <DsInputNumber id="paymentAmount" v-model="submitForm.paymentAmount" mode="currency" currency="MXN" locale="es-MX" required />
        </div>
        <div class="field">
          <label for="currencyCode" class="text-sm font-medium text-surface-700 dark:text-surface-300">Moneda</label>
          <Dropdown id="currencyCode" v-model="submitForm.currencyCode" :options="['MXN', 'USD', 'EUR']" placeholder="Moneda" />
        </div>
        <div class="field">
          <label for="evidenceUrl" class="text-sm font-medium text-surface-700 dark:text-surface-300">URL de Evidencia / Recibo</label>
          <DsInput id="evidenceUrl" v-model="submitForm.evidenceUrl" placeholder="https://..." />
        </div>
      </div>
      <template #footer>
        <DsButton label="Cancelar" icon="pi pi-times" text @click="paymentDialog = false" class="p-button-secondary" />
        <DsButton label="Registrar" icon="pi pi-send" @click="submitPayment" class="p-button-primary" :loading="isSubmitting" />
      </template>
    </DsModal>

    <!-- Reject/Refund Action Dialog -->
    <DsModal v-model:visible="actionDialog" :style="{width: '400px'}" :header="actionType === 'REJECT' ? 'Rechazar Pago' : 'Reembolsar Pago'" :modal="true" class="p-fluid">
      <div class="flex flex-col gap-4 mt-4">
        <div class="field">
          <label for="reason" class="text-sm font-medium text-surface-700 dark:text-surface-300">Motivo</label>
          <DsTextarea id="reason" v-model="actionReason" rows="3" required placeholder="Describe el motivo detallado..." />
        </div>
      </div>
      <template #footer>
        <DsButton label="Cancelar" icon="pi pi-times" text @click="actionDialog = false" class="p-button-secondary" />
        <DsButton :label="actionType === 'REJECT' ? 'Rechazar' : 'Reembolsar'" icon="pi pi-check" @click="executeAction" :class="actionType === 'REJECT' ? 'p-button-danger' : 'p-button-warning'" :loading="isSubmitting" />
      </template>
    </DsModal>

    <Toast position="bottom-right" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePermissionsStore } from '../stores/permissionsStore';
import { usePaymentStore, type SubmitPaymentDto } from '../stores/paymentStore';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';

const permissionsStore = usePermissionsStore();
const paymentStore = usePaymentStore();
const router = useRouter();
const toast = useToast();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const isSubmitting = ref(false);
const paymentDialog = ref(false);
const actionDialog = ref(false);
const actionType = ref<'REJECT' | 'REFUND' | null>(null);
const activePaymentId = ref('');
const actionReason = ref('');

const submitForm = ref<SubmitPaymentDto>({
  invoiceId: '',
  paymentAmount: 0,
  currencyCode: 'MXN',
  evidenceUrl: ''
});

const summary = computed(() => {
  let approvedTotal = 0, reviewCount = 0, refundTotal = 0;
  paymentStore.payments.forEach(p => {
    if (p.status === 'APPROVED') approvedTotal += p.paymentAmount || 0;
    if (p.status === 'UNDER_REVIEW') reviewCount++;
    if (p.status === 'REFUNDED') refundTotal += p.paymentAmount || 0;
  });
  return { approvedTotal, reviewCount, refundTotal };
});

const getStatusSeverity = (status: string) => {
  if(!status) return 'secondary';
  switch (status.toUpperCase()) {
    case 'APPROVED': return 'success';
    case 'UNDER_REVIEW': return 'warning';
    case 'REJECTED': return 'danger';
    case 'REFUNDED': return 'info';
    case 'PENDING': return 'secondary';
    default: return 'info';
  }
};

const getStatusLabel = (status: string) => {
  if(!status) return 'Pendiente';
  switch (status.toUpperCase()) {
    case 'APPROVED': return 'Aprobado';
    case 'UNDER_REVIEW': return 'En Revisión';
    case 'REJECTED': return 'Rechazado';
    case 'REFUNDED': return 'Reembolsado';
    case 'PENDING': return 'Pendiente';
    default: return status;
  }
};

const formatCurrency = (value: number) => {
  if (!value) return '$0.00';
  return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-MX');
};

const fetchData = async () => {
  await paymentStore.fetchPayments();
};

const openNew = () => {
  submitForm.value = { invoiceId: '', paymentAmount: 0, currencyCode: 'MXN', evidenceUrl: '' };
  paymentDialog.value = true;
};

const submitPayment = async () => {
  isSubmitting.value = true;
  try {
    await paymentStore.submitPayment(submitForm.value);
    toast.add({ severity: 'success', summary: 'Registrado', detail: 'Pago enviado a revisión.', life: 3000 });
    paymentDialog.value = false;
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el pago.', life: 3000 });
  } finally {
    isSubmitting.value = false;
  }
};

const approvePayment = async (data: any) => {
  try {
    await paymentStore.approvePayment(data.id);
    toast.add({ severity: 'success', summary: 'Aprobado', detail: 'El pago ha sido aprobado.', life: 3000 });
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo aprobar el pago.', life: 3000 });
  }
};

const openReject = (data: any) => {
  activePaymentId.value = data.id;
  actionType.value = 'REJECT';
  actionReason.value = '';
  actionDialog.value = true;
};

const openRefund = (data: any) => {
  activePaymentId.value = data.id;
  actionType.value = 'REFUND';
  actionReason.value = '';
  actionDialog.value = true;
};

const executeAction = async () => {
  if (!actionReason.value) {
    toast.add({ severity: 'warn', summary: 'Validación', detail: 'El motivo es requerido.', life: 3000 });
    return;
  }
  
  isSubmitting.value = true;
  try {
    if (actionType.value === 'REJECT') {
      await paymentStore.rejectPayment(activePaymentId.value, { rejectionReason: actionReason.value });
      toast.add({ severity: 'success', summary: 'Rechazado', detail: 'El pago ha sido rechazado.', life: 3000 });
    } else {
      await paymentStore.refundPayment(activePaymentId.value, { refundReason: actionReason.value });
      toast.add({ severity: 'success', summary: 'Reembolsado', detail: 'El reembolso ha sido procesado.', life: 3000 });
    }
    actionDialog.value = false;
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo procesar la acción.', life: 3000 });
  } finally {
    isSubmitting.value = false;
  }
};

const viewInvoiceDossier = (id: string) => {
  if(id) router.push({ name: 'finance-dossier', params: { id } });
};

onMounted(() => {
  fetchData();
});
</script>

