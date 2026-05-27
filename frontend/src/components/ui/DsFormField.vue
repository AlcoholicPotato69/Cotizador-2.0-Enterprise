<template>
  <div class="flex flex-col gap-1.5 w-full">
    <div class="flex justify-between items-end">
      <label v-if="label" class="text-sm font-semibold text-surface-800 dark:text-surface-200">
        {{ label }} <span v-if="required" class="text-red-500 ml-0.5">*</span>
      </label>
      <span v-if="hint" class="text-xs text-surface-500">{{ hint }}</span>
    </div>
    
    <div :class="['relative', { 'opacity-60 pointer-events-none': disabled }]">
      <slot :hasError="!!error"></slot>
    </div>
    
    <div v-if="error || description" class="text-xs mt-0.5 transition-all">
      <span v-if="error" class="text-red-500 font-medium flex items-center gap-1">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        {{ error }}
      </span>
      <span v-else-if="description" class="text-surface-500">{{ description }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({ label: String, required: Boolean, hint: String, description: String, error: String, disabled: Boolean });
</script>

