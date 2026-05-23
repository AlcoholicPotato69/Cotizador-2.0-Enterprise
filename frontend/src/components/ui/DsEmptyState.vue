<template>
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
</script>