<script setup lang="ts">
import { Users, FileText, Calendar } from 'lucide-vue-next'
</script>

<template>
  <div class="dashboard-page animate-fade-in">
    <div class="mb-8">
      <h1 class="text-2xl font-black text-surface-800 dark:text-surface-100 mb-1">Bienvenido a Cotizador 2.0 Enterprise</h1>
      <p class="text-surface-500 dark:text-surface-400">La arquitectura de Vue 3, Pinia y PrimeVue está configurada correctamente.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div class="w-12 h-12 bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center mb-4">
          <Users :size="24" />
        </div>
        <h3 class="font-bold text-surface-800 dark:text-surface-100">Clientes</h3>
        <p class="text-sm text-surface-500 dark:text-surface-400 mt-1">Gestión de expedientes y validación.</p>
      </div>

      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
          <FileText :size="24" />
        </div>
        <h3 class="font-bold text-surface-800 dark:text-surface-100">Cotizaciones</h3>
        <p class="text-sm text-surface-500 dark:text-surface-400 mt-1">Motor de generación y estados.</p>
      </div>

      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
          <Calendar :size="24" />
        </div>
        <h3 class="font-bold text-surface-800 dark:text-surface-100">Agenda</h3>
        <p class="text-sm text-surface-500 dark:text-surface-400 mt-1">Ocupación de espacios en tiempo real.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

