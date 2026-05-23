<template>
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
</script>