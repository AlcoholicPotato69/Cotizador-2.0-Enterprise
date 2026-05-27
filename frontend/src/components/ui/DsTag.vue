<template>
  <Tag v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </Tag>
</template>
<script setup lang="ts">
import Tag from 'primevue/tag';
defineOptions({ inheritAttrs: false });
</script>
