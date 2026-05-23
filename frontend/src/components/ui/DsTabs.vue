<template>
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
</script>