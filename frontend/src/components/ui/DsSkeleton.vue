<template>
  <Skeleton v-bind="$attrs"></Skeleton>
</template>
<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
defineOptions({ inheritAttrs: false });
</script>
