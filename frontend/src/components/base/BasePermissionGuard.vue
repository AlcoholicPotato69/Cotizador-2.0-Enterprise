<template>
  <slot v-if="isAllowed" />
  <slot v-else name="fallback" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { hasPermission } from '../../app/access-context';

const props = withDefaults(defineProps<{
  permission: string | string[];
}>(), {
  permission: '',
});

const isAllowed = computed<boolean>(() => {
  if (!props.permission) {
    return false;
  }

  return hasPermission(props.permission);
});
</script>

