<template>
  <Paginator 
    :first="first" 
    :rows="rows" 
    :totalRecords="totalRecords" 
    @page="$emit('page', $event)"
    :pt="{
      root: { class: 'flex items-center justify-between p-4 bg-surface-0 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 mt-4' },
      contentStart: { class: 'text-sm text-surface-500' },
      pages: { class: 'flex gap-1' },
      pageButton: ({ context }: { context: { active: boolean } }) => ({
        class: [
          'w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors',
          context.active ? 'bg-primary-600 text-surface-0 dark:text-surface-900' : 'hover:bg-surface-100 dark:hover:bg-surface-800'
        ]
      })
    }"
  />
</template>
<script setup lang="ts">
import Paginator from 'primevue/paginator';
defineProps({ first: Number, rows: Number, totalRecords: Number });
defineEmits(['page']);
</script>

