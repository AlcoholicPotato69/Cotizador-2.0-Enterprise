<template>
  <div class="h-full flex flex-col space-y-6">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-display font-bold text-surface-900 dark:text-surface-0 tracking-tight">Creador de Cotización</h1>
        <p class="text-sm text-surface-500 mt-1 font-body">Genera una nueva propuesta comercial paso a paso.</p>
      </div>
      <div class="flex items-center gap-3">
        <DsButton icon="pi pi-save" label="Guardar Borrador" class="bg-surface-200 text-surface-800 border-none px-4 py-2 font-medium text-sm rounded-md" />
        <DsButton icon="pi pi-check" label="Finalizar" class="bg-primary-600 hover:bg-primary-500 text-surface-0 border-none px-4 py-2 font-medium text-sm rounded-md" />
      </div>
    </header>
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
       <div class="lg:col-span-4 bg-surface-0 dark:bg-surface-800 rounded-3xl border border-surface-200 dark:border-white/5 shadow-sm p-6 overflow-y-auto">
          <h2 class="font-bold mb-4">Catálogo</h2>
          <p class="text-sm text-surface-500">Selecciona elementos para agregar a la cotización.</p>
       </div>
       <div class="lg:col-span-8 bg-surface-0 dark:bg-surface-800 rounded-3xl border border-surface-200 dark:border-white/5 shadow-sm p-6 overflow-y-auto">
          <h2 class="font-bold mb-4">Documento</h2>
          <p class="text-sm text-surface-500">Configuración de cliente, fechas y montos.</p>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

