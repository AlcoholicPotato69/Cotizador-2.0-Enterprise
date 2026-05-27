<template>
  <div class="flex items-center justify-between p-2 bg-surface-100 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 rounded-t-lg">
    <div class="flex gap-1">
      <DsButton variant="ghost" size="sm" @click="$emit('action', 'download')" title="Descargar">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
      </DsButton>
      <DsButton variant="ghost" size="sm" @click="$emit('action', 'print')" title="Imprimir">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
      </DsButton>
      <div class="w-px h-5 bg-surface-300 dark:bg-surface-700 mx-1 self-center"></div>
      <DsButton variant="ghost" size="sm" @click="$emit('action', 'copy_uuid')" title="Copiar UUID">UUID</DsButton>
      <DsButton variant="ghost" size="sm" @click="$emit('action', 'copy_hash')" title="Copiar Hash">HASH</DsButton>
    </div>
    <div class="flex gap-1">
      <DsButton variant="outline" size="sm" @click="$emit('view', 'metadata')">Metadata</DsButton>
      <DsButton variant="outline" size="sm" @click="$emit('view', 'audit')">Audit Trail</DsButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import DsButton from './DsButton.vue';
defineEmits(['action', 'view']);
</script>

