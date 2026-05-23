<template>
  <div class="flex flex-col sm:flex-row gap-3 items-center w-full bg-surface-0 dark:bg-surface-900 p-3 rounded-lg border border-surface-200 dark:border-surface-800">
    <div class="relative flex-1 w-full">
      <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </span>
      <input 
        v-model="query" 
        type="text" 
        :placeholder="placeholder"
        class="block w-full pl-10 pr-3 py-2 border border-surface-300 dark:border-surface-700 rounded-md leading-5 bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm transition-colors"
        @keyup.enter="$emit('search', query)"
      />
    </div>
    <div class="flex items-center gap-2 w-full sm:w-auto">
      <slot name="filters"></slot>
      <button v-if="query" @click="clear" class="text-xs text-surface-500 hover:text-surface-700">Limpiar</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({ placeholder: { type: String, default: 'Buscar...' } });
const emit = defineEmits(['search', 'clear']);
const query = ref('');
function clear() { query.value = ''; emit('clear'); }
</script>