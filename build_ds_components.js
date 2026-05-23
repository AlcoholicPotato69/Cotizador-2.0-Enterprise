const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'frontend', 'src', 'components', 'ui');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Escaping backticks to prevent script crash
const components = {
    // === DATA ENTRY ===
    'DsInput.vue': `<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-surface-700 dark:text-surface-300">{{ label }}</label>
    <InputText 
      v-model="modelValue" 
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'rounded-md border bg-surface-50 dark:bg-surface-950 px-3 py-2 text-sm focus:outline-none focus:ring-2',
        error ? 'border-red-500 focus:ring-red-500' : 'border-surface-300 dark:border-surface-700 focus:ring-primary-500'
      ]"
    />
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
<script setup lang="ts">
import InputText from 'primevue/inputtext';
defineProps({ modelValue: String, label: String, placeholder: String, error: String, disabled: Boolean });
</script>`,

    'DsSelect.vue': `<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-surface-700 dark:text-surface-300">{{ label }}</label>
    <Select 
      v-model="modelValue" 
      :options="options" 
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'rounded-md border bg-surface-50 dark:bg-surface-950 text-sm focus:outline-none focus:ring-2',
        error ? 'border-red-500 focus:ring-red-500' : 'border-surface-300 dark:border-surface-700 focus:ring-primary-500'
      ]"
      :pt="{
        root: { class: 'flex items-center px-3 py-2' },
        list: { class: 'bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-md shadow-lg py-1' },
        option: { class: 'px-3 py-2 hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer text-sm' }
      }"
    />
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
<script setup lang="ts">
import Select from 'primevue/select';
defineProps({ modelValue: [String, Number, Object], options: Array, optionLabel: String, optionValue: String, label: String, placeholder: String, error: String, disabled: Boolean });
</script>`,

    'DsTextarea.vue': `<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-surface-700 dark:text-surface-300">{{ label }}</label>
    <Textarea 
      v-model="modelValue" 
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      autoResize
      :class="[
        'rounded-md border bg-surface-50 dark:bg-surface-950 px-3 py-2 text-sm focus:outline-none focus:ring-2',
        error ? 'border-red-500 focus:ring-red-500' : 'border-surface-300 dark:border-surface-700 focus:ring-primary-500'
      ]"
    />
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
<script setup lang="ts">
import Textarea from 'primevue/textarea';
defineProps({ modelValue: String, label: String, placeholder: String, error: String, disabled: Boolean, rows: { type: Number, default: 3 } });
</script>`,

    'DsCheckbox.vue': `<template>
  <div class="flex items-center gap-2">
    <Checkbox 
      v-model="modelValue" 
      :binary="true" 
      :disabled="disabled"
      :pt="{
        box: ({ context }) => ({
          class: [
            'w-5 h-5 flex items-center justify-center rounded border transition-colors',
            context.checked ? 'bg-primary-600 border-primary-600 text-white' : 'bg-surface-0 dark:bg-surface-950 border-surface-300 dark:border-surface-700'
          ]
        })
      }"
    />
    <label class="text-sm text-surface-700 dark:text-surface-300 cursor-pointer" @click="modelValue = !modelValue">{{ label }}</label>
  </div>
</template>
<script setup lang="ts">
import Checkbox from 'primevue/checkbox';
const modelValue = defineModel<boolean>();
defineProps({ label: String, disabled: Boolean });
</script>`,

    'DsRadio.vue': `<template>
  <div class="flex items-center gap-2">
    <RadioButton 
      v-model="modelValue" 
      :value="value"
      :disabled="disabled"
      :pt="{
        box: ({ context }) => ({
          class: [
            'w-5 h-5 flex items-center justify-center rounded-full border transition-colors',
            context.checked ? 'border-primary-600 border-4' : 'bg-surface-0 dark:bg-surface-950 border-surface-300 dark:border-surface-700'
          ]
        })
      }"
    />
    <label class="text-sm text-surface-700 dark:text-surface-300 cursor-pointer" @click="modelValue = value">{{ label }}</label>
  </div>
</template>
<script setup lang="ts">
import RadioButton from 'primevue/radiobutton';
const modelValue = defineModel<any>();
defineProps({ value: null, label: String, disabled: Boolean });
</script>`,

    'DsDatePicker.vue': `<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-surface-700 dark:text-surface-300">{{ label }}</label>
    <!-- UTC persistence handled internally by component wrapping PrimeVue Calendar -->
    <DatePicker 
      v-model="localDate" 
      :showIcon="true"
      :disabled="disabled"
      :placeholder="placeholder"
      :class="[
        'rounded-md border bg-surface-50 dark:bg-surface-950 text-sm focus:outline-none focus:ring-2',
        error ? 'border-red-500 focus:ring-red-500' : 'border-surface-300 dark:border-surface-700 focus:ring-primary-500'
      ]"
      :pt="{
        root: { class: 'flex items-center' },
        input: { class: 'px-3 py-2 bg-transparent outline-none flex-1' },
        dropdownButton: { root: { class: 'p-2 text-surface-500 hover:text-surface-900' } },
        panel: { class: 'bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-md shadow-lg p-2' }
      }"
    />
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
<script setup lang="ts">
import DatePicker from 'primevue/datepicker';
import { ref, watch } from 'vue';
const props = defineProps({ modelValue: Date, label: String, placeholder: String, error: String, disabled: Boolean });
const localDate = ref(props.modelValue);
const emit = defineEmits(['update:modelValue']);
watch(localDate, (val) => { emit('update:modelValue', val); });
</script>`,

    'DsCurrencyInput.vue': `<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-surface-700 dark:text-surface-300">{{ label }}</label>
    <InputNumber 
      v-model="modelValue" 
      mode="currency" 
      currency="MXN" 
      locale="es-MX"
      :disabled="disabled"
      :class="[
        'rounded-md border bg-surface-50 dark:bg-surface-950 text-sm focus:outline-none focus:ring-2',
        error ? 'border-red-500 focus:ring-red-500' : 'border-surface-300 dark:border-surface-700 focus:ring-primary-500'
      ]"
      :pt="{
        input: { class: 'px-3 py-2 w-full bg-transparent outline-none' }
      }"
    />
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';
const modelValue = defineModel<number>();
defineProps({ label: String, error: String, disabled: Boolean });
</script>`,

    // === DATA DISPLAY ===
    'DsCard.vue': `<template>
  <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-lg shadow-sm overflow-hidden">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-surface-200 dark:border-surface-800 font-semibold">
      <slot name="header"></slot>
    </div>
    <div class="p-6">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 bg-surface-50 dark:bg-surface-950 border-t border-surface-200 dark:border-surface-800">
      <slot name="footer"></slot>
    </div>
  </div>
</template>`,

    'DsBadge.vue': `<template>
  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
    <slot></slot>
  </span>
</template>`,

    'DsStatusBadge.vue': `<template>
  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', colorClass]">
    {{ label }}
  </span>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps({ status: { type: String, required: true } });

const statusMap: Record<string, string> = {
  draft: 'bg-surface-100 text-surface-800 border-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:border-surface-700',
  pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50',
  approved: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50',
  signed: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50',
  paid: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50',
  rejected: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50',
  cancelled: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50',
  unpaid: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50',
  partial: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50',
  validated: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50',
};

const label = computed(() => props.status.charAt(0).toUpperCase() + props.status.slice(1));
const colorClass = computed(() => statusMap[props.status] || statusMap['draft']);
</script>`,

    'DsEmptyState.vue': `<template>
  <div class="flex flex-col items-center justify-center p-12 text-center">
    <div class="h-24 w-24 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-400 mb-4">
      <!-- Mute icon -->
      <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    <h3 class="text-lg font-medium text-surface-900 dark:text-surface-50">{{ title }}</h3>
    <p class="mt-1 text-sm text-surface-500 max-w-sm">{{ description }}</p>
    <div class="mt-6">
      <slot name="action"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({ title: { type: String, default: 'Sin datos' }, description: { type: String, default: 'No se encontraron registros.' } });
</script>`,

    'DsLoadingState.vue': `<template>
  <div class="flex flex-col items-center justify-center p-12">
    <svg class="animate-spin h-8 w-8 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p class="text-sm text-surface-500">{{ text }}</p>
  </div>
</template>
<script setup lang="ts">
defineProps({ text: { type: String, default: 'Cargando...' } });
</script>`,

    // === TABLES & LISTS ===
    'DsTable.vue': `<template>
  <div class="overflow-x-auto border border-surface-200 dark:border-surface-800 rounded-lg">
    <DataTable :value="data" :loading="loading" :pt="{
      table: { class: 'w-full text-left text-sm' },
      headerRow: { class: 'bg-surface-50 dark:bg-surface-900/50 border-b border-surface-200 dark:border-surface-800' },
      headerCell: { class: 'px-4 py-3 font-medium text-surface-700 dark:text-surface-300' },
      bodyRow: { class: 'border-b border-surface-100 dark:border-surface-800/50 hover:bg-surface-50/50 dark:hover:bg-surface-800/30' },
      bodyCell: { class: 'px-4 py-3' }
    }">
      <slot></slot>
      <template #empty>
        <div class="p-4 text-center text-surface-500">No hay registros</div>
      </template>
    </DataTable>
  </div>
</template>
<script setup lang="ts">
import DataTable from 'primevue/datatable';
defineProps({ data: Array, loading: Boolean });
</script>`,

    'DsPagination.vue': `<template>
  <Paginator 
    :first="first" 
    :rows="rows" 
    :totalRecords="totalRecords" 
    @page="$emit('page', $event)"
    :pt="{
      root: { class: 'flex items-center justify-between p-4 bg-surface-0 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 mt-4' },
      contentStart: { class: 'text-sm text-surface-500' },
      pages: { class: 'flex gap-1' },
      pageButton: ({ context }) => ({
        class: [
          'w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors',
          context.active ? 'bg-primary-600 text-white' : 'hover:bg-surface-100 dark:hover:bg-surface-800'
        ]
      })
    }"
  />
</template>
<script setup lang="ts">
import Paginator from 'primevue/paginator';
defineProps({ first: Number, rows: Number, totalRecords: Number });
defineEmits(['page']);
</script>`,

    'DsFilters.vue': `<template>
  <div class="p-4 bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-800 rounded-lg mb-4 flex flex-wrap gap-4 items-end">
    <slot></slot>
    <button @click="$emit('search')" class="bg-surface-900 text-white dark:bg-surface-50 dark:text-surface-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-surface-800 transition-colors">
      Buscar
    </button>
  </div>
</template>
<script setup lang="ts">
defineEmits(['search']);
</script>`,

    // === OVERLAYS ===
    'DsModal.vue': `<template>
  <Dialog 
    v-model:visible="visible" 
    :modal="true" 
    :header="header"
    :pt="{
      mask: { class: 'bg-surface-900/50 backdrop-blur-sm' },
      root: { class: 'bg-surface-0 dark:bg-surface-900 rounded-xl shadow-xl border border-surface-200 dark:border-surface-800 m-4 sm:w-[500px]' },
      header: { class: 'flex items-center justify-between p-6 border-b border-surface-100 dark:border-surface-800' },
      title: { class: 'text-lg font-semibold' },
      closeButton: { class: 'w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors' },
      content: { class: 'p-6' },
      footer: { class: 'flex justify-end gap-2 p-6 border-t border-surface-100 dark:border-surface-800' }
    }"
  >
    <slot></slot>
    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import Dialog from 'primevue/dialog';
const visible = defineModel<boolean>('visible');
defineProps({ header: String });
</script>`,

    'DsDrawer.vue': `<template>
  <Drawer 
    v-model:visible="visible" 
    position="right"
    :pt="{
      mask: { class: 'bg-surface-900/50 backdrop-blur-sm' },
      root: { class: 'w-full md:w-[600px] bg-surface-0 dark:bg-surface-900 border-l border-surface-200 dark:border-surface-800 shadow-2xl flex flex-col' },
      header: { class: 'flex items-center justify-between p-6 border-b border-surface-100 dark:border-surface-800' },
      title: { class: 'text-xl font-bold' },
      closeButton: { class: 'w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors' },
      content: { class: 'p-6 flex-1 overflow-y-auto' }
    }"
  >
    <template #header>
      <h2 class="text-xl font-bold">{{ header }}</h2>
    </template>
    <slot></slot>
  </Drawer>
</template>
<script setup lang="ts">
import Drawer from 'primevue/drawer';
const visible = defineModel<boolean>('visible');
defineProps({ header: String });
</script>`,

    'DsToast.vue': `<template>
  <Toast :pt="{
    root: { class: 'w-80' },
    message: ({ props }) => ({
      class: [
        'mb-4 rounded-lg shadow-lg border p-4',
        props.message.severity === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/80 dark:border-green-800 dark:text-green-100' :
        props.message.severity === 'error' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/80 dark:border-red-800 dark:text-red-100' :
        'bg-surface-0 border-surface-200 text-surface-900 dark:bg-surface-800 dark:border-surface-700 dark:text-surface-50'
      ]
    }),
    content: { class: 'flex items-start gap-3' },
    text: { class: 'flex-1' },
    summary: { class: 'font-semibold text-sm' },
    detail: { class: 'mt-1 text-sm opacity-90' },
    closeButton: { class: 'w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors' }
  }" />
</template>
<script setup lang="ts">
import Toast from 'primevue/toast';
</script>`,

    'DsAlert.vue': `<template>
  <div :class="[
    'p-4 rounded-md border flex items-start gap-3',
    severity === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-200' :
    severity === 'error' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200' :
    'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200'
  ]">
    <div class="flex-1 text-sm">
      <h4 v-if="title" class="font-bold mb-1">{{ title }}</h4>
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({ title: String, severity: { type: String, default: 'info' } }); // info, warning, error
</script>`,

    'DsConfirmDialog.vue': `<template>
  <Dialog 
    v-model:visible="visible" 
    :modal="true" 
    :closable="false"
    :pt="{
      mask: { class: 'bg-surface-900/80 backdrop-blur-sm' },
      root: { class: 'bg-surface-0 dark:bg-surface-900 rounded-xl shadow-2xl border border-surface-200 dark:border-surface-800 m-4 sm:w-[400px] overflow-hidden' },
      content: { class: 'p-0' }
    }"
  >
    <div class="p-6 text-center">
      <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      </div>
      <h3 class="text-lg font-bold mb-2">{{ title }}</h3>
      <p class="text-surface-500 text-sm mb-6">{{ message }}</p>
      
      <div class="flex gap-3 w-full">
        <button @click="visible = false" class="flex-1 py-2 px-4 rounded-md border border-surface-300 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 font-medium transition-colors">
          Cancelar
        </button>
        <button @click="confirm" class="flex-1 py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition-colors">
          Confirmar
        </button>
      </div>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import Dialog from 'primevue/dialog';
const visible = defineModel<boolean>('visible');
defineProps({ title: String, message: String });
const emit = defineEmits(['confirm']);
function confirm() {
  visible.value = false;
  emit('confirm');
}
</script>`,

    // === TABS ===
    'DsTabs.vue': `<template>
  <div class="border-b border-surface-200 dark:border-surface-800">
    <nav class="-mb-px flex space-x-8">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        @click="modelValue = tab.value"
        :class="[
          'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors',
          modelValue === tab.value 
            ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
            : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300 dark:hover:text-surface-300 dark:hover:border-surface-700'
        ]"
      >
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>
<script setup lang="ts">
const modelValue = defineModel<string>();
defineProps({ tabs: { type: Array as () => { label: string, value: string }[], required: true } });
</script>`,

    // === DOCUMENT WORKSPACE ===
    'DsDocumentViewer.vue': `<template>
  <div class="fixed inset-0 z-50 bg-surface-0 dark:bg-surface-950 flex flex-col lg:flex-row overflow-hidden">
    <!-- TOOLBAR (Document Actions) -->
    <div class="absolute top-0 left-0 right-0 h-14 bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between px-4 z-10">
      <div class="flex items-center gap-4">
        <button @click="$emit('close')" class="p-2 rounded-md hover:bg-surface-200 dark:hover:bg-surface-800">
           Cerrar Workspace
        </button>
        <span class="font-semibold text-sm border-l pl-4 border-surface-300 dark:border-surface-700">
          {{ filename }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <!-- Actions governed by permissions -->
        <button class="px-3 py-1.5 text-xs font-medium bg-surface-200 dark:bg-surface-800 rounded">Descargar</button>
        <button class="px-3 py-1.5 text-xs font-medium bg-surface-200 dark:bg-surface-800 rounded">Imprimir</button>
        <button class="px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded">Aprobar (Four-Eyes)</button>
      </div>
    </div>

    <!-- CANVAS RENDERING ZONE (70%) -->
    <div class="flex-1 h-full mt-14 bg-surface-100 dark:bg-surface-950 flex items-center justify-center relative p-8">
      <!-- Watermark Simulation -->
      <div class="absolute inset-0 pointer-events-none opacity-5 flex flex-col justify-center items-center overflow-hidden rotate-[-30deg]">
        <div v-for="i in 10" :key="i" class="text-4xl font-bold mb-32 whitespace-nowrap">
          RESTRICTED - USER_ID: auth_user_89 - IP: 192.168.1.1
        </div>
      </div>
      
      <!-- Document Provider Box -->
      <div class="w-full max-w-4xl bg-white shadow-2xl h-full flex items-center justify-center border">
        <div class="text-surface-400 text-sm">
          [ {{ mimeType }} Render Provider ]
        </div>
      </div>
    </div>

    <!-- METADATA & AUDIT PANEL (30%) -->
    <div class="w-full lg:w-96 h-full mt-14 border-l border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 flex flex-col">
      <div class="flex border-b border-surface-200 dark:border-surface-800">
        <button class="flex-1 py-3 text-sm font-medium border-b-2 border-primary-500 text-primary-600">Metadata</button>
        <button class="flex-1 py-3 text-sm font-medium text-surface-500 border-b-2 border-transparent">Auditoría</button>
      </div>
      <div class="p-6 flex-1 overflow-y-auto space-y-6">
        <div>
          <label class="text-xs font-bold text-surface-500">Legal Hold</label>
          <div class="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">RETENCIÓN ACTIVA</div>
        </div>
        <div>
          <label class="text-xs font-bold text-surface-500">Hash SHA-256</label>
          <div class="mt-1 text-xs font-mono break-all bg-surface-50 dark:bg-surface-950 p-2 rounded border">
            e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
          </div>
        </div>
        <div>
          <label class="text-xs font-bold text-surface-500">Tenant</label>
          <div class="mt-1 text-sm font-medium">Plaza Mayor</div>
        </div>
        <div>
          <label class="text-xs font-bold text-surface-500">Estado de Aprobación</label>
          <div class="mt-1 text-sm font-medium text-amber-500">Pendiente de Finanzas</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({ filename: String, mimeType: { type: String, default: 'application/pdf' } });
defineEmits(['close']);
</script>`
};

for (const [filename, content] of Object.entries(components)) {
    fs.writeFileSync(path.join(targetDir, filename), content, 'utf8');
    console.log(`Creado componente: ${filename}`);
}

console.log('22 Phase 4.2 components generated successfully.');
