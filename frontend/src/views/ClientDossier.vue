<template>
  <div class="p-6 max-w-7xl mx-auto flex flex-col gap-6 w-full">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex gap-4 items-center">
        <Button icon="pi pi-arrow-left" class="p-button-rounded p-button-text p-button-secondary" @click="router.back()" />
        <div>
          <h1 class="text-3xl font-bold text-slate-900 m-0">Expediente del Cliente</h1>
          <p class="text-slate-600 m-0 mt-1 text-sm">{{ clientStore.currentClient?.name || 'Cargando...' }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <Button label="Editar Cliente" icon="pi pi-pencil" class="p-button-outlined" />
        <Button label="Aprobar Expediente" icon="pi pi-check" class="p-button-success" />
      </div>
    </div>

    <div v-if="clientStore.loading" class="flex justify-center p-8">
      <i class="pi pi-spin pi-spinner text-4xl text-slate-400"></i>
    </div>
    
    <div v-else-if="clientStore.currentClient" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Info Column -->
      <div class="lg:col-span-1 flex flex-col gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h2 class="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">Información General</h2>
          <div class="flex flex-col gap-4 text-sm">
            <div>
              <span class="block text-slate-600 mb-1">Razón Social</span>
              <span class="font-medium text-slate-900">{{ clientStore.currentClient.name }}</span>
            </div>
            <div>
              <span class="block text-slate-600 mb-1">RFC</span>
              <span class="font-medium text-slate-900">{{ clientStore.currentClient.rfc }}</span>
            </div>
            <div>
              <span class="block text-slate-600 mb-1">Contacto</span>
              <span class="font-medium text-slate-900">{{ clientStore.currentClient.email || 'N/A' }}</span>
            </div>
            <div>
              <span class="block text-slate-600 mb-1">Estado de Validación</span>
              <Tag 
                :severity="getStatusSeverity(clientStore.currentClient.status)" 
                :value="(clientStore.currentClient.status || 'pendiente').toUpperCase()" 
              />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h2 class="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">Historial Reciente</h2>
          <ul class="m-0 p-0 list-none flex flex-col gap-3 text-sm">
            <li class="flex gap-3">
              <i class="pi pi-user-edit text-slate-400 mt-1"></i>
              <div>
                <p class="m-0 text-slate-900">Expediente creado</p>
                <span class="text-slate-600 text-xs">Por Sistema - Hoy</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Documents Column -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div class="flex justify-between items-center mb-4 border-b pb-2">
            <h2 class="text-lg font-semibold text-slate-900 m-0">Documentos (KYC)</h2>
            <Button label="Subir Documento" icon="pi pi-upload" class="p-button-text p-button-sm" />
          </div>

          <div class="flex flex-col gap-3">
            <div v-for="doc in requiredDocuments" :key="doc.id" class="flex items-center justify-between p-3 rounded border border-slate-100 hover:bg-slate-50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-600">
                  <i :class="doc.icon"></i>
                </div>
                <div>
                  <h3 class="m-0 text-sm font-medium text-slate-900">{{ doc.name }}</h3>
                  <p class="m-0 text-xs text-slate-600 mt-0.5">{{ doc.uploaded ? 'Subido el ' + doc.date : 'Pendiente de carga' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Tag v-if="doc.uploaded" severity="success" value="COMPLETO" />
                <Tag v-else severity="warning" value="REQUERIDO" />
                <Button v-if="doc.uploaded" icon="pi pi-eye" class="p-button-rounded p-button-text p-button-secondary" title="Ver" aria-label="Ver Documento" />
                <Button v-else icon="pi pi-upload" class="p-button-rounded p-button-text p-button-secondary" title="Subir" aria-label="Subir Documento" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useClientStore } from '../stores/clientStore';

import Button from 'primevue/button';
import Tag from 'primevue/tag';
// Pre-prepared for Axios calls: import { http } from '../api/http';

const route = useRoute();
const router = useRouter();
const clientStore = useClientStore();

// Prepared state for real documents via Axios
// const documents = ref([]);
// const loadDocuments = async () => {
//   const res = await http.get(`/clients/${route.params.id}/documents`);
//   documents.value = res.data;
// }

// Standard required documents skeleton until real backend links them
const requiredDocuments = ref([
  { id: 'ine', name: 'Identificación Oficial (INE)', icon: 'pi pi-id-card', uploaded: false, date: '' },
  { id: 'rfc', name: 'Constancia de Situación Fiscal (RFC)', icon: 'pi pi-file-pdf', uploaded: false, date: '' },
  { id: 'domicilio', name: 'Comprobante de Domicilio', icon: 'pi pi-home', uploaded: false, date: '' },
  { id: 'acta', name: 'Acta Constitutiva', icon: 'pi pi-book', uploaded: false, date: '' },
  { id: 'poder', name: 'Poder Notarial del Representante', icon: 'pi pi-briefcase', uploaded: false, date: '' }
]);

onMounted(async () => {
  const clientId = route.params.id as string;
  if (clientId) {
    await clientStore.fetchClientById(clientId);
    // await loadDocuments();
  }
});

const getStatusSeverity = (status: string | undefined) => {
  const s = status?.toLowerCase() || '';
  if (s === 'aprobado' || s === 'validado') return 'success';
  if (s === 'pendiente') return 'warning';
  if (s === 'rechazado') return 'danger';
  return 'info';
};
</script>
