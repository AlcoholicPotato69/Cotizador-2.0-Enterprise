<template>
  <DsEmptyState v-bind="$attrs">
    <slot />
  </DsEmptyState>
</template>

<script setup lang="ts">
import DsEmptyState from '../ui/DsEmptyState.vue';
</script>

