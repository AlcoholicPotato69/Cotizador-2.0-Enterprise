<template>
  <Dialog 
    v-model:visible="visible" 
    :modal="true" 
    :header="header"
    :pt="{
      mask: { class: 'bg-surface-900/50 backdrop-blur-sm' },
      root: { class: 'bg-surface-0 dark:bg-surface-900 rounded-xl shadow-xl border border-surface-200 dark:border-surface-800 m-4 sm:w-[500px]' },
      header: { class: 'flex items-center justify-between p-6 border-b border-surface-100 dark:border-surface-800' },
      title: { class: 'text-lg font-semibold' },
      closeButton: { class: 'w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors' },
      content: { class: 'p-6' },
      footer: { class: 'flex justify-end gap-2 p-6 border-t border-surface-100 dark:border-surface-800' }
    }"
  >
    <slot></slot>
    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import Dialog from 'primevue/dialog';
const visible = defineModel<boolean>('visible');
defineProps({ header: String });
</script>