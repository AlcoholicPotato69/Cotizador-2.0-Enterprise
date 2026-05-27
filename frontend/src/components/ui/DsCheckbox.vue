<template>
  <div class="flex items-center gap-2">
    <Checkbox 
      v-model="modelValue" 
      :binary="true" 
      :disabled="disabled"
      :pt="{
        box: ({ context }) => ({
          class: [
            'w-5 h-5 flex items-center justify-center rounded border transition-colors',
            context.checked ? 'bg-primary-600 border-primary-600 text-surface-0 dark:text-surface-900' : 'bg-surface-0 dark:bg-surface-950 border-surface-300 dark:border-surface-700'
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
</script>

