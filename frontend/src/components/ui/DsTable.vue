<template>
  <div class="overflow-x-auto border border-surface-200 dark:border-surface-800 rounded-lg">
    <DataTable v-bind="$attrs" :value="data || value" :loading="loading" :pt="{
      table: { class: 'w-full text-left text-sm' },
      headerRow: { class: 'bg-surface-50 dark:bg-surface-900/50 border-b border-surface-200 dark:border-surface-800' },
      headerCell: { class: 'px-4 py-3 font-medium text-surface-700 dark:text-surface-300' },
      bodyRow: { class: 'border-b border-surface-100 dark:border-surface-800/50 hover:bg-surface-50/50 dark:hover:bg-surface-800/30' },
      bodyCell: { class: 'px-4 py-3' },
      paginator: {
        root: { class: 'flex flex-wrap items-center justify-end p-4 gap-2 border-t border-surface-200 dark:border-surface-800 text-sm' },
        firstPageButton: { class: 'p-1.5 flex items-center justify-center rounded-md hover:bg-surface-200 dark:hover:bg-surface-700 min-w-[2rem] h-8 text-surface-600 dark:text-surface-300 transition-colors' },
        previousPageButton: { class: 'p-1.5 flex items-center justify-center rounded-md hover:bg-surface-200 dark:hover:bg-surface-700 min-w-[2rem] h-8 text-surface-600 dark:text-surface-300 transition-colors' },
        nextPageButton: { class: 'p-1.5 flex items-center justify-center rounded-md hover:bg-surface-200 dark:hover:bg-surface-700 min-w-[2rem] h-8 text-surface-600 dark:text-surface-300 transition-colors' },
        lastPageButton: { class: 'p-1.5 flex items-center justify-center rounded-md hover:bg-surface-200 dark:hover:bg-surface-700 min-w-[2rem] h-8 text-surface-600 dark:text-surface-300 transition-colors' },
        pages: { class: 'flex gap-1 items-center' },
        pageButton: ({ context }: { context: { active: boolean } }) => ({
          class: [
            'p-1.5 flex items-center justify-center rounded-md min-w-[2rem] h-8 cursor-pointer transition-colors',
            context.active ? 'bg-primary-500 text-white font-bold' : 'hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300'
          ]
        }),
        rowsPerPageDropdown: { root: { class: 'ml-4 p-1.5 rounded-md border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 focus:ring-2 focus:ring-primary-500' } }
      }
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
defineProps({ data: Array, value: Array, loading: Boolean });
</script>

