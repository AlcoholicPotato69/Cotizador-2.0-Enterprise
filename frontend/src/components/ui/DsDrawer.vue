<template>
  <Drawer 
    v-model:visible="visible" 
    position="right"
    :pt="{
      mask: { class: 'bg-surface-900/50 backdrop-blur-sm' },
      root: { class: 'w-full md:w-[600px] bg-surface-0 dark:bg-surface-900 border-l border-surface-200 dark:border-surface-800 shadow-2xl flex flex-col' },
      header: { class: 'flex items-center justify-between p-6 border-b border-surface-100 dark:border-surface-800' },
      title: { class: 'text-xl font-bold' },
      closeButton: { class: 'w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors' },
      content: { class: 'p-6 flex-1 overflow-y-auto' }
    }"
  >
    <template #header>
      <h2 class="text-xl font-bold">{{ header }}</h2>
    </template>
    <slot></slot>
  </Drawer>
</template>
<script setup lang="ts">
import Drawer from 'primevue/drawer';
const visible = defineModel<boolean>('visible');
defineProps({ header: String });
</script>

