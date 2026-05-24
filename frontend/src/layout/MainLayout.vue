<template>
  <div class="flex h-screen w-screen overflow-hidden bg-surface-50 text-surface-900 transition-colors duration-200 dark:bg-surface-950 dark:text-surface-50" v-if="authStore.isAuthenticated">
    
    <!-- Sidebar -->
    <aside 
      class="flex flex-col bg-surface-900 text-surface-200 transition-all duration-300 border-r border-surface-800 dark:bg-surface-900"
      :class="isSidebarCollapsed ? 'w-20' : 'w-64'"
    >
      <!-- Sidebar Header -->
      <div class="h-16 flex items-center justify-between px-4 border-b border-surface-800">
        <div class="w-10 h-10 rounded-md flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm">
          <span class="text-white font-black tracking-wider text-lg">
            {{ isSidebarCollapsed ? 'C' : 'C2' }}
          </span>
        </div>
        <button 
          @click="toggleSidebar" 
          class="text-surface-400 hover:text-surface-50 transition-colors focus:outline-none"
        >
          <i class="pi pi-bars text-xl"></i>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 flex flex-col gap-2 p-3 overflow-y-auto">
        <router-link to="/" class="flex items-center gap-3 px-3 py-2.5 rounded-md text-surface-400 font-semibold text-sm transition-all hover:bg-surface-800 hover:text-surface-50" active-class="bg-primary-500 text-white shadow-sm hover:bg-primary-600" :class="{'justify-center': isSidebarCollapsed}">
          <i class="pi pi-home text-lg"></i>
          <span v-if="!isSidebarCollapsed">Dashboard</span>
        </router-link>
        
        <router-link to="/catalog" class="flex items-center gap-3 px-3 py-2.5 rounded-md text-surface-400 font-semibold text-sm transition-all hover:bg-surface-800 hover:text-surface-50" active-class="bg-primary-500 text-white shadow-sm hover:bg-primary-600" v-permission="'spaces.read'" :class="{'justify-center': isSidebarCollapsed}">
          <i class="pi pi-box text-lg"></i>
          <span v-if="!isSidebarCollapsed">Catálogo</span>
        </router-link>
        
        <router-link to="/quotes" class="flex items-center gap-3 px-3 py-2.5 rounded-md text-surface-400 font-semibold text-sm transition-all hover:bg-surface-800 hover:text-surface-50" active-class="bg-primary-500 text-white shadow-sm hover:bg-primary-600" v-permission="'quotes.read'" :class="{'justify-center': isSidebarCollapsed}">
          <i class="pi pi-calculator text-lg"></i>
          <span v-if="!isSidebarCollapsed">Cotizaciones</span>
        </router-link>

        <router-link to="/clients" class="flex items-center gap-3 px-3 py-2.5 rounded-md text-surface-400 font-semibold text-sm transition-all hover:bg-surface-800 hover:text-surface-50" active-class="bg-primary-500 text-white shadow-sm hover:bg-primary-600" v-permission="'clients.read'" :class="{'justify-center': isSidebarCollapsed}">
          <i class="pi pi-users text-lg"></i>
          <span v-if="!isSidebarCollapsed">Clientes</span>
        </router-link>

        <router-link to="/admin" class="mt-auto flex items-center gap-3 px-3 py-2.5 rounded-md text-surface-400 font-semibold text-sm transition-all hover:bg-surface-800 hover:text-surface-50" active-class="bg-primary-500 text-white shadow-sm hover:bg-primary-600" v-permission="'config.manage'" :class="{'justify-center': isSidebarCollapsed}">
          <i class="pi pi-cog text-lg"></i>
          <span v-if="!isSidebarCollapsed">TAC Admin</span>
        </router-link>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-surface-800 flex flex-col gap-4">
        <div class="flex items-center gap-3" v-if="!isSidebarCollapsed">
          <div class="w-9 h-9 rounded-full bg-surface-700 flex items-center justify-center font-bold text-sm text-surface-50">
            {{ userInitials }}
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-bold text-surface-50">{{ user?.name || user?.username }}</span>
            <span class="text-xs text-surface-400 uppercase tracking-wider">{{ user?.role }}</span>
          </div>
        </div>
        <button 
          @click="handleLogout" 
          class="flex items-center gap-3 px-3 py-2 rounded-md font-bold text-sm text-red-400 hover:bg-surface-800 hover:text-red-300 transition-colors w-full"
          :class="{'justify-center': isSidebarCollapsed}"
        >
          <i class="pi pi-sign-out text-lg"></i>
          <span v-if="!isSidebarCollapsed">Salir</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 bg-surface-50 dark:bg-surface-950">
      
      <!-- Topbar -->
      <header class="h-16 bg-surface-0 border-b border-surface-200 flex items-center justify-between px-6 shadow-sm z-10 dark:bg-surface-900 dark:border-surface-800">
        <!-- Left: Global Search / Breadcrumb -->
        <div class="flex items-center gap-6 flex-1">
          <h2 class="text-xl font-bold text-surface-900 dark:text-surface-50 hidden md:block whitespace-nowrap">
            {{ currentRouteName }}
          </h2>
          
          <div class="relative w-full max-w-md hidden sm:block">
            <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"></i>
            <input 
              type="text" 
              placeholder="Buscar (Cmd/Ctrl + K)" 
              class="w-full bg-surface-100 border border-surface-200 text-surface-900 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-surface-800 dark:border-surface-700 dark:text-surface-50 dark:placeholder-surface-400"
            />
          </div>
        </div>
        
        <!-- Right: Actions & Tenant Toggler -->
        <div class="flex items-center gap-4">
          <!-- Dark Mode Toggle -->
          <button @click="toggleDarkMode" class="w-8 h-8 rounded-full flex items-center justify-center text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'"></i>
          </button>
          
          <!-- Notifications -->
          <button class="relative w-8 h-8 rounded-full flex items-center justify-center text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <i class="pi pi-bell"></i>
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div class="w-px h-6 bg-surface-200 mx-1 dark:bg-surface-700"></div>

          <!-- Tenant Toggler (Plaza Mayor / Casa de Piedra) -->
          <div class="flex items-center bg-surface-100 rounded-full px-4 py-1.5 border border-surface-200 dark:bg-surface-800 dark:border-surface-700" v-if="tenantStore.availableTenants.length > 0">
            <i class="pi pi-building text-surface-400 mr-2 text-sm"></i>
            <select 
              v-model="tenantStore.activeTenantId" 
              @change="handleTenantChange($event)"
              class="bg-transparent border-none outline-none font-bold text-surface-900 text-sm cursor-pointer appearance-none pr-6 dark:text-surface-50"
              style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'none\' stroke=\'%2364748b\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'></path></svg>'); background-repeat: no-repeat; background-position: right center; background-size: 1rem;"
            >
              <option v-for="tenant in tenantStore.availableTenants" :key="tenant.id" :value="tenant.id">
                {{ tenant.name }}
              </option>
            </select>
            <span class="ml-3 text-xs font-black px-2 py-0.5 rounded-md" :class="tenantBadgeClass">
              {{ tenantStore.activeTenant?.slug === 'plaza_mayor' ? 'PM' : 'CP' }}
            </span>
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

const router = useRouter();
const route = useRoute();
const tenantStore = useTenantStore();
const permissionsStore = usePermissionsStore();
const authStore = useAuthStore();

const isSidebarCollapsed = ref(false);
const isDark = ref(false);
const user = computed(() => authStore.user);

const userInitials = computed(() => {
  const name = user.value?.name || user.value?.username || 'U';
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

const tenantBadgeClass = computed(() => {
  return tenantStore.activeTenant?.slug === 'plaza_mayor' 
    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' 
    : 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300';
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
