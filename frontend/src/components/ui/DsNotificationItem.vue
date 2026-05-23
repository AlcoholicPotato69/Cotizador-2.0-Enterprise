<template>
  <div :class="['px-4 py-3 border-b border-surface-100 dark:border-surface-800/50 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors cursor-pointer', !isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : '']">
    <div class="flex gap-3">
      <div :class="['mt-0.5 w-2 h-2 rounded-full flex-shrink-0', !isRead ? 'bg-primary-500' : 'bg-transparent']"></div>
      <div>
        <p class="text-sm text-surface-900 dark:text-surface-50" :class="{'font-semibold': !isRead}">{{ title }}</p>
        <p class="text-xs text-surface-500 mt-0.5 line-clamp-2">{{ message }}</p>
        <p class="text-[10px] text-surface-400 mt-1 uppercase">{{ time }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({ title: String, message: String, time: String, isRead: Boolean });
</script>