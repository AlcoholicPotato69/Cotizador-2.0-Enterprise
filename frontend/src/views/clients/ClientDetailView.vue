<template>
  <div class="space-y-6 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
    <!-- 360 View Header -->
    <DsPageHeader 
      :title="clientStore.currentClient?.name || 'Cargando...'" 
      :subtitle="'RFC: ' + (clientStore.currentClient?.rfc || '')" 
      :status="clientStore.currentClient?.status"
      :breadcrumbs="[{label: 'Inicio', to: '/'}, {label: 'Clientes', to: '/clients'}, {label: clientStore.currentClient?.name || 'Expediente', to: ''}]"
    >
      <template #actions>
        <DsActionBar>
          <DsButton v-if="permissions.can('client.update')" variant="outline">Editar Datos</DsButton>
          <DsButton v-if="permissions.can('client.delete')" variant="danger">Suspender</DsButton>
        </DsActionBar>
      </template>
    </DsPageHeader>

    <!-- Tab Navigation -->
    <div class="px-6 flex-1 flex flex-col overflow-hidden">
      <DsTabs v-model="activeTab" :tabs="tabs" class="shrink-0" />
      
      <!-- Tab Content Area -->
      <div class="flex-1 overflow-y-auto py-6">
        <!-- GENERAL -->
        <div v-if="activeTab === 'general'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DsCard>
            <template #header>Información de Contacto</template>
            <div class="space-y-4 text-sm">
              <div class="grid grid-cols-3 gap-2"><span class="text-surface-500 font-medium">Email</span><span class="col-span-2">{{ clientStore.currentClient?.email }}</span></div>
              <div class="grid grid-cols-3 gap-2"><span class="text-surface-500 font-medium">Teléfono</span><span class="col-span-2">{{ clientStore.currentClient?.phone }}</span></div>
            </div>
          </DsCard>
        </div>
        
        <!-- DOCUMENTOS -->
        <div v-if="activeTab === 'documents'" class="space-y-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold">Auditoría Documental ({{ clientStore.currentClient?.type === 'moral' ? 'Persona Moral' : 'Persona Física' }})</h3>
            <DsButton v-if="permissions.can('client.documents.upload')" size="sm" variant="outline">Subir Documento</DsButton>
          </div>
          
          <!-- Document Grid (Mock) -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 border rounded-lg bg-surface-0 flex items-center justify-between">
               <span class="text-sm font-medium">1. Constancia Fiscal</span>
               <DsStatusBadge status="approved" />
            </div>
            <div class="p-4 border rounded-lg bg-surface-0 flex items-center justify-between">
               <span class="text-sm font-medium">2. Acta Constitutiva</span>
               <DsStatusBadge status="pending" />
            </div>
            <div class="p-4 border rounded-lg bg-surface-0 flex items-center justify-between opacity-50">
               <span class="text-sm font-medium">3. Poder Representante</span>
               <span class="text-xs text-red-500 font-bold">FALTANTE</span>
            </div>
          </div>
        </div>
        
        <!-- INFORMACIÓN BANCARIA -->
        <div v-if="activeTab === 'banking'">
          <div v-if="permissions.can('client.banking.read')" class="max-w-2xl">
             <DsCard>
               <template #header>Estatus Financiero y Conciliación</template>
               <div class="space-y-4">
                 <DsFormField label="Referencia Bancaria Única">
                   <div class="flex gap-2">
                     <input type="text" value="PM-2026-XAXX0" readonly class="flex-1 rounded-md border border-surface-300 bg-surface-100 px-3 py-2 text-sm font-mono" />
                     <DsButton v-if="permissions.can('client.banking.update')" variant="secondary">Asignar Referencia</DsButton>
                   </div>
                 </DsFormField>
               </div>
             </DsCard>
          </div>
          <DsEmptyState v-else title="Acceso Restringido" description="No posees los permisos (client.banking.read) para visualizar información financiera." />
        </div>
        
        <!-- ACTIVIDAD / TIMELINE -->
        <div v-if="activeTab === 'timeline'">
          <div class="pl-4 border-l-2 border-surface-200 dark:border-surface-700 space-y-6">
             <div class="relative">
               <div class="absolute -left-[21px] w-3 h-3 bg-primary-500 rounded-full mt-1"></div>
               <div class="text-sm">
                 <span class="font-bold">Expediente Aprobado</span> por Finanzas
                 <div class="text-xs text-surface-500">Hoy, 10:30 AM</div>
               </div>
             </div>
             <div class="relative">
               <div class="absolute -left-[21px] w-3 h-3 bg-surface-400 rounded-full mt-1"></div>
               <div class="text-sm">
                 <span class="font-bold">Constancia Fiscal validada</span> mediante SAT Web Service
                 <div class="text-xs text-surface-500">Ayer, 16:45 PM</div>
               </div>
             </div>
          </div>
        </div>

        <!-- RELACIONES FUTURAS (PREPARADAS) -->
        <div v-if="['quotes', 'contracts', 'payments', 'invoices'].includes(activeTab)">
          <DsEmptyState :title="`Módulo en construcción`" description="Esta pestaña estará disponible tras la estabilización de los módulos correspondientes (Fases 4.4 - 4.8)." />
        </div>
        
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useClientStore } from '../../stores/clientStore';
import { usePermissionsStore } from '../../stores/permissionsStore';
import DsPageHeader from '../../components/ui/DsPageHeader.vue';
import DsActionBar from '../../components/ui/DsActionBar.vue';
import DsButton from '../../components/ui/DsButton.vue';
import DsTabs from '../../components/ui/DsTabs.vue';
import DsCard from '../../components/ui/DsCard.vue';
import DsStatusBadge from '../../components/ui/DsStatusBadge.vue';
import DsEmptyState from '../../components/ui/DsEmptyState.vue';
import DsFormField from '../../components/ui/DsFormField.vue';

const route = useRoute();
const clientStore = useClientStore();
const permissions = usePermissionsStore();

const activeTab = ref('general');
const tabs = [
  { label: 'General', value: 'general' },
  { label: 'Documentos', value: 'documents' },
  { label: 'Información Bancaria', value: 'banking' },
  { label: 'Cotizaciones', value: 'quotes' },
  { label: 'Contratos', value: 'contracts' },
  { label: 'Pagos', value: 'payments' },
  { label: 'Facturas', value: 'invoices' },
  { label: 'Actividad', value: 'timeline' }
];

onMounted(() => {
  clientStore.fetchClientById(route.params.id as string);
});
</script>