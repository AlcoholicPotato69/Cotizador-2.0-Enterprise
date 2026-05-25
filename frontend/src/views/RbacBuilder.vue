<template>
  <div class="rbac-builder">
    <div class="view-header mb-4">
      <h1 class="title">Administración de Roles y Permisos</h1>
      <p class="subtitle">Gobernanza centralizada para el Tenant Activo. Arquitectura Permission-First.</p>
    </div>

    <!-- Integración del Simulador -->
    <PermissionSimulator class="mb-4" />

    <div class="grid">
      <!-- Roles List -->
      <div class="col-12 lg:col-4">
        <div class="card h-full">
          <div class="flex justify-content-between align-items-center mb-3">
             <h3 class="m-0">Roles del Tenant</h3>
             <Button icon="pi pi-plus" size="small" outlined aria-label="Nuevo Rol" />
          </div>
          
          <ul class="list-none p-0 m-0">
             <li v-for="r in roles" :key="r.id" class="p-3 border-bottom flex justify-content-between align-items-center hover-bg cursor-pointer" :class="{'bg-blue-50 border-blue-200': selectedRole?.id === r.id}" @click="selectRole(r)">
                <div>
                   <span class="font-bold block text-slate-800">{{ r.name }}</span>
                   <span class="text-xs text-slate-500">{{ r.description || 'Sin descripción' }}</span>
                </div>
                <i class="pi pi-chevron-right text-slate-400"></i>
             </li>
             <li v-if="roles.length === 0" class="p-3 text-center text-slate-400 text-sm">
               No hay roles configurados.
             </li>
          </ul>
        </div>
      </div>

      <!-- Permission Assignment -->
      <div class="col-12 lg:col-8">
        <div class="card h-full">
           <div v-if="!selectedRole" class="flex align-items-center justify-content-center h-full text-slate-400">
             Seleccione un rol de la izquierda para administrar sus permisos.
           </div>
           <div v-else>
              <div class="flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                 <div>
                   <h3 class="m-0 text-slate-800">{{ selectedRole.name }}</h3>
                   <span class="text-xs text-slate-500">Marque las casillas para asignar permisos atómicos.</span>
                 </div>
                 <Button label="Guardar Configuración" icon="pi pi-save" :loading="saving" @click="savePermissions" />
              </div>

              <!-- Permission Tree grouped by Module -->
              <div v-for="(perms, module) in groupedPermissions" :key="module" class="mb-4">
                 <h4 class="uppercase text-xs font-bold text-slate-500 border-bottom pb-1 mb-2">{{ module }}</h4>
                 <div class="grid">
                    <div class="col-12 lg:col-6" v-for="p in perms" :key="p.id">
                       <div class="flex align-items-center mb-2">
                         <!-- Custom Checkbox for simplicity, ideally PrimeVue Checkbox -->
                         <input type="checkbox" :id="p.id" :value="p.id" v-model="selectedPermissionIds" class="mr-2 cursor-pointer" style="width:1.2rem; height:1.2rem;" />
                         <label :for="p.id" class="cursor-pointer text-sm font-mono">{{ p.key }}</label>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { pb } from '../services/pb';
import { useTenantStore } from '../stores/tenant';
import { useNotificationStore } from '../stores/notificationStore';
import PermissionSimulator from './PermissionSimulator.vue';
import Button from 'primevue/button';

const tenantStore = useTenantStore();
const notificationStore = useNotificationStore();
const roles = ref<any[]>([]);
const allPermissions = ref<any[]>([]);
const selectedRole = ref<any>(null);
const selectedPermissionIds = ref<string[]>([]);
const saving = ref(false);

onMounted(async () => {
  if (!tenantStore.activeTenantId) return;
  
  // Load roles for active tenant
  roles.value = await pb.collection('rbac_roles').getFullList({
    filter: `tenant = "${tenantStore.activeTenantId}"`
  });

  // Load all available atomic permissions
  allPermissions.value = await pb.collection('rbac_permissions').getFullList({
    filter: `active = true`
  });
});

const selectRole = async (role: any) => {
  selectedRole.value = role;
  selectedPermissionIds.value = [];
  
  // Load existing assigned permissions for this role
  const rolePerms = await pb.collection('rbac_role_permissions').getFullList({
    filter: `role = "${role.id}"`
  });
  
  selectedPermissionIds.value = rolePerms.map((rp: any) => rp.permission);
};

const groupedPermissions = computed(() => {
  const groups: Record<string, any[]> = {};
  allPermissions.value.forEach(p => {
    if (!groups[p.module]) groups[p.module] = [];
    groups[p.module].push(p);
  });
  return groups;
});

const savePermissions = async () => {
  saving.value = true;
  try {
    // Muy simplificado: Borrar todos y recrear (En producción optimizar delta)
    const existing = await pb.collection('rbac_role_permissions').getFullList({ filter: `role = "${selectedRole.value.id}"` });
    for (const ex of existing) {
       await pb.collection('rbac_role_permissions').delete(ex.id);
    }
    
    for (const pid of selectedPermissionIds.value) {
       await pb.collection('rbac_role_permissions').create({
         role: selectedRole.value.id,
         permission: pid
       });
    }

    // Auditoría
    await pb.collection('admin_audit_log').create({
       tenant: tenantStore.activeTenantId,
       user: (pb as any).authStore?.model?.id || 'system',
       action: 'ROLE_PERMISSIONS_UPDATE',
       entity_type: 'rbac_roles',
       entity_id: selectedRole.value.id,
       description: `Permisos actualizados para rol ${selectedRole.value.name}`
    });

    notificationStore.addNotification({
      type: 'success',
      message: 'Permisos guardados y auditados exitosamente.',
      domainEvent: 'PERMISSIONS_UPDATED'
    });
  } catch (e) {
    console.error(e);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.rbac-builder { display: flex; flex-direction: column; gap: 1rem; }
.card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
.title { margin: 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.subtitle { margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #64748b; }
.border-bottom { border-bottom: 1px solid #e2e8f0; }
.hover-bg:hover { background-color: #f8fafc; }
.cursor-pointer { cursor: pointer; }

/* Grid Utils */
.grid { display: flex; flex-wrap: wrap; margin: -1rem; }
.col-12 { padding: 1rem; width: 100%; }
@media (min-width: 1024px) { 
  .lg\:col-4 { width: 33.333333%; }
  .lg\:col-6 { width: 50%; }
  .lg\:col-8 { width: 66.666667%; }
}
.flex { display: flex; }
.flex-column { flex-direction: column; }
.align-items-center { align-items: center; }
.justify-content-between { justify-content: space-between; }
.justify-content-center { justify-content: center; }
.m-0 { margin: 0; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.pb-1 { padding-bottom: 0.25rem; }
.pb-3 { padding-bottom: 0.75rem; }
.p-0 { padding: 0; }
.p-3 { padding: 0.75rem; }
.mr-2 { margin-right: 0.5rem; }
.block { display: block; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.font-bold { font-weight: 700; }
.font-mono { font-family: monospace; }
.uppercase { text-transform: uppercase; }
.h-full { height: 100%; }
.list-none { list-style: none; }
.text-center { text-align: center; }
.text-slate-800 { color: #1e293b; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.bg-blue-50 { background-color: #eff6ff; }
.border-blue-200 { border-color: #bfdbfe; }
</style>
