<template>
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
</script>