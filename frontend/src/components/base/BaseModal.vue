<template>
  <DsModal v-bind="$attrs">
    <slot />
  </DsModal>
</template>

<script setup lang="ts">
import DsModal from '../ui/DsModal.vue';
</script>

