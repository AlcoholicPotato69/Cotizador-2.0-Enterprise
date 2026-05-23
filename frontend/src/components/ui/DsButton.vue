<template>
  <button 
    :class="[
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50',
      variantClasses,
      sizeClasses
    ]"
    :disabled="disabled || loading"
  >
    <slot name="prefix" v-if="!loading"></slot>
    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary, secondary, outline, ghost, danger
  size: { type: String, default: 'md' }, // sm, md, lg
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary': return 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm';
    case 'secondary': return 'bg-surface-100 text-surface-900 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-50 dark:hover:bg-surface-700';
    case 'outline': return 'border border-surface-200 bg-transparent hover:bg-surface-100 dark:border-surface-700 dark:hover:bg-surface-800 text-surface-900 dark:text-surface-50';
    case 'ghost': return 'bg-transparent hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-900 dark:text-surface-50';
    case 'danger': return 'bg-red-600 text-white hover:bg-red-700 shadow-sm';
    default: return 'bg-primary-600 text-white hover:bg-primary-700';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-8 px-3 text-xs';
    case 'lg': return 'h-12 px-8';
    case 'md':
    default: return 'h-10 px-4 py-2';
  }
});
</script>
