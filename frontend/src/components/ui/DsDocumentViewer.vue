<template>
  <div class="fixed inset-0 z-50 bg-surface-0 dark:bg-surface-950 flex flex-col lg:flex-row overflow-hidden">
    <!-- TOOLBAR (Document Actions) -->
    <DsDocumentToolbar 
      class="absolute top-0 left-0 right-0 h-14 z-10"
      @action="() => {}"
      @view="() => {}"
    />

    <!-- CANVAS RENDERING ZONE (70%) -->
    <div class="flex-1 h-full mt-14 bg-surface-100 dark:bg-surface-950 flex items-center justify-center relative p-8">
      <!-- Watermark Simulation -->
      <div class="absolute inset-0 pointer-events-none opacity-5 flex flex-col justify-center items-center overflow-hidden rotate-[-30deg]">
        <div v-for="i in 10" :key="i" class="text-4xl font-bold mb-32 whitespace-nowrap">
          RESTRICTED - USER_ID: {{ authStore.user?.id || 'UNKNOWN' }} - IP: {{ userIp }}
        </div>
      </div>
      
      <!-- Document Provider Box -->
      <div class="w-full max-w-4xl bg-surface-0 dark:bg-surface-900 shadow-2xl h-full flex flex-col border overflow-y-auto">
        <slot name="document">
          <div class="text-surface-400 text-sm m-auto">
            [ {{ mimeType }} Render Provider ]
          </div>
        </slot>
      </div>
    </div>

    <!-- METADATA & AUDIT PANEL (30%) -->
    <div class="w-full lg:w-96 h-full mt-14 border-l border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 flex flex-col">
      <div class="flex border-b border-surface-200 dark:border-surface-800">
        <button class="flex-1 py-3 text-sm font-medium border-b-2 border-primary-500 text-primary-600">Metadata</button>
        <button class="flex-1 py-3 text-sm font-medium text-surface-500 border-b-2 border-transparent">Auditoría</button>
      </div>
      <div class="p-6 flex-1 overflow-y-auto space-y-6">
        <slot name="metadata">
          <div>
            <label class="text-xs font-bold text-surface-500">Legal Hold</label>
            <div class="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">RETENCIÓN ACTIVA</div>
          </div>
          <div>
            <label class="text-xs font-bold text-surface-500">Hash SHA-256</label>
            <div class="mt-1 text-xs font-mono break-all bg-surface-50 dark:bg-surface-950 p-2 rounded border">
              e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DsDocumentToolbar from './DsDocumentToolbar.vue';
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();
const userIp = ref('127.0.0.1'); // Could be fetched from a service if needed

defineProps({ filename: String, mimeType: { type: String, default: 'application/pdf' } });
defineEmits(['close']);
</script>

