<template>
  <div class="space-y-10 pb-20">
    <div>
      <h1 class="text-3xl font-bold tracking-tight mb-2">Design Playground (Fase 4.2)</h1>
      <p class="text-surface-500">Catálogo oficial de Componentes Enterprise estabilizados.</p>
    </div>

    <!-- Tenant & Theme Controls -->
    <section class="p-6 rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 shadow-sm flex flex-wrap gap-4">
      <DsButton @click="themeStore.toggleMode()" variant="outline">
        Toggle Mode ({{ themeStore.mode }})
      </DsButton>
      <DsButton @click="toggleTenant" variant="outline">
        Switch Tenant ({{ tenantStore.activeTenant?.id === 'pm' ? 'Plaza Mayor' : 'Casa de Piedra' }})
      </DsButton>
    </section>

    <!-- Data Entry -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold border-b pb-2">1. Data Entry</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-lg bg-surface-0 border">
        <DsInput label="DsInput (Standard)" placeholder="Escribe algo..." />
        <DsInput label="DsInput (Error)" placeholder="Escribe algo..." error="Este campo es obligatorio" />
        <DsSelect label="DsSelect" :options="['Opción 1', 'Opción 2']" placeholder="Seleccione..." />
        <DsCurrencyInput label="DsCurrencyInput (MXN)" />
        <DsDatePicker label="DsDatePicker (Timezone Aware)" placeholder="Selecciona una fecha" />
        <div class="flex flex-col gap-2 justify-center">
          <DsCheckbox label="DsCheckbox Activo" :modelValue="true" />
          <DsRadio label="DsRadio" value="1" />
        </div>
      </div>
    </section>

    <!-- Data Display & Status -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold border-b pb-2">2. Data Display & Status</h2>
      <div class="flex flex-wrap gap-4 p-6 rounded-lg bg-surface-0 border">
        <DsStatusBadge status="draft" />
        <DsStatusBadge status="pending" />
        <DsStatusBadge status="approved" />
        <DsStatusBadge status="rejected" />
        <DsStatusBadge status="paid" />
        <DsStatusBadge status="validated" />
        <DsBadge>Notificación 14</DsBadge>
      </div>
      <DsCard>
        <template #header>DsCard Header</template>
        Contenido de la tarjeta de información.
      </DsCard>
      <div class="grid grid-cols-2 gap-4">
        <DsEmptyState class="border bg-surface-0" />
        <DsLoadingState class="border bg-surface-0" text="Sincronizando con PocketBase..." />
      </div>
    </section>

    <!-- Overlays & Feedback -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold border-b pb-2">3. Overlays & Feedback</h2>
      <div class="flex flex-wrap gap-4 p-6 rounded-lg bg-surface-0 border">
        <DsButton @click="showConfirm = true" variant="danger">Probar DsConfirmDialog</DsButton>
        <DsButton @click="showWorkspace = true" variant="primary">Lanzar DsDocumentViewer</DsButton>
      </div>
      <div class="space-y-2 mt-4">
        <DsAlert severity="info" title="DsAlert Info">Información del sistema operativo.</DsAlert>
        <DsAlert severity="warning" title="DsAlert Warning">Atención requerida.</DsAlert>
        <DsAlert severity="error" title="DsAlert Error">Fallo al contactar SAT.</DsAlert>
      </div>
    </section>

    <!-- Teleport Overlays -->
    <DsConfirmDialog 
      v-model:visible="showConfirm" 
      title="Eliminar Contrato" 
      message="Esta acción es irreversible y generará un registro de auditoría. ¿Estás seguro?" 
    />
    <DsDocumentViewer 
      v-if="showWorkspace" 
      @close="showWorkspace = false" 
      filename="CONTRATO_MAESTRO_001.pdf" 
    />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useThemeStore } from '../stores/themeStore';
import { useTenantStore } from '../stores/tenantStore';

import DsButton from '../components/ui/DsButton.vue';
import DsInput from '../components/ui/DsInput.vue';
import DsSelect from '../components/ui/DsSelect.vue';
import DsCurrencyInput from '../components/ui/DsCurrencyInput.vue';
import DsDatePicker from '../components/ui/DsDatePicker.vue';
import DsCheckbox from '../components/ui/DsCheckbox.vue';
import DsRadio from '../components/ui/DsRadio.vue';
import DsStatusBadge from '../components/ui/DsStatusBadge.vue';
import DsBadge from '../components/ui/DsBadge.vue';
import DsCard from '../components/ui/DsCard.vue';
import DsEmptyState from '../components/ui/DsEmptyState.vue';
import DsLoadingState from '../components/ui/DsLoadingState.vue';
import DsAlert from '../components/ui/DsAlert.vue';
import DsConfirmDialog from '../components/ui/DsConfirmDialog.vue';
import DsDocumentViewer from '../components/ui/DsDocumentViewer.vue';

const themeStore = useThemeStore();
const tenantStore = useTenantStore();

const showConfirm = ref(false);
const showWorkspace = ref(false);

function toggleTenant() {
  // Tenant switching disabled in secure mode.
}
</script>
