<template>
  <DsDocumentViewer v-bind="$attrs">
    <template #document>
      <slot name="document" />
    </template>
    <template #metadata>
      <slot name="metadata" />
    </template>
  </DsDocumentViewer>
</template>

<script setup lang="ts">
import DsDocumentViewer from '../ui/DsDocumentViewer.vue';
</script>

