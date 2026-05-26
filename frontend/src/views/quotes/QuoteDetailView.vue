<template>
  <div v-if="quoteStore.loading && !quote" class="flex justify-center p-12">
    <DsProgressSpinner />
  </div>
  <div v-else-if="quote" class="p-8 pb-32 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <DsButton icon="pi pi-arrow-left" text rounded @click="router.push('/quotes')" class="text-surface-400 p-0 w-8 h-8" />
          <h1 class="text-4xl font-bold font-mono tracking-tight text-surface-0 dark:text-surface-900">{{ quote.folio }}</h1>
          <span :class="getStatusClass(quote.status)" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ml-2">
            {{ quote.status }}
          </span>
          <span class="px-3 py-1 rounded-full bg-surface-800 text-surface-300 text-xs font-bold font-mono ml-2">
            v{{ quote.current_version }}
          </span>
        </div>
        <p class="text-surface-400 pl-11">
          Cliente: <span class="text-surface-0 dark:text-surface-900 font-medium">{{ getClientName(quote.client_id) }}</span>
        </p>
      </div>
      <div class="flex gap-2">
        <DsButton v-if="canUpdate" label="Guardar Snapshot" icon="pi pi-camera" outlined severity="info" @click="showSnapshot = true" />
        <DsButton v-if="canUpdate && quote.status !== 'APPROVED'" label="Aprobar" icon="pi pi-check" severity="success" @click="changeStatus('APPROVED')" />
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="glass-panel p-6 rounded-2xl border border-surface-700/50 flex flex-col gap-1">
        <span class="text-surface-400 text-sm font-medium uppercase tracking-wider">Subtotal</span>
        <span class="text-2xl text-surface-0 dark:text-surface-900">${{ quote.subtotal?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0.00' }}</span>
      </div>
      <div class="glass-panel p-6 rounded-2xl border border-surface-700/50 flex flex-col gap-1">
        <span class="text-surface-400 text-sm font-medium uppercase tracking-wider">IVA (16%)</span>
        <span class="text-2xl text-surface-0 dark:text-surface-900">${{ quote.tax_amount?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0.00' }}</span>
      </div>
      <div class="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-900/10 flex flex-col gap-1">
        <span class="text-emerald-400 text-sm font-bold uppercase tracking-wider">Total</span>
        <span class="text-3xl font-bold text-surface-0 dark:text-surface-900">${{ quote.total_amount?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0.00' }}</span>
      </div>
    </div>

    <!-- Items -->
    <div class="glass-panel rounded-2xl border border-surface-700/50 overflow-hidden mb-8">
      <div class="p-4 border-b border-surface-700/50 flex justify-between items-center bg-surface-800/30">
        <h2 class="text-xl font-bold text-surface-0 dark:text-surface-900">Partidas</h2>
        <DsButton v-if="canUpdate" label="Agregar" icon="pi pi-plus" size="small" @click="openItemModal()" class="bg-surface-700 hover:bg-surface-600 border-none" />
      </div>
      <DsTable :value="quoteStore.currentItems" class="p-datatable-sm">
        <template #empty>
          <div class="p-4 text-center text-surface-400">No hay partidas agregadas.</div>
        </template>
        <DsColumn field="description" header="Descripción"></DsColumn>
        <DsColumn field="type" header="Tipo">
          <template #body="sp">
            <span class="text-xs uppercase px-2 py-1 bg-surface-800 rounded">{{ sp.data.type }}</span>
          </template>
        </DsColumn>
        <DsColumn field="quantity" header="Cant."></DsColumn>
        <DsColumn field="unit_price" header="P.Unitario">
          <template #body="sp">${{ sp.data.unit_price.toLocaleString('es-MX') }}</template>
        </DsColumn>
        <DsColumn field="total_price" header="Importe">
          <template #body="sp">
            <span class="font-bold">${{ sp.data.total_price.toLocaleString('es-MX') }}</span>
          </template>
        </DsColumn>
        <DsColumn header="" alignFrozen="right">
          <template #body="sp">
            <div v-if="canUpdate" class="flex gap-2 justify-end">
              <DsButton icon="pi pi-pencil" text rounded size="small" @click="openItemModal(sp.data)" />
              <DsButton icon="pi pi-trash" text rounded severity="danger" size="small" @click="removeItem(sp.data.id)" />
            </div>
          </template>
        </DsColumn>
      </DsTable>
    </div>

    <!-- History / Versions Tabs -->
    <TabView class="glass-panel rounded-2xl border border-surface-700/50 p-2">
      <TabPanel header="Versiones (Snapshots)" value="0">
        <DsTable :value="versions" class="p-datatable-sm">
          <template #empty>Sin versiones previas.</template>
          <DsColumn field="version_number" header="v.">
            <template #body="sp">v{{ sp.data.version_number }}</template>
          </DsColumn>
          <DsColumn field="change_notes" header="Notas"></DsColumn>
          <DsColumn field="created" header="Fecha">
            <template #body="sp">{{ new Date(sp.data.created).toLocaleString() }}</template>
          </DsColumn>
          <DsColumn header="Acciones">
            <template #body="sp">
               <DsButton icon="pi pi-eye" text rounded @click="viewSnapshot(sp.data)" />
            </template>
          </DsColumn>
        </DsTable>
      </TabPanel>
      <TabPanel header="Historial Estatus" value="1">
        <DsTable :value="history" class="p-datatable-sm">
          <template #empty>Sin cambios de estatus.</template>
          <DsColumn field="old_status" header="De"></DsColumn>
          <DsColumn field="new_status" header="A"></DsColumn>
          <DsColumn field="reason" header="Razón"></DsColumn>
          <DsColumn field="created" header="Fecha">
            <template #body="sp">{{ new Date(sp.data.created).toLocaleString() }}</template>
          </DsColumn>
        </DsTable>
      </TabPanel>
    </TabView>

    <!-- Item Modal -->
    <DsModal v-model:visible="showItemModal" :header="editingItem.id ? 'Editar Partida' : 'Nueva Partida'" :modal="true" class="w-full max-w-lg glass-panel">
      <div class="flex flex-col gap-4 mt-4">
        <div class="flex flex-col gap-2">
          <label class="text-surface-300 text-sm">Tipo</label>
          <Dropdown v-model="editingItem.type" :options="['space', 'service', 'product', 'discount']" class="w-full" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-300 text-sm">Descripción</label>
          <DsInput v-model="editingItem.description" class="w-full" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-surface-300 text-sm">Cantidad</label>
            <DsInputNumber v-model="editingItem.quantity" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-surface-300 text-sm">Precio Unitario</label>
            <DsInputNumber v-model="editingItem.unit_price" mode="currency" currency="MXN" class="w-full" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-300 text-sm font-bold text-emerald-400">Total Importe</label>
          <DsInputNumber v-model="editingItem.total_price" mode="currency" currency="MXN" class="w-full bg-surface-900" readonly placeholder="Calculado por backend" />
        </div>
      </div>
      <template #footer>
        <DsButton label="Cancelar" text @click="showItemModal = false" />
        <DsButton label="Guardar" icon="pi pi-save" @click="saveItem" :loading="isSavingItem" class="bg-emerald-600 border-none" />
      </template>
    </DsModal>

    <!-- Snapshot Modal -->
    <DsModal v-model:visible="showSnapshot" header="Generar Snapshot (Nueva Versión)" :modal="true" class="w-full max-w-md glass-panel">
      <div class="flex flex-col gap-4 mt-4">
        <p class="text-sm text-surface-400">Esto creará una copia congelada inmutable de la cotización actual y aumentará la versión.</p>
        <div class="flex flex-col gap-2">
          <label class="text-surface-300 text-sm">Notas del cambio</label>
          <DsTextarea v-model="snapshotNotes" rows="3" class="w-full" placeholder="Ej: Se ajustó descuento por solicitud del cliente" />
        </div>
      </div>
      <template #footer>
        <DsButton label="Cancelar" text @click="showSnapshot = false" />
        <DsButton label="Congelar Versión" icon="pi pi-camera" @click="createSnapshot" severity="info" />
      </template>
    </DsModal>

    <!-- Delete Confirmation -->
    <DsConfirmDialog 
      v-model:visible="showDeleteConfirm" 
      title="Eliminar Partida" 
      message="¿Está seguro de eliminar esta partida?"
      @confirm="executeRemoveItem"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuoteStore } from '../../stores/quoteStore';
import { useClientStore } from '../../stores/clientStore';
import { quoteService, type QuoteItem } from '../../services/quoteService';
import { useAuthStore } from '../../stores/authStore';
import { usePermissionsStore } from '../../stores/permissionsStore';
import { useNotificationStore } from '../../stores/notificationStore';
import DsConfirmDialog from '../../components/ui/DsConfirmDialog.vue';

const route = useRoute();
const router = useRouter();
const quoteStore = useQuoteStore();
const clientStore = useClientStore();
const authStore = useAuthStore();
const permissionsStore = usePermissionsStore();
const notificationStore = useNotificationStore();

const canUpdate = computed(() => permissionsStore.can('quotes.update'));

const quote = computed(() => quoteStore.currentQuote);
const versions = ref<any[]>([]);
const history = ref<any[]>([]);

const showItemModal = ref(false);
const isSavingItem = ref(false);
const editingItem = ref<Partial<QuoteItem>>({});

const showDeleteConfirm = ref(false);
const itemToDelete = ref<string | null>(null);

const showSnapshot = ref(false);
const snapshotNotes = ref('');



onMounted(async () => {
  if (clientStore.clients.length === 0) {
    await clientStore.fetchClients();
  }
  const id = route.params.id as string;
  await quoteStore.fetchQuote(id);
  loadVersionsAndHistory();
});

const loadVersionsAndHistory = async () => {
  if (!quote.value) return;
  versions.value = await quoteService.getQuoteVersions(quote.value.id!);
  history.value = await quoteService.getQuoteHistory(quote.value.id!);
};

const getClientName = (id: string) => {
  const c = clientStore.clients.find((x: any) => x.id === id);
  return c ? c.name : 'Desconocido';
};

const getStatusClass = (status: string) => {
  const map: Record<string, string> = {
    DRAFT: 'bg-surface-800 text-surface-300',
    SENT: 'bg-amber-900/50 text-amber-400',
    APPROVED: 'bg-emerald-900/50 text-emerald-400',
    REJECTED: 'bg-red-900/50 text-red-400',
    EXPIRED: 'bg-red-900/50 text-red-400',
    CONTRACT_GENERATED: 'bg-indigo-900/50 text-indigo-400',
  };
  return map[status] || map.DRAFT;
};

const changeStatus = async (newStatus: string) => {
  if (!quote.value) return;
  try {
    await quoteStore.changeQuoteStatus(quote.value.id!, quote.value.status, newStatus, authStore.user?.id || '');
    loadVersionsAndHistory();
  } catch (e) { console.error(e); }
};

const openItemModal = (item?: QuoteItem) => {
  if (item) {
    editingItem.value = { ...item };
  } else {
    editingItem.value = { quote_id: quote.value!.id, type: 'service', quantity: 1, unit_price: 0, total_price: 0, description: '' };
  }
  showItemModal.value = true;
};

// El cálculo del total fue removido (Dumb UI). El Backend lo calcula al guardar.

const saveItem = async () => {
  isSavingItem.value = true;
  try {
    await quoteStore.saveItem(editingItem.value as QuoteItem);
    showItemModal.value = false;
  } catch(e) { console.error(e); }
  isSavingItem.value = false;
};

const removeItem = (id: string) => {
  itemToDelete.value = id;
  showDeleteConfirm.value = true;
};

const executeRemoveItem = async () => {
  if (itemToDelete.value) {
    try {
      await quoteStore.removeItem(itemToDelete.value);
      notificationStore.addNotification({
        type: 'success',
        message: 'Partida eliminada',
        domainEvent: 'QUOTE_ITEM_DELETED'
      });
    } catch(e) { 
      console.error(e); 
      notificationStore.addNotification({
        type: 'error',
        message: 'Error al eliminar partida',
        domainEvent: 'QUOTE_ITEM_DELETE_FAILED'
      });
    }
  }
};

const createSnapshot = async () => {
  if (!quote.value) return;
  try {
    const newVersion = (quote.value.current_version || 1) + 1;
    await quoteService.updateQuote(quote.value.id!, { current_version: newVersion }, true, snapshotNotes.value);
    quote.value.current_version = newVersion;
    showSnapshot.value = false;
    snapshotNotes.value = '';
    loadVersionsAndHistory();
  } catch(e) { console.error(e); }
};

const viewSnapshot = (snap: any) => {
  router.push(`/quotes/${quote.value!.id}/versions/${snap.version_number}`);
};
</script>

