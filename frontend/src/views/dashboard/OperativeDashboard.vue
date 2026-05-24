<template>
  <div class="space-y-6">
    <!-- Actionable Queues -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Verificaciones Pendientes -->
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-surface-500 uppercase tracking-wider">Verificaciones Pendientes</h3>
          <div class="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
            <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-surface-900 dark:text-surface-50">{{ data?.pendingVerifications || 0 }}</div>
        <div class="mt-4">
          <button class="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">Ver cola de auditoría &rarr;</button>
        </div>
      </div>

      <!-- Cotizaciones por Vencer -->
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-surface-500 uppercase tracking-wider">Cotizaciones por Vencer</h3>
          <div class="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-surface-900 dark:text-surface-50">{{ data?.expiringQuotes || 0 }}</div>
        <div class="mt-4">
          <button class="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">Revisar cotizaciones &rarr;</button>
        </div>
      </div>

      <!-- Firmas Pendientes -->
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-surface-500 uppercase tracking-wider">Firmas de Contrato Pendientes</h3>
          <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-surface-900 dark:text-surface-50">{{ data?.pendingSignatures || 0 }}</div>
        <div class="mt-4">
          <button class="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">Gestionar firmas &rarr;</button>
        </div>
      </div>
    </div>

    <!-- Eventos Próximos (Next 7 Days) -->
    <div class="bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900">
        <h3 class="text-lg font-medium text-surface-900 dark:text-surface-50">Eventos Próximos (7 días)</h3>
      </div>
      <div class="divide-y divide-surface-200 dark:divide-surface-800">
        <div v-for="event in data?.upcomingEvents" :key="event.id" class="px-6 py-4 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
          <div>
            <div class="font-medium text-surface-900 dark:text-surface-50">{{ event.name }}</div>
            <div class="text-sm text-surface-500">{{ event.clientName }} &bull; {{ event.spaceName }}</div>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium text-surface-900 dark:text-surface-50">{{ event.dateFormatted }}</div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="{
              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': event.status === 'CONFIRMED',
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': event.status === 'TENTATIVE'
            }">
              {{ event.status }}
            </span>
          </div>
        </div>
        <div v-if="!data?.upcomingEvents?.length" class="px-6 py-8 text-center text-surface-500">
          No hay eventos próximos en los siguientes 7 días.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data?: any;
}>();
</script>
