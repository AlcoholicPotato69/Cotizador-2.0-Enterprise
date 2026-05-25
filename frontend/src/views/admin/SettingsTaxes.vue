<template>
  <div class="flex flex-col gap-6 p-2">
    <div>
      <h1 class="font-display text-3xl font-bold m-0 text-white">Centro Fiscal</h1>
      <p class="text-white/50 m-0 text-sm font-body mt-1">Configuración global de impuestos y retenciones.</p>
    </div>
    <div class="rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl p-6" style="box-shadow: var(--shadow-ambient)">
      <div class="flex justify-between items-center mb-6">
        <h2 class="font-display text-xl font-semibold m-0 text-white">Tasas Impositivas</h2>
        <Button label="Nuevo Impuesto" icon="pi pi-plus" class="bg-primary-500 hover:bg-primary-400 border-none rounded-full px-6 transition-all" @click="openNew" />
      </div>
      <DataTable :value="taxes" :loading="loading" responsiveLayout="scroll" class="p-datatable-sm">
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Nombre"></Column>
        <Column field="rate" header="Tasa (%)"></Column>
        <Column field="status" header="Estado"></Column>
        <Column header="Acciones" :exportable="false" style="width: 120px">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" text rounded class="text-white/70 hover:text-white" @click="editTax(slotProps.data)" />
              <Button icon="pi pi-trash" text rounded class="text-red-400 hover:text-red-300" @click="deleteTax(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { http } from '../../api/http';

const taxes = ref([]);
const loading = ref(false);

const loadTaxes = async () => {
  loading.value = true;
  try {
    const res = await http.get('/settings/taxes');
    taxes.value = res.data;
  } catch (error) {
    console.error('Error fetching taxes:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadTaxes();
});

const openNew = () => {};
const editTax = (_tax: any) => {};
const deleteTax = async (tax: any) => {
  if (confirm('¿Eliminar este impuesto?')) {
    try {
      await http.delete(`/settings/taxes/${tax.id}`);
      loadTaxes();
    } catch (error) {
      console.error('Error deleting tax:', error);
    }
  }
};
</script>
