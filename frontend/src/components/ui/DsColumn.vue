<template>
  <Column v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </Column>
</template>
<script setup lang="ts">
import Column from 'primevue/column';
defineOptions({ inheritAttrs: false });
</script>
