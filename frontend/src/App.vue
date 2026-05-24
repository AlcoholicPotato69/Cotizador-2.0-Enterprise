<template>
  <DsNotificationPanel />
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import DsNotificationPanel from './components/ui/DsNotificationPanel.vue';

const authStore = useAuthStore();
const themeStore = useThemeStore();

onMounted(async () => {
  if (themeStore.mode === 'dark') {
    document.documentElement.classList.add('dark');
  }
  
  // Session Recovery
  await authStore.initializeSession();
});
</script>
