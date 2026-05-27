<template>
  <div class="h-full flex flex-col space-y-6">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-display font-bold text-surface-900 dark:text-surface-0 tracking-tight">Recibos de Pago</h1>
        <p class="text-sm text-surface-500 mt-1 font-body">Control de ingresos y pagos fraccionados.</p>
      </div>
      <div class="flex items-center gap-3">
        <DsButton icon="pi pi-plus" label="Registrar Pago" class="bg-primary-600 hover:bg-primary-500 text-surface-0 border-none px-4 py-2 font-medium text-sm rounded-md" />
      </div>
    </header>
    <div class="flex-1 bg-surface-0 dark:bg-surface-800 rounded-3xl border border-surface-200 dark:border-white/5 shadow-sm p-6 overflow-hidden flex flex-col">
       <div class="flex-1 flex items-center justify-center text-surface-400">
         <div class="text-center">
            <i class="pi pi-receipt text-4xl mb-4"></i>
            <p>Listado de recibos emitidos...</p>
         </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

