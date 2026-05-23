<template>
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
</script>