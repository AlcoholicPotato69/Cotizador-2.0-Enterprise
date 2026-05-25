<template>
  <div class="p-6 max-w-7xl mx-auto flex flex-col gap-6 w-full">
    <!-- Header -->
    <div class="flex items-start justify-between bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-primary-100 text-primary-700 flex items-center justify-center rounded-lg text-xl font-bold">
          <i class="pi pi-file-check"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-slate-900 m-0">Expediente de Contrato: {{ contractId }}</h1>
          <p class="text-slate-600 m-0 mt-1">Cliente: <span class="font-semibold text-slate-700">Empresa A</span> &bull; Estado: <Tag severity="success" value="FIRMADO" class="ml-2" /></p>
        </div>
      </div>
      <div class="flex gap-2">
        <Button icon="pi pi-download" label="Descargar PDF" class="p-button-outlined p-button-secondary" />
        <Button icon="pi pi-arrow-left" label="Volver" class="p-button-text p-button-secondary" @click="goBack" />
      </div>
    </div>

    <!-- Tabs Content -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <Tabs value="reglamento">
        <TabList>
          <Tab value="reglamento">
            <i class="pi pi-book mr-2"></i> Reglamento
          </Tab>
          <Tab value="plano">
            <i class="pi pi-map mr-2"></i> Plano
          </Tab>
          <Tab value="firmas">
            <i class="pi pi-pen-to-square mr-2"></i> Firmas
          </Tab>
          <Tab value="historial">
            <i class="pi pi-history mr-2"></i> Historial
          </Tab>
        </TabList>
        <TabPanels>
          <!-- Reglamento -->
          <TabPanel value="reglamento">
            <div class="p-4">
              <h3 class="text-lg font-bold text-slate-800 mb-4">Reglamento Interno Aceptado</h3>
              <div class="bg-slate-50 border border-slate-200 p-6 rounded-lg h-[400px] overflow-y-auto prose prose-slate max-w-none">
                <h4>1. Uso de Instalaciones</h4>
                <p>El arrendatario se compromete a hacer buen uso de las instalaciones...</p>
                <h4>2. Horarios de Operacin</h4>
                <p>El horario permitido para operaciones logsticas es de 06:00 a 22:00 hrs...</p>
                <!-- Placeholder text -->
                <p v-for="i in 5" :key="i">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
            </div>
          </TabPanel>

          <!-- Plano -->
          <TabPanel value="plano">
            <div class="p-4 flex flex-col items-center">
              <h3 class="text-lg font-bold text-slate-800 mb-4 self-start">Plano de la Propiedad Anexo</h3>
              <div class="w-full max-w-3xl aspect-video bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center flex-col text-slate-600">
                <i class="pi pi-image text-5xl mb-4 text-slate-400"></i>
                <p>Visualizador de Plano Interactivo</p>
                <span class="text-xs mt-2">Lote L-24 &bull; 450m&sup2;</span>
              </div>
            </div>
          </TabPanel>

          <!-- Firmas -->
          <TabPanel value="firmas">
            <div class="p-4">
              <h3 class="text-lg font-bold text-slate-800 mb-4">Estado de Firmas Electrnicas</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <!-- Card Firma Empresa -->
                <div class="border border-slate-200 rounded-xl p-5 relative overflow-hidden bg-white shadow-sm">
                  <div class="absolute top-0 right-0 p-4">
                    <Tag severity="success" value="Firmado" />
                  </div>
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                      <i class="pi pi-building"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-900 m-0">Representante Legal (Nosotros)</h4>
                      <p class="text-sm text-slate-600 m-0">Carlos Mndez</p>
                    </div>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-lg font-mono text-xs text-slate-600 border border-slate-100">
                    <p><strong>Sello Digital:</strong> 3a9f...b4c2</p>
                    <p><strong>Fecha:</strong> 2026-05-20 14:30:00 CST</p>
                    <p><strong>IP:</strong> 192.168.1.100</p>
                  </div>
                </div>

                <!-- Card Firma Cliente -->
                <div class="border border-slate-200 rounded-xl p-5 relative overflow-hidden bg-white shadow-sm">
                  <div class="absolute top-0 right-0 p-4">
                    <Tag severity="warning" value="Pendiente" />
                  </div>
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                      <i class="pi pi-user"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-900 m-0">Cliente</h4>
                      <p class="text-sm text-slate-600 m-0">Empresa A S.A. de C.V.</p>
                    </div>
                  </div>
                  <div class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                    <i class="pi pi-clock text-3xl text-slate-400 mb-3"></i>
                    <p class="text-sm text-slate-600 text-center mb-4">Esperando firma del cliente.</p>
                    <Button label="Enviar Recordatorio" icon="pi pi-bell" class="p-button-outlined p-button-sm" />
                  </div>
                </div>

              </div>
            </div>
          </TabPanel>

          <!-- Historial -->
          <TabPanel value="historial">
            <div class="p-4">
              <h3 class="text-lg font-bold text-slate-800 mb-6">Historial del Contrato</h3>
              <ul class="relative border-l border-slate-200 ml-3 space-y-6">
                <li class="pl-6 relative">
                  <div class="absolute w-3 h-3 bg-primary-500 rounded-full -left-1.5 top-1 ring-4 ring-white"></div>
                  <p class="text-sm font-semibold text-slate-900">Firma por Representante Legal</p>
                  <p class="text-xs text-slate-600">2026-05-20 14:30 &bull; Carlos Mndez</p>
                </li>
                <li class="pl-6 relative">
                  <div class="absolute w-3 h-3 bg-slate-300 rounded-full -left-1.5 top-1 ring-4 ring-white"></div>
                  <p class="text-sm font-semibold text-slate-900">Contrato Generado</p>
                  <p class="text-xs text-slate-600">2026-05-19 10:15 &bull; Sistema</p>
                </li>
                <li class="pl-6 relative">
                  <div class="absolute w-3 h-3 bg-slate-300 rounded-full -left-1.5 top-1 ring-4 ring-white"></div>
                  <p class="text-sm font-semibold text-slate-900">Aprobacin de Cotizacin QT-001</p>
                  <p class="text-xs text-slate-600">2026-05-18 16:45 &bull; Cliente (Empresa A)</p>
                </li>
              </ul>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const route = useRoute();
const router = useRouter();

const contractId = computed(() => route.params.id as string || 'CTR-001');

const goBack = () => {
  router.push('/legal/contracts');
};
</script>

<style scoped>
/* Optional specific overrides */
</style>
