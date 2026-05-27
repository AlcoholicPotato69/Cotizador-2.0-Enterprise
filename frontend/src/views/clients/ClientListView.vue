<template>
  <div class="space-y-6">
    <DsPageHeader title="Catálogo de Clientes" subtitle="Administración y prospección centralizada" :breadcrumbs="[{label: 'Inicio', to: '/'}, {label: 'Clientes', to: '/clients'}]">
      <template #actions>
        <DsActionBar>
          <DsButton v-if="permissions.can('client.create')" variant="primary" @click="router.push('/clients/new')">Nuevo Cliente</DsButton>
        </DsActionBar>
      </template>
    </DsPageHeader>

    <div class="px-6">
      <DsSearchBar placeholder="Buscar por RFC o Razón Social..." @search="onSearch">
        <template #filters>
          <DsSelect :options="['Todos', 'Activos', 'Pendientes']" placeholder="Estado" />
        </template>
      </DsSearchBar>

      <DsTable :data="clientStore.clients" :loading="clientStore.loading" class="mt-4">
        <template #default>
          <DsColumn field="rfc" header="RFC" />
          <DsColumn field="name" header="Nombre / Razón Social" />
          <DsColumn field="type" header="Tipo">
            <template #body="slotProps">
              <span class="capitalize">{{ slotProps.data.type }}</span>
            </template>
          </DsColumn>
          <DsColumn field="status" header="Estado">
            <template #body="slotProps">
              <DsStatusBadge :status="slotProps.data.status" />
            </template>
          </DsColumn>
          <DsColumn header="Acciones">
            <template #body="slotProps">
              <DsButton variant="ghost" size="sm" @click="router.push(`/clients/${slotProps.data.id}`)">Expediente</DsButton>
            </template>
          </DsColumn>
        </template>
      </DsTable>
      
      <DsPagination :first="0" :rows="10" :totalRecords="45" class="mt-4" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePermissionsStore } from '../../stores/permissionsStore';
import { useClientStore } from '../../stores/clientStore';
import DsPageHeader from '../../components/ui/DsPageHeader.vue';
import DsActionBar from '../../components/ui/DsActionBar.vue';
import DsButton from '../../components/ui/DsButton.vue';
import DsSearchBar from '../../components/ui/DsSearchBar.vue';
import DsSelect from '../../components/ui/DsSelect.vue';
import DsTable from '../../components/ui/DsTable.vue';
import DsStatusBadge from '../../components/ui/DsStatusBadge.vue';
import DsPagination from '../../components/ui/DsPagination.vue';

const router = useRouter();
const permissions = usePermissionsStore();
const clientStore = useClientStore();

onMounted(() => {
    clientStore.fetchClients();
});

function onSearch() { /* Searching for q */ }
</script>

