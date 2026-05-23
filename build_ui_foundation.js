const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'frontend', 'src', 'components', 'ui');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const components = {
    // === FORM FOUNDATION ===
    'DsFormField.vue': `<template>
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
</script>`,

    // === PAGE FOUNDATION ===
    'DsPageHeader.vue': `<template>
  <div class="bg-surface-0 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 px-6 py-5">
    <!-- Breadcrumbs -->
    <nav class="flex text-xs text-surface-500 mb-3" aria-label="Breadcrumb">
      <ol class="flex items-center space-x-2">
        <li v-for="(crumb, idx) in breadcrumbs" :key="idx" class="flex items-center">
          <span v-if="idx > 0" class="mx-2 text-surface-300 dark:text-surface-600">/</span>
          <router-link :to="crumb.to" class="hover:text-primary-600 transition-colors">{{ crumb.label }}</router-link>
        </li>
      </ol>
    </nav>
    
    <!-- Title & Status -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">{{ title }}</h1>
          <DsStatusBadge v-if="status" :status="status" />
        </div>
        <p v-if="subtitle" class="mt-1 text-sm text-surface-500">{{ subtitle }}</p>
      </div>
      
      <!-- Actions -->
      <div v-if="$slots.actions" class="flex items-center gap-2">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import DsStatusBadge from './DsStatusBadge.vue';
defineProps({ title: { type: String, required: true }, subtitle: String, status: String, breadcrumbs: { type: Array as () => { label: string, to: string }[], default: () => [] } });
</script>`,

    'DsActionBar.vue': `<template>
  <div class="flex items-center gap-2 bg-surface-50 dark:bg-surface-900/50 p-2 rounded-lg border border-surface-200 dark:border-surface-800">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
// Logic for usePermissions().can() is applied on the buttons passed to the slot by the parent.
// Example: <DsButton v-if="permissionsStore.can('contract.approve')">Aprobar</DsButton>
</script>`,

    'DsSearchBar.vue': `<template>
  <div class="flex flex-col sm:flex-row gap-3 items-center w-full bg-surface-0 dark:bg-surface-900 p-3 rounded-lg border border-surface-200 dark:border-surface-800">
    <div class="relative flex-1 w-full">
      <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </span>
      <input 
        v-model="query" 
        type="text" 
        :placeholder="placeholder"
        class="block w-full pl-10 pr-3 py-2 border border-surface-300 dark:border-surface-700 rounded-md leading-5 bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm transition-colors"
        @keyup.enter="$emit('search', query)"
      />
    </div>
    <div class="flex items-center gap-2 w-full sm:w-auto">
      <slot name="filters"></slot>
      <button v-if="query" @click="clear" class="text-xs text-surface-500 hover:text-surface-700">Limpiar</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({ placeholder: { type: String, default: 'Buscar...' } });
const emit = defineEmits(['search', 'clear']);
const query = ref('');
function clear() { query.value = ''; emit('clear'); }
</script>`,

    // === TABLE HARDENING ===
    'DsColumnConfig.vue': `<template>
  <div class="relative inline-block text-left">
    <DsButton variant="outline" size="sm" @click="isOpen = !isOpen">
      <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      Columnas
    </DsButton>
    
    <div v-if="isOpen" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-surface-0 dark:bg-surface-900 ring-1 ring-black ring-opacity-5 border border-surface-200 dark:border-surface-800 z-50">
      <div class="py-1 px-3 max-h-60 overflow-auto">
        <label v-for="col in columns" :key="col.field" class="flex items-center space-x-3 py-2 cursor-pointer text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 rounded px-2">
          <input type="checkbox" v-model="col.visible" class="rounded border-surface-300 text-primary-600 focus:ring-primary-500 h-4 w-4" />
          <span>{{ col.header }}</span>
        </label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DsButton from './DsButton.vue';
const isOpen = ref(false);
defineProps({ columns: { type: Array as () => { field: string, header: string, visible: boolean }[], required: true } });
</script>`,

    // === NOTIFICATION FOUNDATION ===
    'DsNotificationPanel.vue': `<template>
  <div class="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-0 dark:bg-surface-900 rounded-xl shadow-2xl border border-surface-200 dark:border-surface-800 overflow-hidden z-50 flex flex-col max-h-[80vh]">
    <div class="px-4 py-3 border-b border-surface-200 dark:border-surface-800 flex justify-between items-center bg-surface-50 dark:bg-surface-900/50">
      <h3 class="font-bold text-sm">Notificaciones</h3>
      <button class="text-xs text-primary-600 font-medium hover:underline">Marcar todas leídas</button>
    </div>
    <div class="overflow-y-auto flex-1">
      <slot></slot>
    </div>
  </div>
</template>`,

    'DsNotificationItem.vue': `<template>
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
</script>`,

    // === CALENDAR FOUNDATION ===
    'DsCalendarShell.vue': `<template>
  <div class="h-full flex flex-col bg-surface-0 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between bg-surface-50 dark:bg-surface-900/50">
      <div class="flex items-center gap-4">
        <h2 class="text-lg font-bold">{{ currentMonth }} {{ currentYear }}</h2>
        <div class="flex bg-surface-0 dark:bg-surface-900 rounded-md shadow-sm border border-surface-200 dark:border-surface-700">
          <button class="px-3 py-1 text-sm font-medium border-r border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800">Hoy</button>
          <button class="px-2 py-1 hover:bg-surface-50 dark:hover:bg-surface-800"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
          <button class="px-2 py-1 hover:bg-surface-50 dark:hover:bg-surface-800"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
        </div>
      </div>
      <div>
        <!-- View Toggle (Month, Week, Day) -->
        <select class="text-sm rounded border-surface-300 dark:border-surface-700 bg-surface-0 dark:bg-surface-950 py-1 pl-2 pr-8 focus:ring-primary-500">
          <option>Mes</option>
          <option>Semana</option>
          <option>Día</option>
        </select>
      </div>
    </div>
    
    <!-- Grid Lienzo agnóstico -->
    <div class="flex-1 overflow-auto bg-surface-100 dark:bg-surface-950 p-4">
      <div class="min-h-full border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 rounded shadow-sm">
         <!-- El slot recibe los EventBlocks inyectados por el Backend -->
         <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({ currentMonth: String, currentYear: Number });
</script>`,

    // === DOCUMENT WORKSPACE HARDENING ===
    'DsDocumentToolbar.vue': `<template>
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
</script>`
};

for (const [filename, content] of Object.entries(components)) {
    fs.writeFileSync(path.join(targetDir, filename), content, 'utf8');
    console.log(`Creado componente UI Foundation: ${filename}`);
}

console.log('Phase 4.2.1 UI Foundation components generated successfully.');
