<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';

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
