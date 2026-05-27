<template>
  <DsLoadingState v-bind="$attrs">
    <slot />
  </DsLoadingState>
</template>

<script setup lang="ts">
import DsLoadingState from '../ui/DsLoadingState.vue';
</script>

