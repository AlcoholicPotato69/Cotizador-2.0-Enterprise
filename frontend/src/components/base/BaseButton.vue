<template>
  <DsButton v-bind="$attrs">
    <slot />
  </DsButton>
</template>

<script setup lang="ts">
import DsButton from '../ui/DsButton.vue';
</script>

