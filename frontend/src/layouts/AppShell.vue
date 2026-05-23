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
  <div class="flex h-screen w-full bg-slate-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
      <div class="h-16 flex items-center px-6 border-b border-slate-200">
        <h1 class="text-xl font-black text-slate-800 tracking-tight">
          <span class="text-red-600">HUB</span> 2.0
        </h1>
      </div>
      
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <router-link to="/" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-900 shadow-sm">
          <LayoutDashboard :size="18" class="text-slate-900" />
          Dashboard
        </router-link>
        
        <router-link to="#" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Users :size="18" class="text-slate-400" />
          Clientes
        </router-link>

        <router-link to="#" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <FileText :size="18" class="text-slate-400" />
          Cotizaciones
        </router-link>
      </nav>

      <div class="p-4 border-t border-slate-200">
        <button class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Settings :size="18" class="text-slate-400" />
          Configuración
        </button>
        <button @click="handleLogout" class="mt-2 w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors">
          <LogOut :size="18" />
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden relative">
      <!-- Topbar -->
      <header class="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 z-10 shadow-sm">
        <div class="flex items-center gap-2 text-sm text-slate-500">
          <!-- Breadcrumbs estático por ahora -->
          <span>Home</span>
          <span class="text-slate-300">/</span>
          <span class="font-bold text-slate-700">Dashboard</span>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm font-bold text-slate-800 leading-tight">Administrador</p>
            <p class="text-xs text-slate-500">Plaza Mayor</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center">
            <Users :size="20" class="text-slate-400" />
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
