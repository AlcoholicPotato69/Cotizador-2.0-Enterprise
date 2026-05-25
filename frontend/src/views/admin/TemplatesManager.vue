<template>
  <div class="flex flex-col gap-6 p-2">
    <div>
      <h1 class="font-display text-3xl font-bold m-0 text-white">Bóveda Legal</h1>
      <p class="text-white/50 m-0 text-sm font-body mt-1">Gestor de plantillas de contratos, cotizaciones y reglamentos.</p>
    </div>
    <div class="rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl p-6" style="box-shadow: var(--shadow-ambient)">
      <div class="flex justify-between items-center mb-6">
        <h2 class="font-display text-xl font-semibold m-0 text-white">Documentos Base</h2>
        <Button label="Nueva Plantilla" icon="pi pi-plus" class="bg-primary-500 hover:bg-primary-400 border-none rounded-full px-6 transition-all" @click="openNew" />
      </div>
      <DataTable :value="templates" :loading="loading" responsiveLayout="scroll" class="p-datatable-sm">
        <Column field="id" header="ID"></Column>
        <Column field="title" header="Título"></Column>
        <Column field="type" header="Tipo"></Column>
        <Column field="version" header="Versión"></Column>
        <Column header="Acciones" :exportable="false" style="width: 120px">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" text rounded class="text-white/70 hover:text-white" @click="editTemplate(slotProps.data)" />
              <Button icon="pi pi-trash" text rounded class="text-red-400 hover:text-red-300" @click="deleteTemplate(slotProps.data)" />
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

const templates = ref([]);
const loading = ref(false);

const loadTemplates = async () => {
  loading.value = true;
  try {
    const res = await http.get('/templates');
    templates.value = res.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadTemplates();
});

const openNew = () => {};
const editTemplate = (_template: any) => {};
const deleteTemplate = async (template: any) => {
  if (confirm('¿Eliminar esta plantilla?')) {
    try {
      await http.delete(`/templates/${template.id}`);
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  }
};
</script>
