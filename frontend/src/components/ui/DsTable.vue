<template>
  <div class="overflow-x-auto border border-surface-200 dark:border-surface-800 rounded-lg">
    <DataTable :value="data" :loading="loading" :pt="{
      table: { class: 'w-full text-left text-sm' },
      headerRow: { class: 'bg-surface-50 dark:bg-surface-900/50 border-b border-surface-200 dark:border-surface-800' },
      headerCell: { class: 'px-4 py-3 font-medium text-surface-700 dark:text-surface-300' },
      bodyRow: { class: 'border-b border-surface-100 dark:border-surface-800/50 hover:bg-surface-50/50 dark:hover:bg-surface-800/30' },
      bodyCell: { class: 'px-4 py-3' }
    }">
      <slot></slot>
      <template #empty>
        <div class="p-4 text-center text-surface-500">No hay registros</div>
      </template>
    </DataTable>
  </div>
</template>
<script setup lang="ts">
import DataTable from 'primevue/datatable';
defineProps({ data: Array, loading: Boolean });
</script>