<template>
  <div class="p-4 bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-800 rounded-lg mb-4 flex flex-wrap gap-4 items-end">
    <slot></slot>
    <button @click="$emit('search')" class="bg-surface-900 text-surface-0 dark:text-surface-900 dark:bg-surface-50 dark:text-surface-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-surface-800 transition-colors">
      Buscar
    </button>
  </div>
</template>
<script setup lang="ts">
defineEmits(['search']);
</script>

