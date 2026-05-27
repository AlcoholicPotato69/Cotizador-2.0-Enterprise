<template>
  <DsSelect v-bind="$attrs">
    <slot />
  </DsSelect>
</template>

<script setup lang="ts">
import DsSelect from '../ui/DsSelect.vue';
</script>

