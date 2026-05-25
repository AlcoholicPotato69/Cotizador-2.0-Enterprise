<template>
  <DsToast />
  <DsNotificationPanel />
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import { useNotificationStore } from './stores/notificationStore';
import { useToast } from 'primevue/usetoast';
import { realtimeService } from './services/realtimeService';
import DsNotificationPanel from './components/ui/DsNotificationPanel.vue';
import DsToast from './components/ui/DsToast.vue';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const notificationStore = useNotificationStore();
const toast = useToast();

onMounted(async () => {
  if (themeStore.mode === 'dark') {
    document.documentElement.classList.add('dark');
  }
  
  // Session Recovery
  await authStore.initializeSession();

  // Initialize Realtime Service
  realtimeService.init(notificationStore, toast);
});

onUnmounted(() => {
  realtimeService.disconnect();
});
</script>
