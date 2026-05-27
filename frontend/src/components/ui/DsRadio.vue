<template>
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
</script>

