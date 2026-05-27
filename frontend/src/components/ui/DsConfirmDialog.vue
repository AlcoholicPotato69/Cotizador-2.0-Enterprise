<template>
  <Dialog 
    v-model:visible="visible" 
    :modal="true" 
    :closable="false"
    :pt="{
      mask: { class: 'bg-surface-900/80 backdrop-blur-sm' },
      root: { class: 'bg-surface-0 dark:bg-surface-900 rounded-xl shadow-2xl border border-surface-200 dark:border-surface-800 m-4 sm:w-[400px] overflow-hidden' },
      content: { class: 'p-0' }
    }"
  >
    <div class="p-6 text-center">
      <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      </div>
      <h3 class="text-lg font-bold mb-2">{{ title }}</h3>
      <p class="text-surface-500 text-sm mb-6">{{ message }}</p>
      
      <div class="flex gap-3 w-full">
        <button @click="visible = false" class="flex-1 py-2 px-4 rounded-md border border-surface-300 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 font-medium transition-colors">
          Cancelar
        </button>
        <button @click="confirm" class="flex-1 py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 text-surface-0 dark:text-surface-900 font-medium transition-colors">
          Confirmar
        </button>
      </div>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import Dialog from 'primevue/dialog';
const visible = defineModel<boolean>('visible');
defineProps({ title: String, message: String });
const emit = defineEmits(['confirm']);
function confirm() {
  visible.value = false;
  emit('confirm');
}
</script>

