<template>
  <div class="relative inline-block text-left">
    <DsButton variant="outline" size="sm" @click="isOpen = !isOpen">
      <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      Columnas
    </DsButton>
    
    <div v-if="isOpen" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-surface-0 dark:bg-surface-900 ring-1 ring-black ring-opacity-5 border border-surface-200 dark:border-surface-800 z-50">
      <div class="py-1 px-3 max-h-60 overflow-auto">
        <label v-for="col in columns" :key="col.field" class="flex items-center space-x-3 py-2 cursor-pointer text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 rounded px-2">
          <input type="checkbox" v-model="col.visible" class="rounded border-surface-300 text-primary-600 focus:ring-primary-500 h-4 w-4" />
          <span>{{ col.header }}</span>
        </label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DsButton from './DsButton.vue';
const isOpen = ref(false);
defineProps({ columns: { type: Array as () => { field: string, header: string, visible: boolean }[], required: true } });
</script>