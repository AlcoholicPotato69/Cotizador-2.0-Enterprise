<template>
  <div v-if="loading" class="flex justify-center p-12">
    <ProgressSpinner />
  </div>
  <DsDocumentViewer v-else-if="snapshotData" mimeType="application/pdf" @close="router.back()">
    <template #document>
      <!-- DsDocumentViewer Header Style -->
      <div class="p-8 border-b border-surface-200 flex justify-between items-start bg-surface-50 text-black">
        <div>
          <h2 class="text-3xl font-bold font-mono mb-1">{{ snapshotData.folio }}</h2>
          <span class="px-2 py-1 bg-surface-200 rounded text-xs font-bold uppercase text-surface-600">
            {{ snapshotData.status }}
          </span>
        </div>
        <div class="text-right text-surface-600 text-sm flex flex-col gap-1">
          <p><strong>Fecha:</strong> {{ new Date(snapshot?.created || Date.now()).toLocaleDateString() }}</p>
          <p><strong>Versión:</strong> {{ versionId }}</p>
          <p><strong>Cliente:</strong> {{ snapshotData.client_data?.razon_social || 'N/A' }}</p>
        </div>
      </div>

      <!-- DsDocumentViewer Body -->
      <div class="p-8 text-black flex-1">
        <h3 class="text-lg font-bold mb-4 border-b border-surface-200 pb-2">Conceptos Cotizados</h3>
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-surface-500 text-sm uppercase tracking-wider border-b border-surface-200">
              <th class="py-3 font-medium">Descripción</th>
              <th class="py-3 font-medium text-right">Cant.</th>
              <th class="py-3 font-medium text-right">P. Unitario</th>
              <th class="py-3 font-medium text-right">Importe</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in (snapshotData.items || [])" :key="idx" class="border-b border-surface-100 text-surface-800">
              <td class="py-4">{{ item.description }}</td>
              <td class="py-4 text-right">{{ item.quantity }}</td>
              <td class="py-4 text-right">${{ (item.unit_price || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</td>
              <td class="py-4 text-right font-medium">${{ (item.total_price || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</td>
            </tr>
            <tr v-if="!snapshotData.items || snapshotData.items.length === 0">
              <td colspan="4" class="py-8 text-center text-surface-400 italic">No se almacenaron items en este snapshot.</td>
            </tr>
          </tbody>
        </table>

        <!-- DsDocumentViewer Totals -->
        <div class="mt-8 flex justify-end">
          <div class="w-full md:w-1/2 lg:w-1/3 bg-surface-50 p-6 rounded-lg">
            <div class="flex justify-between mb-2 text-surface-600">
              <span>Subtotal</span>
              <span>${{ (snapshotData.financial_snapshot?.subtotal || snapshotData.subtotal || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div class="flex justify-between mb-2 text-red-500" v-if="snapshotData.financial_snapshot?.discounts">
              <span>Descuentos</span>
              <span>-${{ (snapshotData.financial_snapshot.discounts).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div class="flex justify-between mb-4 text-surface-600">
              <span>IVA (16%)</span>
              <span>${{ (snapshotData.financial_snapshot?.taxes || snapshotData.tax_amount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div class="flex justify-between pt-4 border-t border-surface-200 font-bold text-xl text-surface-900">
              <span>Total</span>
              <span>${{ (snapshotData.financial_snapshot?.total || snapshotData.total_amount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- DsDocumentViewer Footer -->
      <div class="p-8 border-t border-surface-200 text-center text-sm text-surface-400 bg-surface-50">
        <p>Documento generado por Cotizador PM - Este documento es un snapshot inmutable.</p>
        <p v-if="snapshot?.change_notes" class="mt-2 text-amber-600 font-medium">Nota de Cambio: {{ snapshot.change_notes }}</p>
      </div>
    </template>
    
    <template #metadata>
      <div>
        <label class="text-xs font-bold text-surface-500">Estado de Modificación</label>
        <div class="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">BLOQUEO INMUTABLE</div>
      </div>
      <div>
        <label class="text-xs font-bold text-surface-500">Hash SHA-256</label>
        <div class="mt-1 text-xs font-mono break-all bg-surface-50 dark:bg-surface-950 p-2 rounded border text-surface-400">
          {{ snapshot?.snapshot_hash || 'No hash generated' }}
        </div>
      </div>
      <div>
        <label class="text-xs font-bold text-surface-500">Tenant ID</label>
        <div class="mt-1 text-sm font-medium">{{ snapshotData?.tenant_id }}</div>
      </div>
      <div>
        <label class="text-xs font-bold text-surface-500">Creado Por</label>
        <div class="mt-1 text-sm font-medium text-emerald-500">{{ snapshot?.created_by }}</div>
      </div>
      <div>
        <label class="text-xs font-bold text-surface-500">Notas de Cambio</label>
        <div class="mt-1 text-sm text-surface-400">{{ snapshot?.change_notes || 'N/A' }}</div>
      </div>
    </template>
  </DsDocumentViewer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { pb } from '../../services/pb';
import DsDocumentViewer from '../../components/ui/DsDocumentViewer.vue';

const route = useRoute();
const router = useRouter();

const quoteId = route.params.id as string;
const versionId = route.params.versionId as string;

const loading = ref(true);
const snapshot = ref<any>(null);
const snapshotData = ref<any>(null);

onMounted(async () => {
  try {
    // We fetch the version specific snapshot
    // First, find the version matching the quoteId and version_number
    const records = await (pb.collection('quote_versions') as any).getList(1, 1, {
      filter: `quote_id = "${quoteId}" && version_number = ${versionId}`
    });
    
    if (records.items.length > 0) {
      snapshot.value = records.items[0];
      snapshotData.value = snapshot.value.snapshot_data;
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

/*
const printDoc = () => {
  window.print();
};
*/
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  .max-w-5xl, .max-w-5xl * {
    visibility: visible;
  }
  .max-w-5xl {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  .pi-arrow-left, .pi-print, button {
    display: none !important;
  }
}
</style>
