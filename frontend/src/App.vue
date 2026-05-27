<template>
  <DsToast />
  <DsNotificationPanel v-if="authStore.isAuthenticated" />
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import { useNotificationStore } from './stores/notificationStore';
import { useTenantStore } from './stores/tenantStore';
import { useFeatureFlagStore } from './stores/featureFlagStore';
import { useToast } from 'primevue/usetoast';
import { realtimeService } from './services/realtimeService';
import DsNotificationPanel from './components/ui/DsNotificationPanel.vue';
import DsToast from './components/ui/DsToast.vue';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const notificationStore = useNotificationStore();
const tenantStore = useTenantStore();
const featureFlagStore = useFeatureFlagStore();
const toast = useToast();

const onTenantChanged = (event: Event) => {
  const customEvent = event as CustomEvent<{ id?: string }>;
  featureFlagStore.setTenantScope(customEvent.detail?.id ?? null);
};

onMounted(async () => {
  // Session Recovery
  await authStore.initializeSession();
  themeStore.initializeTheme();
  featureFlagStore.setTenantScope(tenantStore.currentTenant?.id ?? authStore.user?.tenant_id ?? null);

  // Initialize Realtime Service
  realtimeService.init(notificationStore, toast);
  window.addEventListener('tenant-changed', onTenantChanged);
});

onUnmounted(() => {
  window.removeEventListener('tenant-changed', onTenantChanged);
  realtimeService.disconnect();
});
</script>

