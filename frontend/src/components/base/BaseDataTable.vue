<template>
  <DsTable v-bind="$attrs">
    <slot />
  </DsTable>
</template>

<script setup lang="ts">
import DsTable from '../ui/DsTable.vue';
</script>

