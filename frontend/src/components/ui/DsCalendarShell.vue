<template>
  <div class="h-full flex flex-col bg-surface-0 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between bg-surface-50 dark:bg-surface-900/50">
      <div class="flex items-center gap-4">
        <h2 class="text-lg font-bold">{{ currentMonth }} {{ currentYear }}</h2>
        <div class="flex bg-surface-0 dark:bg-surface-900 rounded-md shadow-sm border border-surface-200 dark:border-surface-700">
          <button class="px-3 py-1 text-sm font-medium border-r border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800">Hoy</button>
          <button class="px-2 py-1 hover:bg-surface-50 dark:hover:bg-surface-800"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
          <button class="px-2 py-1 hover:bg-surface-50 dark:hover:bg-surface-800"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
        </div>
      </div>
      <div>
        <!-- View Toggle (Month, Week, Day) -->
        <select class="text-sm rounded border-surface-300 dark:border-surface-700 bg-surface-0 dark:bg-surface-950 py-1 pl-2 pr-8 focus:ring-primary-500">
          <option>Mes</option>
          <option>Semana</option>
          <option>Día</option>
        </select>
      </div>
    </div>
    
    <!-- Grid Lienzo agnóstico -->
    <div class="flex-1 overflow-auto bg-surface-100 dark:bg-surface-950 p-4">
      <div class="min-h-full border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 rounded shadow-sm">
         <!-- El slot recibe los EventBlocks inyectados por el Backend -->
         <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({ currentMonth: String, currentYear: Number });
</script>