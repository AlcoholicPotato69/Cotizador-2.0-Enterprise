<template>
  <div class="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/80 dark:bg-rose-950/30 p-5">
    <h3 class="text-base font-semibold text-rose-700 dark:text-rose-300">{{ title }}</h3>
    <p v-if="description" class="mt-2 text-sm text-rose-600 dark:text-rose-200/80">{{ description }}</p>
    <button
      v-if="actionLabel"
      type="button"
      class="mt-4 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-500"
      @click="$emit('retry')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string;
  description?: string;
  actionLabel?: string;
}>(), {
  title: 'Ocurrio un error',
  description: '',
  actionLabel: '',
});

defineEmits<{
  (event: 'retry'): void;
}>();
</script>

