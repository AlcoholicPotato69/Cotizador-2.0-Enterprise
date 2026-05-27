<template>
  <DsInput v-bind="$attrs">
    <slot />
  </DsInput>
</template>

<script setup lang="ts">
import DsInput from '../ui/DsInput.vue';
</script>

