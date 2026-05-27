<template>
  <DsTextarea v-bind="$attrs">
    <slot />
  </DsTextarea>
</template>

<script setup lang="ts">
import DsTextarea from '../ui/DsTextarea.vue';
</script>

