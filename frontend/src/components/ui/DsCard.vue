<template>
  <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-lg shadow-sm overflow-hidden">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-surface-200 dark:border-surface-800 font-semibold">
      <slot name="header"></slot>
    </div>
    <div class="p-6">
      <slot></slot>
      <slot name="content"></slot>
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 bg-surface-50 dark:bg-surface-950 border-t border-surface-200 dark:border-surface-800">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

