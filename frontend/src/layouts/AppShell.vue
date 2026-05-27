<script setup lang="ts">
import { RouterView } from 'vue-router'
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="flex h-screen w-full bg-surface-50 dark:bg-surface-950">
    <!-- Sidebar -->
    <aside class="w-64 bg-surface-0 dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 flex flex-col shadow-sm z-10">
      <div class="h-16 flex items-center px-6 border-b border-surface-200 dark:border-surface-700">
        <h1 class="text-xl font-black text-surface-800 dark:text-surface-100 tracking-tight">
          <span class="text-primary-600 dark:text-primary-400">HUB</span> 2.0
        </h1>
      </div>
      
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <router-link to="/" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-0 shadow-sm">
          <LayoutDashboard :size="18" class="text-surface-900 dark:text-surface-0" />
          Dashboard
        </router-link>
        
        <router-link to="#" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:bg-surface-950 hover:text-surface-900 dark:text-surface-0 transition-colors">
          <Users :size="18" class="text-surface-400 dark:text-surface-500" />
          Clientes
        </router-link>

        <router-link to="#" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:bg-surface-950 hover:text-surface-900 dark:text-surface-0 transition-colors">
          <FileText :size="18" class="text-surface-400 dark:text-surface-500" />
          Cotizaciones
        </router-link>
      </nav>

      <div class="p-4 border-t border-surface-200 dark:border-surface-700">
        <button class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:bg-surface-950 hover:text-surface-900 dark:text-surface-0 transition-colors">
          <Settings :size="18" class="text-surface-400 dark:text-surface-500" />
          Configuración
        </button>
        <button @click="handleLogout" class="mt-2 w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors">
          <LogOut :size="18" />
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden relative">
      <!-- Topbar -->
      <header class="h-16 flex items-center justify-between px-8 bg-surface-0 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 z-10 shadow-sm">
        <div class="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
          <!-- Breadcrumbs estático por ahora -->
          <span>Home</span>
          <span class="text-surface-300 dark:text-surface-600">/</span>
          <span class="font-bold text-surface-700 dark:text-surface-200">Dashboard</span>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm font-bold text-surface-800 dark:text-surface-100 leading-tight">Administrador</p>
            <p class="text-xs text-surface-500 dark:text-surface-400">Plaza Mayor</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-surface-200 dark:bg-surface-700 border-2 border-white shadow-sm flex items-center justify-center">
            <Users :size="20" class="text-surface-400 dark:text-surface-500" />
          </div>
        </div>
      </header>

      <!-- Router View Container -->
      <div class="flex-1 overflow-y-auto p-8">
        <div class="max-w-7xl mx-auto">
          <RouterView />
        </div>
      </div>
    </main>
  </div>
</template>

