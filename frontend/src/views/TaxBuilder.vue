<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-surface-200 dark:border-surface-800 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">Tax Builder</h1>
        <p class="text-sm text-surface-500 mt-1">Configuración Fiscal Dinámica. Cero Código Duro.</p>
      </div>
      <DsButton v-if="permissionsStore.can('taxes.manage')" label="Añadir Regla Fiscal" icon="pi pi-plus" class="p-button-primary shadow-md hover:shadow-lg transition-all" @click="openNew" />
    </div>

    <div v-if="!permissionsStore.can('taxes.read')" class="p-4 bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-500/20 text-sm flex items-center gap-3">
      <i class="pi pi-ban text-xl"></i>
      <span>No tienes permisos suficientes para visualizar las configuraciones fiscales (requiere <strong>taxes.read</strong>).</span>
    </div>

    <div v-else class="space-y-6">
      <!-- Data Table Container -->
      <div class="bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden p-1">
        <DsTable 
          :value="taxStore.taxes" 
          :loading="taxStore.loading" 
          dataKey="id" 
          emptyMessage="No hay reglas fiscales configuradas."
          class="p-datatable-lg"
        >
          <template #header>
            <div class="flex justify-between items-center p-3">
              <h3 class="text-lg font-semibold text-surface-800 dark:text-surface-100 m-0">Impuestos Activos</h3>
              <DsButton icon="pi pi-refresh" class="p-button-rounded p-button-text p-button-secondary" @click="fetchData" />
            </div>
          </template>

          <DsColumn field="taxName" header="Nombre del Impuesto" style="width: 25%">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <span class="font-bold text-surface-900 dark:text-surface-50">{{ data.taxName }}</span>
                <DsTag v-if="data.isDefault" value="Default" severity="success" class="!text-[10px] !px-2" />
              </div>
            </template>
          </DsColumn>

          <DsColumn field="taxRate" header="Tasa (Decimal)" style="width: 15%">
            <template #body="{ data }">
              <span class="font-bold font-mono text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-md">
                {{ data.taxRate }}
              </span>
            </template>
          </DsColumn>

          <DsColumn field="validFrom" header="Válido Desde" style="width: 20%">
            <template #body="{ data }">
              <span class="text-surface-600 dark:text-surface-300">{{ formatDate(data.validFrom) }}</span>
            </template>
          </DsColumn>
          
          <DsColumn field="validUntil" header="Válido Hasta" style="width: 20%">
            <template #body="{ data }">
              <span v-if="data.validUntil" class="text-surface-600 dark:text-surface-300">{{ formatDate(data.validUntil) }}</span>
              <span v-else class="text-surface-400 italic">Indefinido</span>
            </template>
          </DsColumn>

          <DsColumn header="Acciones" :exportable="false" style="width: 20%" alignFrozen="right" frozen>
            <template #body="{ data }">
              <div class="flex justify-end gap-1">
                <DsButton icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info" aria-label="Editar" @click="editTax(data)" v-if="permissionsStore.can('taxes.manage')" v-tooltip.top="'Editar'" />
                <DsButton icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" aria-label="Eliminar" @click="confirmDelete(data)" v-if="permissionsStore.can('taxes.manage')" v-tooltip.top="'Eliminar'" />
              </div>
            </template>
          </DsColumn>
        </DsTable>
      </div>

      <!-- Info Card -->
      <div class="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl text-sm text-primary-800 dark:text-primary-300 flex items-start gap-3">
        <i class="pi pi-info-circle text-xl mt-0.5"></i>
        <div>
          <strong class="block mb-1">Snapshot Strategy (Inmutabilidad Histórica)</strong>
          Cualquier cambio en la tasa de impuestos modificando fechas de validez solo afectará cotizaciones futuras. Los recibos, facturas e históricos preservan el snapshot del impuesto congelado.
        </div>
      </div>
    </div>

    <!-- Tax Dialog -->
    <DsModal v-model:visible="taxDialog" :style="{width: '550px'}" :header="taxForm.id ? 'Editar Regla Fiscal' : 'Nueva Regla Fiscal'" :modal="true" class="p-fluid">
      <div class="flex flex-col gap-4 mt-4">
        <div class="field flex items-center justify-between bg-surface-50 dark:bg-surface-900 p-3 rounded-lg border border-surface-200 dark:border-surface-800">
          <div>
            <label class="text-sm font-semibold text-surface-900 dark:text-surface-50 mb-1 block">Impuesto por Defecto</label>
            <span class="text-xs text-surface-500">¿Se aplica automáticamente a nuevas cotizaciones?</span>
          </div>
          <ToggleSwitch v-model="taxForm.isDefault" />
        </div>

        <div class="field">
          <label for="taxName" class="text-sm font-medium text-surface-700 dark:text-surface-300">Nombre del Impuesto</label>
          <DsInput id="taxName" v-model="taxForm.taxName" placeholder="Ej. I.V.A" required autofocus />
        </div>
        <div class="field">
          <label for="taxRate" class="text-sm font-medium text-surface-700 dark:text-surface-300">Tasa (Decimal Ej. 0.16)</label>
          <DsInputNumber id="taxRate" v-model="taxForm.taxRate" mode="decimal" :minFractionDigits="0" :maxFractionDigits="4" placeholder="0.16" required />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label for="validFrom" class="text-sm font-medium text-surface-700 dark:text-surface-300">Válido Desde</label>
            <DatePicker id="validFrom" v-model="validFromDate" dateFormat="dd/mm/yy" showIcon fluid required />
          </div>
          <div class="field">
            <label for="validUntil" class="text-sm font-medium text-surface-700 dark:text-surface-300">Válido Hasta (Opcional)</label>
            <DatePicker id="validUntil" v-model="validUntilDate" dateFormat="dd/mm/yy" showIcon fluid showButtonBar />
          </div>
        </div>
      </div>
      <template #footer>
        <DsButton label="Cancelar" icon="pi pi-times" text @click="taxDialog = false" class="p-button-secondary" />
        <DsButton label="Guardar" icon="pi pi-check" @click="saveTax" class="p-button-primary" :loading="isSubmitting" />
      </template>
    </DsModal>

    <Toast position="bottom-right" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePermissionsStore } from '../stores/permissionsStore';
import { useTaxStore, type TaxConfiguration } from '../stores/taxStore';
import { useToast } from 'primevue/usetoast';

const permissionsStore = usePermissionsStore();
const taxStore = useTaxStore();
const toast = useToast();

const taxDialog = ref(false);
const isSubmitting = ref(false);

const validFromDate = ref<Date | null>(null);
const validUntilDate = ref<Date | null>(null);

const taxForm = ref<TaxConfiguration>({
  taxName: '',
  taxRate: 0,
  validFrom: new Date().toISOString(),
  validUntil: null,
  isDefault: false
});

const formatDate = (isoString: string) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('es-MX');
};

const fetchData = async () => {
  await taxStore.fetchTaxes();
};

const openNew = () => {
  taxForm.value = {
    taxName: '',
    taxRate: 0,
    validFrom: new Date().toISOString(),
    validUntil: null,
    isDefault: false
  };
  validFromDate.value = new Date();
  validUntilDate.value = null;
  taxDialog.value = true;
};

const editTax = (data: TaxConfiguration) => {
  taxForm.value = { ...data };
  validFromDate.value = data.validFrom ? new Date(data.validFrom) : null;
  validUntilDate.value = data.validUntil ? new Date(data.validUntil) : null;
  taxDialog.value = true;
};

const saveTax = async () => {
  if (!taxForm.value.taxName || taxForm.value.taxRate === null || !validFromDate.value) {
    toast.add({ severity: 'warn', summary: 'Validación', detail: 'Por favor completa todos los campos requeridos.', life: 3000 });
    return;
  }

  taxForm.value.validFrom = validFromDate.value.toISOString();
  taxForm.value.validUntil = validUntilDate.value ? validUntilDate.value.toISOString() : null;

  isSubmitting.value = true;
  try {
    if (taxForm.value.id) {
      await taxStore.updateTax(taxForm.value.id, taxForm.value);
      toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Regla fiscal actualizada.', life: 3000 });
    } else {
      await taxStore.createTax(taxForm.value);
      toast.add({ severity: 'success', summary: 'Creado', detail: 'Regla fiscal creada.', life: 3000 });
    }
    taxDialog.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar la regla.', life: 3000 });
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = async (data: TaxConfiguration) => {
  if (confirm(`¿Estás seguro de eliminar el impuesto "${data.taxName}"?`)) {
    try {
      if(data.id) {
        await taxStore.deleteTax(data.id);
        toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Impuesto eliminado correctamente.', life: 3000 });
      }
    } catch (e) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el impuesto.', life: 3000 });
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>

