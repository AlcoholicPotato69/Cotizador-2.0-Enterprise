<template>
  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', colorClass]">
    {{ label }}
  </span>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps({ status: { type: String, required: true } });

const statusMap: Record<string, string> = {
  draft: 'bg-surface-100 text-surface-800 border-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:border-surface-700',
  pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50',
  approved: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50',
  signed: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50',
  paid: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50',
  rejected: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50',
  cancelled: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50',
  unpaid: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50',
  partial: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50',
  validated: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50',
};

const label = computed(() => props.status.charAt(0).toUpperCase() + props.status.slice(1));
const colorClass = computed(() => statusMap[props.status] || statusMap['draft']);
</script>