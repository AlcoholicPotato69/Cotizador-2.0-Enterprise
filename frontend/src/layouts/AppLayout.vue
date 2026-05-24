<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-50 flex flex-col md:flex-row transition-colors duration-200">
    
    <!-- Sidebar -->
    <aside class="w-full md:w-64 border-r border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 flex-shrink-0 hidden md:block">
      <div class="h-16 flex items-center px-6 border-b border-surface-200 dark:border-surface-800 font-bold tracking-tight text-lg">
        Cotizador 2.0
      </div>
      
      <div class="p-4">
        <!-- Tenant Badge -->
        <div class="mb-6 px-2 py-3 rounded-md bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/50 flex items-center justify-between">
          <div>
            <div class="text-xs text-primary-600 dark:text-primary-400 font-medium">Tenant Activo</div>
            <div class="text-sm font-bold text-primary-900 dark:text-primary-100">
              {{ tenantStore.activeTenant === 'pm' ? 'Plaza Mayor' : 'Casa de Piedra' }}
            </div>
          </div>
        </div>

        <!-- Navigation Registry -->
        <nav class="space-y-1">
          <router-link 
            v-for="item in navItems" 
            :key="item.route" 
            :to="item.route"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-50"
            active-class="bg-surface-100 dark:bg-surface-800 text-primary-600 dark:text-primary-400"
          >
            <!-- Here we would put Lucide icons -->
            <span class="ml-2">{{ item.label }}</span>
          </router-link>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Topbar -->
      <header class="h-16 flex items-center justify-between px-6 border-b border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900">
        <div class="flex items-center">
          <!-- Mobile Menu Button -->
          <button class="md:hidden mr-4 text-surface-500">☰</button>
          <div class="text-sm font-medium text-surface-500">Breadcrumbs > Current Page</div>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Theme Switcher -->
          <button @click="themeStore.toggleMode()" class="p-2 text-surface-500 hover:text-surface-900 dark:hover:text-surface-50">
            {{ themeStore.mode === 'light' ? '🌙' : '☀️' }}
          </button>
          
          <!-- Notification Bell -->
          <button class="p-2 text-surface-500 hover:text-surface-900 dark:hover:text-surface-50 relative">
            🔔
            <span v-if="notificationStore.notifications.length" class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <!-- User Menu -->
          <div class="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs cursor-pointer" @click="authStore.logout()">
            U
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view></router-view>
      </main>
    </div>

    <!-- DEV TOOLBAR INJECTION PURGED -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTenantStore } from '../stores/tenantStore';
import { useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { getAuthorizedNavigation } from '../router/navigation';

const tenantStore = useTenantStore();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const navItems = computed(() => getAuthorizedNavigation());
</script>
