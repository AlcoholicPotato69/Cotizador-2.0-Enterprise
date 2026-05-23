<template>
  <div class="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-0 dark:bg-surface-900 rounded-xl shadow-2xl border border-surface-200 dark:border-surface-800 overflow-hidden z-50 flex flex-col max-h-[80vh]">
    <div class="px-4 py-3 border-b border-surface-200 dark:border-surface-800 flex justify-between items-center bg-surface-50 dark:bg-surface-900/50">
      <h3 class="font-bold text-sm">Notificaciones</h3>
      <button class="text-xs text-primary-600 font-medium hover:underline">Marcar todas leídas</button>
    </div>
    <div class="overflow-y-auto flex-1">
      <slot></slot>
    </div>
  </div>
</template>