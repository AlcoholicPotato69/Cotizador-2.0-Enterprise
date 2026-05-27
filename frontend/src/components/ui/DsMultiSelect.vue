<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-surface-700 dark:text-surface-300">{{ label }}</label>
    <MultiSelect 
      v-bind="$attrs"
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
    />
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
<script setup lang="ts">
import MultiSelect from 'primevue/multiselect';
defineOptions({ inheritAttrs: false });
defineProps({ options: Array, optionLabel: String, optionValue: String, label: String, placeholder: String, error: String, disabled: Boolean });
const model = defineModel<any>();
</script>
