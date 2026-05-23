<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div class="flex items-center gap-3 mb-8">
      <Button icon="pi pi-arrow-left" text rounded @click="router.push('/quotes')" class="text-surface-400 p-0 w-8 h-8" />
      <div>
        <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
          Nueva Cotización
        </h1>
        <p class="text-surface-400 mt-1">Ingresa los datos iniciales para la cotización</p>
      </div>
    </div>

    <div v-if="!canCreate" class="p-6 bg-red-900/30 border border-red-500 text-red-200 rounded-xl flex items-center gap-4">
      <i class="pi pi-lock text-3xl text-red-400"></i>
      <div>
        <h3 class="font-bold text-lg">Acceso Denegado</h3>
        <p>No tienes los permisos necesarios (quotes.create) para generar nuevas cotizaciones.</p>
      </div>
    </div>

    <div v-else class="glass-panel p-8 rounded-2xl border border-surface-700/50">
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label class="text-surface-300 font-medium">Cliente *</label>
          <Dropdown v-model="newQuote.client_id" :options="clientStore.clients" optionLabel="razon_social" optionValue="id" placeholder="Selecciona un cliente" class="w-full bg-surface-800" filter />
          <small v-if="showErrors && !newQuote.client_id" class="text-red-400">El cliente es obligatorio.</small>
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-surface-300 font-medium">Notas Iniciales</label>
          <Textarea v-model="newQuote.notes" rows="4" class="w-full bg-surface-800" placeholder="Ej: Cotización base solicitada en junta de ventas..." />
        </div>

        <div class="flex justify-end gap-3 mt-4 pt-6 border-t border-surface-700/50">
          <Button label="Cancelar" icon="pi pi-times" text @click="router.push('/quotes')" />
          <Button label="Crear Cotización" icon="pi pi-check" @click="submit" :loading="isCreating" class="bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/30" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuoteStore } from '../../stores/quoteStore';
import { useClientStore } from '../../stores/clientStore';
import { useAuthStore } from '../../stores/authStore';
import { useTenantStore } from '../../stores/tenantStore';
import { usePermissionsStore } from '../../stores/permissionsStore';

const router = useRouter();
const quoteStore = useQuoteStore();
const clientStore = useClientStore();
const authStore = useAuthStore();
const tenantStore = useTenantStore();
const permissionsStore = usePermissionsStore();

const canCreate = computed(() => permissionsStore.can('quotes.create'));

const isCreating = ref(false);
const showErrors = ref(false);
const newQuote = ref({ client_id: '', notes: '' });

onMounted(async () => {
  if (clientStore.clients.length === 0) {
    await clientStore.fetchClients();
  }
});

const submit = async () => {
  showErrors.value = true;
  if (!newQuote.value.client_id) return;
  
  isCreating.value = true;
  try {
    const q = await quoteStore.addQuote({
      tenant_id: tenantStore.activeTenant?.id,
      client_id: newQuote.value.client_id,
      notes: newQuote.value.notes,
      created_by: authStore.user?.id
    });
    router.push(`/quotes/${q.id}`);
  } catch (e) {
    console.error('Error creating quote:', e);
  } finally {
    isCreating.value = false;
  }
};
</script>
