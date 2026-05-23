<template>
  <div class="bg-surface-0 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 px-6 py-5">
    <!-- Breadcrumbs -->
    <nav class="flex text-xs text-surface-500 mb-3" aria-label="Breadcrumb">
      <ol class="flex items-center space-x-2">
        <li v-for="(crumb, idx) in breadcrumbs" :key="idx" class="flex items-center">
          <span v-if="idx > 0" class="mx-2 text-surface-300 dark:text-surface-600">/</span>
          <router-link :to="crumb.to" class="hover:text-primary-600 transition-colors">{{ crumb.label }}</router-link>
        </li>
      </ol>
    </nav>
    
    <!-- Title & Status -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">{{ title }}</h1>
          <DsStatusBadge v-if="status" :status="status" />
        </div>
        <p v-if="subtitle" class="mt-1 text-sm text-surface-500">{{ subtitle }}</p>
      </div>
      
      <!-- Actions -->
      <div v-if="$slots.actions" class="flex items-center gap-2">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import DsStatusBadge from './DsStatusBadge.vue';
defineProps({ title: { type: String, required: true }, subtitle: String, status: String, breadcrumbs: { type: Array as () => { label: string, to: string }[], default: () => [] } });
</script>