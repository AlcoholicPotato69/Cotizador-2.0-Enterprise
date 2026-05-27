<template>
  <div class="permission-simulator card">
    <div class="flex justify-content-between align-items-center mb-4">
       <h3><i class="pi pi-shield mr-2 text-blue-500"></i>Permission Simulator</h3>
       <p class="text-sm text-surface-500 dark:text-surface-400 m-0">Auditoría del Effective Permissions Engine</p>
    </div>

    <div class="grid">
      <!-- Filtros -->
      <div class="col-12 lg:col-4 border-right">
        <div class="flex flex-column gap-3">
           <div>
             <label class="block text-sm font-bold text-surface-700 dark:text-surface-200 mb-1">Seleccionar Usuario</label>
             <select v-model="selectedUser" class="w-full p-2 border-round border-1 border-surface-300 dark:border-surface-600" @change="runSimulation">
               <option value="">Seleccione...</option>
               <option v-for="u in users" :key="u.id" :value="u.id">{{ u.email }}</option>
             </select>
           </div>
           
           <div>
             <label class="block text-sm font-bold text-surface-700 dark:text-surface-200 mb-1">Tenant Activo (Contexto)</label>
             <select v-model="selectedTenant" class="w-full p-2 border-round border-1 border-surface-300 dark:border-surface-600" @change="runSimulation">
               <option v-for="t in tenants" :key="t.id" :value="t.id">{{ t.name }}</option>
             </select>
           </div>

           <DsButton label="Ejecutar Simulación" icon="pi pi-play" class="mt-2 w-full" :loading="loading" @click="runSimulation" />
        </div>
      </div>

      <!-- Resultados -->
      <div class="col-12 lg:col-8">
        <div v-if="!hasRun" class="flex align-items-center justify-content-center h-full text-surface-400 dark:text-surface-500">
           Seleccione un usuario y ejecute la simulación.
        </div>
        <div v-else>
           <div class="flex gap-4 mb-4">
             <div class="stat-box bg-surface-50 dark:bg-surface-950 border-1 border-surface-200 dark:border-surface-700 p-3 border-round flex-1 text-center">
               <span class="block text-xs text-surface-500 dark:text-surface-400 uppercase font-bold">Roles Heredados</span>
               <span class="text-2xl font-bold text-surface-800 dark:text-surface-100">{{ roles.length }}</span>
             </div>
             <div class="stat-box bg-primary-50 dark:bg-primary-900 border-1 border-blue-200 p-3 border-round flex-1 text-center">
               <span class="block text-xs text-surface-500 dark:text-surface-400 uppercase font-bold">Permisos Efectivos Totales</span>
               <span class="text-2xl font-bold text-blue-700">{{ effectivePerms.length }}</span>
             </div>
           </div>

           <h4 class="mb-2 text-surface-700 dark:text-surface-200">Matriz de Acceso Efectivo</h4>
           <div v-if="effectivePerms.length === 0" class="text-sm text-surface-500 dark:text-surface-400 p-3 bg-red-50 border-round">
              El usuario no tiene acceso a ningún módulo en este Tenant.
           </div>
           <div v-else class="permissions-grid">
              <div v-for="perm in effectivePerms" :key="perm" class="perm-tag">
                 <i class="pi pi-check-circle text-green-500 mr-2"></i> {{ perm }}
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { http } from '../api/http';
import { userService } from '../services/userService';
import { tenantService, type Tenant } from '../services/tenantService';
import type { User } from '../types/user';

const users = ref<User[]>([]);
const tenants = ref<Tenant[]>([]);
const selectedUser = ref('');
const selectedTenant = ref('');

const loading = ref(false);
const hasRun = ref(false);

const roles = ref<string[]>([]);
const effectivePerms = ref<string[]>([]);

onMounted(async () => {
  users.value = await userService.getUsers();
  tenants.value = await tenantService.getAccessibleTenants();
  if (tenants.value.length > 0) {
    selectedTenant.value = tenants.value[0].id;
  }
});

const runSimulation = async () => {
  if (!selectedUser.value || !selectedTenant.value) return;
  loading.value = true;
  
  try {
    // Buscar roles
    const userRolesRes = await http.get('/rbac_user_roles', {
      params: {
        filter: `user = "${selectedUser.value}" && tenant = "${selectedTenant.value}"`,
        expand: 'role'
      }
    });
    interface ExpandableRole { expand?: { role?: { name: string } } }
    const userRoles = userRolesRes.data?.data || userRolesRes.data || [];
    roles.value = userRoles.map((u: ExpandableRole) => u.expand?.role?.name).filter(Boolean) as string[];

    // Correr Motor Efectivo
    const permIds = new Set<string>();
    
    for (const ur of userRoles) {
      if (!ur.role) continue;
      const rpsRes = await http.get('/rbac_role_permissions', {
        params: {
          filter: `role = "${ur.role}"`,
          expand: 'permission'
        }
      });
      const rps = rpsRes.data?.data || rpsRes.data || [];
      interface ExpandablePerm { expand?: { permission?: { key: string } } }
      rps.forEach((rp: ExpandablePerm) => {
        if (rp.expand?.permission?.key) {
          permIds.add(rp.expand.permission.key);
        }
      });
    }

    // Add user-specific direct overrides if supported (not in base design but could be)
    
    effectivePerms.value = Array.from(permIds).sort();
    hasRun.value = true;
  } catch (e: unknown) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.card { background: var(--tenant-surface-0); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid var(--tenant-surface-200); }
.dark .card { background: var(--tenant-surface-900); border-color: var(--tenant-surface-700); }
.border-right { border-right: 1px solid #e2e8f0; }
.permissions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.5rem; }
.perm-tag { padding: 0.5rem; border: 1px solid var(--tenant-surface-200); border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; background: #f8fafc; }

.grid { display: flex; flex-wrap: wrap; margin: -1rem; }
.col-12 { padding: 1rem; width: 100%; }
@media (min-width: 1024px) { 
  .lg\:col-4 { width: 33.333333%; }
  .lg\:col-8 { width: 66.666667%; }
}
.flex { display: flex; }
.flex-column { flex-direction: column; }
.gap-3 { gap: 1rem; }
.gap-4 { gap: 1.5rem; }
.align-items-center { align-items: center; }
.justify-content-between { justify-content: space-between; }
.justify-content-center { justify-content: center; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1.5rem; }
.m-0 { margin: 0; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.block { display: block; }
.w-full { width: 100%; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.text-2xl { font-size: 1.5rem; }
.font-bold { font-weight: 700; }
.border-round { border-radius: 0.5rem; }
.border-1 { border-width: 1px; border-style: solid; }
.text-surface-700 { color: #334155; }
.text-surface-500 { color: #64748b; }
.text-surface-400 { color: #94a3b8; }
.text-slate-200 { color: #e2e8f0; }
.text-surface-800 { color: #1e293b; }
.text-blue-500 { color: #3b82f6; }
.text-blue-700 { color: #1d4ed8; }
.text-green-500 { color: #22c55e; }
.border-surface-300 { border-color: #cbd5e1; }
.border-surface-200 { border-color: #e2e8f0; }
.bg-surface-50 { background-color: #f8fafc; }
.bg-primary-50 { background-color: #eff6ff; }
.bg-red-50 { background-color: #fef2f2; }
.border-blue-200 { border-color: #bfdbfe; }
.flex-1 { flex: 1; }
.text-center { text-align: center; }
.uppercase { text-transform: uppercase; }
.h-full { height: 100%; }
</style>




