<template>
  <ol class="space-y-4">
    <li v-for="event in items" :key="event.id" class="relative pl-8">
      <span class="absolute left-0 top-1.5 h-3 w-3 rounded-full" :class="statusClass(event.status)"></span>
      <div class="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 p-3">
        <p class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ event.title }}</p>
        <p v-if="event.description" class="mt-1 text-xs text-surface-600 dark:text-surface-300">{{ event.description }}</p>
        <p class="mt-2 text-[11px] uppercase tracking-wide text-surface-500">
          {{ event.at }}<span v-if="event.by"> · {{ event.by }}</span>
        </p>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
type WorkflowStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface WorkflowEvent {
  id: string;
  title: string;
  description?: string;
  at: string;
  by?: string;
  status: WorkflowStatus;
}

withDefaults(defineProps<{
  items: WorkflowEvent[];
}>(), {
  items: () => [],
});

const statusClass = (status: WorkflowStatus): string => {
  switch (status) {
    case 'approved':
    case 'completed':
      return 'bg-emerald-500';
    case 'rejected':
    case 'cancelled':
      return 'bg-rose-500';
    case 'in_progress':
      return 'bg-amber-500';
    default:
      return 'bg-surface-400';
  }
};
</script>

