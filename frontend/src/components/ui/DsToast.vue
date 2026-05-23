<template>
  <Toast :pt="{
    root: { class: 'w-80' },
    message: ({ props }: { props: any }) => ({
      class: [
        'mb-4 rounded-lg shadow-lg border p-4',
        props?.message?.severity === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/80 dark:border-green-800 dark:text-green-100' :
        props?.message?.severity === 'error' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/80 dark:border-red-800 dark:text-red-100' :
        'bg-surface-0 border-surface-200 text-surface-900 dark:bg-surface-800 dark:border-surface-700 dark:text-surface-50'
      ]
    }),
    content: { class: 'flex items-start gap-3' },
    text: { class: 'flex-1' },
    summary: { class: 'font-semibold text-sm' },
    detail: { class: 'mt-1 text-sm opacity-90' },
    closeButton: { class: 'w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors' }
  }" />
</template>
<script setup lang="ts">
import Toast from 'primevue/toast';
</script>