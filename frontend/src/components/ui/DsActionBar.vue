<template>
  <div class="flex items-center gap-2 bg-surface-50 dark:bg-surface-900/50 p-2 rounded-lg border border-surface-200 dark:border-surface-800">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
// Logic for usePermissions().can() is applied on the buttons passed to the slot by the parent.
// Example: <DsButton v-if="permissionsStore.can('contract.approve')">Aprobar</DsButton>
</script>