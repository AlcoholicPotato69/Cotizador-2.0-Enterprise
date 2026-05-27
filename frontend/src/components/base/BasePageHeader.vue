<template>
  <DsPageHeader
    :title="title"
    :subtitle="subtitle"
    :status="status"
    :breadcrumbs="breadcrumbs"
    v-bind="$attrs"
  >
    <template #actions>
      <slot name="actions" />
    </template>
  </DsPageHeader>
</template>

<script setup lang="ts">
import DsPageHeader from '../ui/DsPageHeader.vue';

withDefaults(defineProps<{
  title: string;
  subtitle?: string;
  status?: string;
  breadcrumbs?: Array<{ label: string; to: string }>;
}>(), {
  subtitle: '',
  status: '',
  breadcrumbs: () => [],
});
</script>

