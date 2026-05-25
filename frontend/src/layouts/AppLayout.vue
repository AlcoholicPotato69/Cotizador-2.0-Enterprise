<template>
  <div class="min-h-screen bg-surface text-white flex flex-col md:flex-row transition-colors duration-200">
    <aside class="w-full md:w-64 border-r border-white/10 bg-surface/50 backdrop-blur-md flex-shrink-0 hidden md:block">
      <div class="h-16 flex items-center px-6 border-b border-white/10 font-display font-bold tracking-tight text-xl text-primary-500">
        Cotizador 2.0
      </div>
      <div class="p-4">
        <div class="mb-6 px-3 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between" style="box-shadow: var(--shadow-ambient)">
          <div>
            <div class="text-[10px] tracking-widest text-white/50 uppercase font-medium mb-1">Portal Activo</div>
            <div class="text-sm font-bold text-white font-display">
              {{ tenantStore.activeTenantSlug === 'plaza-mayor' ? 'Plaza Mayor' : 'Casa de Piedra' }}
            </div>
          </div>
        </div>
        <nav class="space-y-2">
          <router-link v-for="item in navItems" :key="item.route" :to="item.route"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all hover:bg-white/5 text-white/70 hover:text-white"
            active-class="bg-primary-500/20 text-primary-400 border border-primary-500/30">
            <span class="ml-2 font-body">{{ item.label }}</span>
          </router-link>
        </nav>
      </div>
    </aside>
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-surface/50 backdrop-blur-md z-10">
        <div class="flex items-center">
          <button class="md:hidden mr-4 text-white/70">☰</button>
          <div class="text-sm font-medium text-white/50 font-body">Dashboard</div>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="authStore.logout()" class="text-xs px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-white/70">Cerrar Sesión</button>
          <div class="h-9 w-9 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm" style="box-shadow: var(--shadow-ambient)">U</div>
        </div>
      </header>
      <main class="flex-1 overflow-y-auto p-6 bg-surface">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTenantStore } from '../stores/tenantStore';
import { useAuthStore } from '../stores/authStore';
import { getAuthorizedNavigation } from '../router/navigation';

const tenantStore = useTenantStore();
const authStore = useAuthStore();
const navItems = computed(() => getAuthorizedNavigation());
</script>
