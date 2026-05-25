<template>
  <div class="p-6 max-w-7xl mx-auto flex flex-col gap-6 w-full">
    <!-- Header -->
    <div class="flex items-start justify-between bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-lg text-xl font-bold">
          <i class="pi pi-file-edit"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-slate-900 m-0">Expediente de Acuerdo: {{ agreementId }}</h1>
          <p class="text-slate-600 m-0 mt-1">
            Contrato Base: <span class="font-mono text-primary-600">CTR-001</span> &bull; 
            Estado: <Tag severity="warning" value="BORRADOR" class="ml-2" />
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <Button icon="pi pi-check" label="Aprobar" class="p-button-success" />
        <Button icon="pi pi-arrow-left" label="Volver" class="p-button-text p-button-secondary" @click="goBack" />
      </div>
    </div>

    <!-- Tabs Content -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <Tabs value="carta">
        <TabList>
          <Tab value="carta">
            <i class="pi pi-file mr-2"></i> Carta Convenio
          </Tab>
          <Tab value="entregables">
            <i class="pi pi-box mr-2"></i> Entregables
          </Tab>
          <Tab value="firmas">
            <i class="pi pi-pen-to-square mr-2"></i> Firmas
          </Tab>
        </TabList>
        <TabPanels>
          <!-- Carta Convenio -->
          <TabPanel value="carta">
            <div class="p-4 flex gap-6">
              <div class="w-full md:w-2/3">
                <h3 class="text-lg font-bold text-slate-800 mb-4">Documento Carta Convenio</h3>
                <div class="bg-slate-50 border border-slate-200 p-6 rounded-lg h-[500px] overflow-y-auto prose prose-slate max-w-none">
                  <h3 class="text-center">CARTA CONVENIO Y ADENDUM</h3>
                  <p class="text-right text-sm">Fecha: 24 de Mayo de 2026</p>
                  <p>Por medio de la presente, las partes acuerdan las siguientes modificaciones e inclusiones al contrato base <strong>CTR-001</strong>...</p>
                  <p><strong>PRIMERA:</strong> Se acuerda la entrega de los siguientes entregables descritos en el anexo de esta carta.</p>
                  <p v-for="i in 5" :key="i">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
              </div>
              <div class="hidden md:block w-1/3">
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 sticky top-4">
                  <h4 class="font-bold text-slate-800 mb-3">Detalles del Acuerdo</h4>
                  <ul class="space-y-3 text-sm text-slate-600">
                    <li class="flex justify-between border-b border-slate-200 pb-2">
                      <span class="font-medium">Tipo:</span>
                      <span>Modificatorio</span>
                    </li>
                    <li class="flex justify-between border-b border-slate-200 pb-2">
                      <span class="font-medium">Creacin:</span>
                      <span>2026-05-24</span>
                    </li>
                    <li class="flex justify-between border-b border-slate-200 pb-2">
                      <span class="font-medium">Creado por:</span>
                      <span>Ana lvarez</span>
                    </li>
                  </ul>
                  <div class="mt-6 flex flex-col gap-2">
                    <Button label="Editar Documento" icon="pi pi-pencil" class="p-button-outlined p-button-sm w-full" />
                    <Button label="Generar PDF" icon="pi pi-file-pdf" class="p-button-outlined p-button-secondary p-button-sm w-full" />
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- Entregables -->
          <TabPanel value="entregables">
            <div class="p-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-slate-800 m-0">Lista de Entregables</h3>
                <Button label="Aadir Entregable" icon="pi pi-plus" class="p-button-sm p-button-outlined" />
              </div>
              
              <DataTable :value="entregables" class="p-datatable-sm" borderGrid>
                <Column field="name" header="Descripcin"></Column>
                <Column field="date" header="Fecha Compromiso"></Column>
                <Column field="status" header="Estado">
                  <template #body="{ data }">
                    <Tag :severity="data.status === 'Completado' ? 'success' : 'warning'" :value="data.status" />
                  </template>
                </Column>
                <Column header="Evidencia">
                  <template #body="{ data }">
                    <Button v-if="data.status === 'Completado'" icon="pi pi-paperclip" class="p-button-rounded p-button-text" title="Ver anexo" aria-label="Ver anexo" />
                    <span v-else class="text-slate-400 text-xs italic">Pendiente</span>
                  </template>
                </Column>
              </DataTable>
            </div>
          </TabPanel>

          <!-- Firmas -->
          <TabPanel value="firmas">
            <div class="p-4">
              <h3 class="text-lg font-bold text-slate-800 mb-4">Firmas del Acuerdo</h3>
              <div class="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-6 border border-yellow-200 flex items-start gap-3">
                <i class="pi pi-exclamation-triangle mt-1"></i>
                <p class="m-0 text-sm">Este acuerdo se encuentra en estado <strong>BORRADOR</strong>. Una vez aprobado internamente, se habilitar el envid de solicitud de firmas a las partes involucradas.</p>
              </div>

              <div class="opacity-60 pointer-events-none grid grid-cols-1 md:grid-cols-2 gap-6">
                 <!-- Card Firma Placeholder -->
                 <div class="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                      <i class="pi pi-building"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-900 m-0">Representante Legal</h4>
                      <p class="text-sm text-slate-600 m-0">Pendiente de habilitar</p>
                    </div>
                  </div>
                </div>

                <!-- Card Firma Cliente -->
                <div class="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                      <i class="pi pi-user"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-900 m-0">Cliente</h4>
                      <p class="text-sm text-slate-600 m-0">Pendiente de habilitar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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

const agreementId = computed(() => route.params.id as string || 'AGR-001');

const entregables = ref([
  { id: 1, name: 'Llaves y tarjetas de acceso', date: '2026-06-01', status: 'Pendiente' },
  { id: 2, name: 'Manual de operacin y seguridad', date: '2026-05-20', status: 'Completado' },
  { id: 3, name: 'Mobiliario anexo segn anexo A', date: '2026-06-05', status: 'Pendiente' },
]);

const goBack = () => {
  router.push('/legal/agreements');
};
</script>
