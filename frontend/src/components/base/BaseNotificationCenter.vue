<template>
  <DsNotificationPanel v-bind="$attrs">
    <slot />
  </DsNotificationPanel>
</template>

<script setup lang="ts">
import DsNotificationPanel from '../ui/DsNotificationPanel.vue';
</script>

