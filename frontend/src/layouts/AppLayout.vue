<template>
  <div class="min-h-[100dvh] bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-50 flex transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] relative overflow-hidden font-sans">
    
    <!-- Mobile overlay -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 bg-surface-900/40 dark:bg-surface-0/20 backdrop-blur-md lg:hidden transition-opacity" @click="isMobileMenuOpen = false"></div>

    <!-- Sidebar (Glassmorphic) -->
    <aside :class="[
        'fixed lg:static top-0 left-0 z-50 h-[100dvh] w-[280px] bg-surface-0/70 dark:bg-surface-900/60 backdrop-blur-2xl border-r border-surface-200 dark:border-white/10 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]">
      
      <!-- Tenant Selector Header -->
      <div class="h-24 px-6 pt-6 pb-4">
        <button 
          @click="tenantStore.cycleTenant()"
          class="w-full h-full flex items-center p-2 -ml-2 rounded-2xl hover:bg-surface-100 dark:hover:bg-surface-0/5 transition-all duration-300 group cursor-pointer border border-transparent hover:border-surface-200 dark:hover:border-white/10 relative overflow-hidden"
          :title="tenantStore.availableTenants.length > 1 ? 'Clic para cambiar de entorno' : tenantStore.activeTenant?.name"
        >
          <!-- Hover effect background -->
          <div class="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
          
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold font-display mr-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] relative z-10 transition-transform group-hover:scale-105">
            <span v-if="!tenantStore.activeTenant?.logoUrl">{{ tenantInitials }}</span>
            <img v-else :src="tenantStore.activeTenant.logoUrl" alt="Logo" class="w-full h-full object-contain p-1 rounded-xl" />
          </div>
          <div class="flex flex-col text-left relative z-10 overflow-hidden">
            <span class="font-display font-bold text-base tracking-tight leading-tight truncate">{{ tenantStore.activeTenant?.name || 'Seleccionando...' }}</span>
            <span class="text-[10px] text-surface-500 uppercase tracking-widest font-semibold mt-0.5 flex items-center gap-1">
              <i class="pi pi-building text-[8px]"></i> Entorno
            </span>
          </div>
          <!-- Selector indicator if multiple tenants -->
          <div v-if="tenantStore.availableTenants.length > 1" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <i class="pi pi-sync text-primary-500 text-xs"></i>
          </div>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scroll">
        <router-link v-for="item in navItems" :key="item.route" :to="item.route"
          class="group flex items-center px-4 py-3 rounded-2xl text-[13px] font-semibold transition-all duration-300 ease-out hover:bg-surface-100 dark:hover:bg-surface-0/5 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-50"
          active-class="bg-surface-900 text-white dark:bg-surface-0/10 dark:text-primary-400 shadow-md shadow-surface-900/10 dark:shadow-none">
          <i :class="[item.icon, 'mr-3 text-lg transition-transform duration-300 group-hover:scale-110']"></i>
          <span class="truncate transition-transform duration-300 group-hover:translate-x-0.5">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Footer Actions -->
      <div class="p-4 flex flex-col gap-3">
        <!-- Tools row -->
        <div class="relative z-20 flex items-center justify-between px-2 py-1">
          <!-- Notification Bell -->
          <button class="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-0/10 transition-colors group">
            <i class="pi pi-bell text-surface-500 dark:text-surface-400 group-hover:text-primary-500 transition-colors text-lg"></i>
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-surface-0 dark:ring-surface-900"></span>
          </button>

          <!-- Theme Toggle -->
          <button @click="themeStore.toggleTheme()" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-0/10 transition-colors text-surface-500 dark:text-surface-400">
            <i :class="themeStore.isDark ? 'pi pi-moon' : 'pi pi-sun'" class="text-lg"></i>
          </button>
        </div>
        
        <!-- User Profile & Logout -->
        <div class="relative z-10 flex items-center justify-between p-3 rounded-2xl bg-surface-100/50 dark:bg-surface-0/5 border border-surface-200 dark:border-white/10">
          <div class="flex items-center space-x-3 overflow-hidden">
            <div class="w-9 h-9 rounded-full bg-primary-500 text-white flex-shrink-0 flex items-center justify-center font-bold font-display shadow-md">
              {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="flex flex-col truncate">
              <span class="text-xs font-bold truncate leading-tight">{{ authStore.user?.name || 'Usuario' }}</span>
              <span class="text-[10px] text-surface-500 truncate mt-0.5 uppercase tracking-wider font-semibold">{{ authStore.user?.role || 'Rol' }}</span>
            </div>
          </div>
          <button @click="authStore.logout()" class="w-8 h-8 rounded-full flex items-center justify-center text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex-shrink-0 ml-2" title="Cerrar sesión">
             <i class="pi pi-sign-out"></i>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 h-[100dvh] flex flex-col min-w-0 transition-all duration-500 z-10">
      
      <!-- Mobile Topbar -->
      <header class="lg:hidden h-16 flex items-center justify-between px-4 bg-surface-0/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-white/10 z-30 flex-shrink-0">
        <div class="flex items-center" @click="tenantStore.cycleTenant()">
          <div class="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold font-display mr-2">
            {{ tenantInitials }}
          </div>
          <span class="font-display font-semibold text-base tracking-tight">{{ tenantStore.activeTenant?.name }}</span>
        </div>
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="w-10 h-10 relative rounded-full hover:bg-surface-100 dark:hover:bg-surface-0/5 flex items-center justify-center z-50 transition-colors">
          <i class="pi pi-bars text-xl"></i>
        </button>
      </header>

      <!-- Glassmorphic Content Container -->
      <div class="flex-1 p-0 md:p-4 lg:p-6 lg:pl-0 overflow-hidden flex flex-col">
        <div class="flex-1 rounded-none md:rounded-[2rem] bg-surface-0/80 dark:bg-surface-900 border-x border-t md:border border-surface-200 dark:border-surface-800 shadow-2xl shadow-surface-400/10 dark:shadow-none overflow-hidden flex flex-col min-h-0 relative">
          <!-- Decorative glow -->
          <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-surface-100 dark:from-surface-800/50 to-transparent pointer-events-none z-0"></div>
          
          <div class="flex-1 overflow-y-auto relative z-10 p-4 md:p-8 custom-scroll">
            <router-view v-slot="{ Component }">
              <transition name="fade-slide" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useTenantStore } from '../stores/tenantStore';
import { getAuthorizedNavigation } from '../router/navigation';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const tenantStore = useTenantStore();
const navItems = computed(() => getAuthorizedNavigation());
const isMobileMenuOpen = ref(false);

const tenantInitials = computed(() => {
  const name = tenantStore.activeTenant?.name || 'C2';
  return name.substring(0, 2).toUpperCase();
});
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: var(--surface-300);
  border-radius: 10px;
}
.dark .custom-scroll::-webkit-scrollbar-thumb {
  background: var(--surface-700);
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

