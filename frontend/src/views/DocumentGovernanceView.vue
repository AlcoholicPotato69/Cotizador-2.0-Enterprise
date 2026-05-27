<template>
  <div class="h-full flex flex-col space-y-6">
    <DsPageHeader 
      title="Gobernanza de Documentos" 
      subtitle="Políticas de retención, acceso y reglas de vigencia para documentos."
      icon="pi-folder"
    >
      <template #actions>
        <DsButton icon="pi pi-shield" label="Nueva Política" variant="primary" @click="openModal()" />
      </template>
    </DsPageHeader>

    <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
       <div class="bg-surface-0 dark:bg-surface-800 rounded-3xl border border-surface-200 dark:border-white/5 shadow-sm p-6 overflow-y-auto">
          <h2 class="font-bold mb-4 text-xl">Políticas de Retención</h2>
          <p class="text-sm text-surface-500 mb-6">Define cuánto tiempo se conservan los documentos antes de archivarse.</p>
          
          <div class="space-y-4">
             <div class="p-4 border border-surface-200 dark:border-surface-700 rounded-xl bg-surface-50 dark:bg-surface-900 flex justify-between items-center">
                <div>
                  <h3 class="font-bold text-surface-900 dark:text-surface-100">Contratos Legales</h3>
                  <p class="text-xs text-surface-500">Mantener por 5 años después de expiración.</p>
                </div>
                <DsTag severity="success" value="Activa" />
             </div>
             
             <div class="p-4 border border-surface-200 dark:border-surface-700 rounded-xl bg-surface-50 dark:bg-surface-900 flex justify-between items-center">
                <div>
                  <h3 class="font-bold text-surface-900 dark:text-surface-100">Identificaciones (INE/Pasaporte)</h3>
                  <p class="text-xs text-surface-500">Forzar actualización cada 1 año.</p>
                </div>
                <DsTag severity="success" value="Activa" />
             </div>
          </div>
       </div>
       
       <div class="bg-surface-0 dark:bg-surface-800 rounded-3xl border border-surface-200 dark:border-white/5 shadow-sm p-6 overflow-y-auto">
          <h2 class="font-bold mb-4 text-xl">Auditoría de Accesos</h2>
          <p class="text-sm text-surface-500 mb-6">Monitorea quién visualiza documentos sensibles.</p>
          
          <div class="space-y-4">
             <div class="p-4 border border-surface-200 dark:border-surface-700 rounded-xl bg-surface-50 dark:bg-surface-900">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <i class="pi pi-eye text-sm"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-sm text-surface-900 dark:text-surface-100">Ana Lopez vio "INE_Representante.pdf"</h3>
                    <p class="text-xs text-surface-500">Hace 5 minutos · IP: 192.168.1.1</p>
                  </div>
                </div>
             </div>
             <div class="p-4 border border-surface-200 dark:border-surface-700 rounded-xl bg-surface-50 dark:bg-surface-900">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <i class="pi pi-download text-sm"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-sm text-surface-900 dark:text-surface-100">Juan Perez descargó "Contrato_2023.pdf"</h3>
                    <p class="text-xs text-surface-500">Hace 1 hora · IP: 192.168.1.5</p>
                  </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DsPageHeader from '../components/ui/DsPageHeader.vue';
import DsButton from '../components/ui/DsButton.vue';
import DsTag from '../components/ui/DsTag.vue';

const openModal = () => {
  alert('Funcionalidad de crear política pendiente (Mocked)');
};
</script>

