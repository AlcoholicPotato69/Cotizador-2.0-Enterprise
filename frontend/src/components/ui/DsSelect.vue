<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-surface-700 dark:text-surface-300">{{ label }}</label>
    <Select 
      v-model="model" 
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
defineProps({ options: Array, optionLabel: String, optionValue: String, label: String, placeholder: String, error: String, disabled: Boolean });
const model = defineModel<any>();
</script>

