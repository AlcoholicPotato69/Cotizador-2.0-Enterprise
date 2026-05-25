<template>
  <div class="flex h-screen w-screen overflow-hidden bg-surface-50 text-surface-900 dark:bg-surface-950 dark:text-surface-50" v-if="authStore.isAuthenticated">
    
    <!-- Sidebar -->
    <aside 
      class="flex flex-col bg-surface-0 border-r border-surface-200 transition-all duration-300 dark:bg-surface-900 dark:border-surface-800 z-20"
      :class="isSidebarCollapsed ? 'w-16' : 'w-64'"
    >
      <!-- Sidebar Header -->
      <div class="h-14 flex items-center justify-between px-4 border-b border-surface-200 dark:border-surface-800">
        <div class="flex items-center gap-3 overflow-hidden" v-if="!isSidebarCollapsed">
          <div class="w-8 h-8 rounded bg-primary-600 flex items-center justify-center shrink-0">
            <span class="text-white font-bold text-sm">C2</span>
          </div>
          <span class="font-semibold text-surface-900 dark:text-surface-0 truncate">Cotizador Enterprise</span>
        </div>
        <div class="w-8 h-8 rounded bg-primary-600 flex items-center justify-center shrink-0 mx-auto" v-else>
          <span class="text-white font-bold text-sm">C2</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
        <router-link to="/" class="flex items-center gap-3 px-3 py-2 rounded-md text-surface-600 font-medium text-sm transition-colors hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset" active-class="!bg-primary-50 !text-primary-700 dark:!bg-primary-900/30 dark:!text-primary-300" :class="{'justify-center': isSidebarCollapsed}">
          <LayoutDashboard class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="truncate">Dashboard</span>
        </router-link>
        
        <router-link to="/catalog" class="flex items-center gap-3 px-3 py-2 rounded-md text-surface-600 font-medium text-sm transition-colors hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset" active-class="!bg-primary-50 !text-primary-700 dark:!bg-primary-900/30 dark:!text-primary-300" v-permission="'spaces.read'" :class="{'justify-center': isSidebarCollapsed}">
          <Package class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="truncate">Catálogo</span>
        </router-link>
        
        <router-link to="/quotes" class="flex items-center gap-3 px-3 py-2 rounded-md text-surface-600 font-medium text-sm transition-colors hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset" active-class="!bg-primary-50 !text-primary-700 dark:!bg-primary-900/30 dark:!text-primary-300" v-permission="'quotes.read'" :class="{'justify-center': isSidebarCollapsed}">
          <Calculator class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="truncate">Cotizaciones</span>
        </router-link>

        <router-link to="/clients" class="flex items-center gap-3 px-3 py-2 rounded-md text-surface-600 font-medium text-sm transition-colors hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset" active-class="!bg-primary-50 !text-primary-700 dark:!bg-primary-900/30 dark:!text-primary-300" v-permission="'clients.read'" :class="{'justify-center': isSidebarCollapsed}">
          <Users class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="truncate">Clientes</span>
        </router-link>

        <router-link to="/admin" class="mt-auto flex items-center gap-3 px-3 py-2 rounded-md text-surface-600 font-medium text-sm transition-colors hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset" active-class="!bg-primary-50 !text-primary-700 dark:!bg-primary-900/30 dark:!text-primary-300" v-permission="'config.manage'" :class="{'justify-center': isSidebarCollapsed}">
          <Settings class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="truncate">Administración</span>
        </router-link>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-3 border-t border-surface-200 dark:border-surface-800 flex flex-col gap-2">
        <div class="flex items-center gap-3 px-2 py-2" v-if="!isSidebarCollapsed">
          <div class="w-8 h-8 rounded-full bg-surface-200 flex items-center justify-center font-bold text-xs text-surface-700 dark:bg-surface-700 dark:text-surface-200 shrink-0">
            {{ userInitials }}
          </div>
          <div class="flex flex-col overflow-hidden">
            <span class="text-sm font-semibold text-surface-900 dark:text-surface-50 truncate">{{ user?.name }}</span>
            <span class="text-xs text-surface-500 truncate">{{ user?.role }}</span>
          </div>
        </div>
        <button 
          @click="handleLogout" 
          aria-label="Cerrar sesión"
          class="flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          :class="{'justify-center': isSidebarCollapsed}"
        >
          <LogOut class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="truncate">Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 bg-surface-50 dark:bg-surface-950">
      
      <!-- Header -->
      <header class="h-14 bg-surface-0 border-b border-surface-200 flex items-center justify-between px-4 shadow-sm z-10 dark:bg-surface-900 dark:border-surface-800">
        <!-- Left: Toggle & Breadcrumb -->
        <div class="flex items-center gap-4 flex-1">
          <button 
            @click="toggleSidebar" 
            aria-label="Alternar menú lateral"
            class="p-1.5 rounded-md text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <Menu class="w-5 h-5" />
          </button>
          
          <!-- Clean Breadcrumb -->
          <div class="hidden sm:flex items-center text-sm">
            <span class="text-surface-600 dark:text-surface-400 font-medium">App</span>
            <ChevronRight class="w-4 h-4 mx-2 text-surface-400" />
            <span class="text-surface-900 font-semibold dark:text-surface-50">{{ currentRouteName }}</span>
          </div>
        </div>
        
        <!-- Right: Actions & Tenant Toggler -->
        <div class="flex items-center gap-3">
          
          <div class="relative hidden md:block w-64">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input 
              type="text" 
              placeholder="Buscar (Ctrl+K)"
              aria-label="Buscar en la aplicación"
              class="w-full bg-surface-50 border border-surface-200 text-surface-900 rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:bg-surface-950 dark:border-surface-700 dark:text-surface-50 dark:placeholder-surface-400"
            />
          </div>

          <!-- Dark Mode Toggle -->
          <button @click="toggleDarkMode" aria-label="Alternar tema oscuro" class="p-1.5 rounded-md text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" title="Cambiar tema">
            <Sun v-if="isDark" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </button>
          
          <!-- Notifications -->
          <button aria-label="Notificaciones" class="relative p-1.5 rounded-md text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
            <Bell class="w-5 h-5" />
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-surface-900"></span>
          </button>

          <div class="w-px h-5 bg-surface-200 mx-1 dark:bg-surface-700"></div>

          <!-- Tenant Toggler -->
          <div class="flex items-center bg-surface-50 rounded-md px-3 py-1.5 border border-surface-200 dark:bg-surface-950 dark:border-surface-700" v-if="tenantStore.availableTenants.length > 0">
            <Building2 class="w-4 h-4 text-surface-500 mr-2 shrink-0" />
            <select 
              v-model="tenantStore.activeTenantId" 
              @change="handleTenantChange($event)"
              aria-label="Seleccionar organización"
              class="bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm font-medium text-surface-900 text-sm cursor-pointer appearance-none pr-5 dark:text-surface-50"
              style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'none\' stroke=\'%2364748b\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'></path></svg>'); background-repeat: no-repeat; background-position: right center; background-size: 1rem;"
            >
              <option v-for="tenant in tenantStore.availableTenants" :key="tenant.id" :value="tenant.id">
                {{ tenant.name }}
              </option>
            </select>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenant';
import { usePermissionsStore } from '../stores/permissions';
import { 
  LayoutDashboard, 
  Package, 
  Calculator, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  Building2, 
  ChevronRight 
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const tenantStore = useTenantStore();
const permissionsStore = usePermissionsStore();
const authStore = useAuthStore();

const isSidebarCollapsed = ref(false);
const isDark = ref(false);
const user = computed(() => authStore.user);

const userInitials = computed(() => {
  const name = user.value?.name || 'U';
  return name.substring(0, 2).toUpperCase();
});

const currentRouteName = computed(() => {
  const map: Record<string, string> = {
    'dashboard': 'Dashboard',
    'catalog': 'Catálogo de Espacios',
    'quotes': 'Cotizaciones',
    'clients': 'Directorio de Clientes'
  };
  return map[route.name as string] || route.name;
});

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const handleTenantChange = async (event: any) => {
  tenantStore.setActiveTenant(event.target.value);
  await permissionsStore.loadPermissions();
  
  // Theme Engine: Switch CSS class on body based on tenant
  document.body.classList.remove('tenant-pm', 'tenant-cp');
  if (tenantStore.activeTenant?.slug === 'plaza_mayor') {
    document.body.classList.add('tenant-pm');
  } else {
    document.body.classList.add('tenant-cp');
  }
};

const handleLogout = () => {
  authStore.logout();
  permissionsStore.clearPermissions();
  router.push({ name: 'login' });
};

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await tenantStore.fetchTenants();
    await permissionsStore.loadPermissions();
    
    // Initialize Theme
    if (tenantStore.activeTenant?.slug === 'plaza_mayor') {
      document.body.classList.add('tenant-pm');
    } else {
      document.body.classList.add('tenant-cp');
    }
  }
});
</script>
