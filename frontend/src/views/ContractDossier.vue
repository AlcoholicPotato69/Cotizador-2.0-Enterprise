<template>
  <div class="h-full p-4 md:p-8 max-w-[1600px] mx-auto animate-fade-in flex flex-col">
    <!-- Header Minimalista -->
    <div class="flex items-center gap-4 mb-6">
      <DsButton icon="pi pi-arrow-left" class="p-button-rounded p-button-text p-button-secondary w-10 h-10 p-0" @click="router.back()" aria-label="Volver" />
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0 m-0 tracking-tight">Expediente 360 (Contrato)</h1>
        <p class="text-sm text-surface-500 m-0 mt-1">Trazabilidad desde la perspectiva del Contrato Legal.</p>
      </div>
    </div>

    <!-- Dossier Engine Core -->
    <div class="flex-1 min-h-[600px]">
      <BaseDossierViewer entityType="contract" :entityId="contractId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseDossierViewer from '../components/ui/BaseDossierViewer.vue';
import DsButton from '../components/ui/DsButton.vue';

const route = useRoute();
const router = useRouter();
const contractId = ref('');

onMounted(() => {
  contractId.value = route.params.id as string || '';
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

