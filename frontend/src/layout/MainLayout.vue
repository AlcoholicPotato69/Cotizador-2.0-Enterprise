<template>
  <div class="main-layout" v-if="pb.authStore.isValid">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo-box">
          <span class="logo-text" v-if="!isSidebarCollapsed">C2</span>
          <span class="logo-text" v-else>C</span>
        </div>
        <Button 
          icon="pi pi-bars" 
          @click="toggleSidebar" 
          class="p-button-text p-button-plain sidebar-toggle"
        />
      </div>

      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item" active-class="active">
          <i class="pi pi-home"></i>
          <span v-if="!isSidebarCollapsed">Dashboard</span>
        </router-link>
        
        <router-link to="/catalog" class="nav-item" active-class="active" v-permission="'spaces.read'">
          <i class="pi pi-box"></i>
          <span v-if="!isSidebarCollapsed">Catálogo</span>
        </router-link>
        
        <router-link to="/quotes" class="nav-item" active-class="active" v-permission="'quotes.read'">
          <i class="pi pi-calculator"></i>
          <span v-if="!isSidebarCollapsed">Cotizaciones</span>
        </router-link>

        <router-link to="/clients" class="nav-item" active-class="active" v-permission="'clients.read'">
          <i class="pi pi-users"></i>
          <span v-if="!isSidebarCollapsed">Clientes</span>
        </router-link>

        <router-link to="/admin" class="nav-item mt-auto" active-class="active" v-permission="'config.manage'">
          <i class="pi pi-cog"></i>
          <span v-if="!isSidebarCollapsed">TAC Admin</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info" v-if="!isSidebarCollapsed">
          <div class="avatar">{{ userInitials }}</div>
          <div class="details">
            <span class="name">{{ user?.name || user?.username }}</span>
            <span class="role">{{ user?.role }}</span>
          </div>
        </div>
        <Button 
          icon="pi pi-sign-out" 
          @click="handleLogout" 
          class="p-button-text p-button-danger logout-btn" 
          :label="isSidebarCollapsed ? '' : 'Salir'" 
        />
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Top Header -->
      <header class="top-header">
        <div class="breadcrumb">
          <h2>{{ currentRouteName }}</h2>
        </div>
        
        <div class="tenant-selector" v-if="tenantStore.availableTenants.length > 0">
          <i class="pi pi-building text-slate-400 mr-2"></i>
          <select 
            v-model="tenantStore.activeTenantId" 
            @change="handleTenantChange($event)"
            class="tenant-dropdown"
          >
            <option v-for="tenant in tenantStore.availableTenants" :key="tenant.id" :value="tenant.id">
              {{ tenant.name }}
            </option>
          </select>
          <span class="tenant-badge" :class="tenantBadgeClass">
            {{ tenantStore.activeTenant?.slug === 'plaza_mayor' ? 'PM' : 'CP' }}
          </span>
        </div>
      </header>

      <!-- Page View -->
      <main class="page-container">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { pb, getActiveUser } from '../services/pb';
import { useTenantStore } from '../stores/tenant';
import { usePermissionsStore } from '../stores/permissions';
import Button from 'primevue/button';

const router = useRouter();
const route = useRoute();
const tenantStore = useTenantStore();
const permissionsStore = usePermissionsStore();

const isSidebarCollapsed = ref(false);
const user = getActiveUser();

const userInitials = computed(() => {
  const name = user?.name || user?.username || 'U';
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
  return tenantStore.activeTenant?.slug === 'plaza_mayor' ? 'badge-pm' : 'badge-cp';
});

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const handleTenantChange = async (event: any) => {
  tenantStore.setActiveTenant(event.target.value);
  await permissionsStore.loadPermissions();
};

const handleLogout = () => {
  pb.authStore.clear();
  permissionsStore.clearPermissions();
  router.push({ name: 'login' });
};

onMounted(async () => {
  if (pb.authStore.isValid) {
    await tenantStore.fetchTenants();
    await permissionsStore.loadPermissions();
  }
});
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f8fafc;
}

/* Sidebar Styles */
.sidebar {
  width: 260px;
  background-color: #0f172a;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  border-right: 1px solid #1e293b;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  border-bottom: 1px solid #1e293b;
}

.logo-box {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-weight: 900;
  color: white;
  font-size: 1.2rem;
  letter-spacing: 1px;
}

.sidebar-toggle {
  color: #94a3b8 !important;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 0.75rem;
}

.nav-item:hover {
  background-color: #1e293b;
  color: #f8fafc;
}

.nav-item.active {
  background-color: #10b981;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
}

.nav-item i {
  font-size: 1.2rem;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  color: white;
}

.details {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #f8fafc;
}

.role {
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.logout-btn {
  width: 100%;
  justify-content: flex-start;
  font-weight: bold;
}

.sidebar.collapsed .logout-btn {
  justify-content: center;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.top-header {
  height: 70px;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.breadcrumb h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
}

.tenant-selector {
  display: flex;
  align-items: center;
  background-color: #f1f5f9;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
}

.mr-2 {
  margin-right: 0.5rem;
}

.text-slate-400 {
  color: #94a3b8;
}

.tenant-dropdown {
  background: transparent;
  border: none;
  outline: none;
  font-weight: 700;
  color: #334155;
  font-size: 0.9rem;
  cursor: pointer;
  appearance: none;
  padding-right: 1.5rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.2rem center;
  background-size: 1rem;
}

.tenant-badge {
  margin-left: 1rem;
  font-size: 0.7rem;
  font-weight: 900;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.badge-pm {
  background-color: #dbeafe;
  color: #1e3a8a;
}

.badge-cp {
  background-color: #fce7f3;
  color: #831843;
}

.page-container {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
</style>
