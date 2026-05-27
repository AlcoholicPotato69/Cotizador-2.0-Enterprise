<template>
  <div class="h-full flex flex-col md:flex-row bg-surface-50 dark:bg-surface-950 overflow-hidden border border-surface-200 dark:border-surface-800 rounded-2xl">
    <div class="w-full md:w-64 border-r border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 flex flex-col p-4 flex-shrink-0 z-10 shadow-sm">
      <div class="mb-6 flex items-center justify-between">
        <h3 class="font-bold text-surface-900 dark:text-surface-0 m-0">Expediente 360</h3>
        <DsTag v-if="entityId" severity="info" :value="entityId.substring(0, 6)" class="font-mono text-[10px]" />
      </div>

      <div class="flex-1 space-y-2 overflow-y-auto pr-2">
        <button
          v-for="(node, index) in nodes"
          :key="node.id"
          :disabled="!canAccess(node.permission)"
          class="w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all duration-200 group relative"
          :class="{
            'bg-primary-500 text-white shadow-md transform scale-[1.02]': activeNode === node.id,
            'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300': activeNode !== node.id && canAccess(node.permission),
            'opacity-50 cursor-not-allowed text-surface-400 dark:text-surface-600': !canAccess(node.permission),
          }"
          @click="selectNode(node)"
        >
          <div
            v-if="index !== nodes.length - 1"
            class="absolute left-6 top-10 w-[2px] h-6 bg-surface-200 dark:bg-surface-700 -z-10 hidden md:block"
          ></div>

          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            :class="activeNode === node.id ? 'bg-surface-0/20 text-white' : 'bg-surface-100 dark:bg-surface-800 text-primary-500'"
          >
            <i :class="node.icon" class="text-sm"></i>
          </div>

          <div class="flex-1">
            <div class="font-bold text-sm tracking-tight">{{ node.label }}</div>
            <div
              v-if="!canAccess(node.permission)"
              class="text-[10px] uppercase font-bold tracking-wider mt-0.5"
              :class="activeNode === node.id ? 'text-primary-100' : 'text-surface-500'"
            >
              <i class="pi pi-lock mr-1"></i> Bloqueado
            </div>
          </div>

          <i
            v-if="canAccess(node.permission)"
            class="pi pi-chevron-right text-xs opacity-0 transition-opacity"
            :class="{ 'opacity-100': activeNode === node.id || (canAccess(node.permission) && activeNode !== node.id) }"
          ></i>
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto relative bg-surface-50/50 dark:bg-surface-950/50">
      <Transition name="fade-slide" mode="out-in">
        <component
          :is="activeComponent"
          :key="activeNode"
          :entity-id="entityId"
          :entity-type="entityType"
          class="h-full w-full"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, shallowRef, watch } from 'vue';
import { hasPermission } from '../../app/access-context';
import DsTag from './DsTag.vue';

const props = defineProps<{
  entityId: string;
  entityType: 'client' | 'document' | 'quote' | 'contract' | 'agreement' | 'invoice' | 'payment' | 'audit';
}>();

const componentMap: Record<string, unknown> = {
  client: defineAsyncComponent(() => import('../../views/ClientFileView.vue')),
  document: defineAsyncComponent(() => import('../../views/DocReqBuilder.vue')),
  quote: defineAsyncComponent(() => import('../../views/QuoteFileView.vue')),
  contract: defineAsyncComponent(() => import('../../views/ContractDossier.vue')),
  agreement: defineAsyncComponent(() => import('../../views/AgreementDossier.vue')),
  invoice: defineAsyncComponent(() => import('../../views/FinancialDossier.vue')),
  payment: defineAsyncComponent(() => import('../../views/PaymentsView.vue')),
  audit: defineAsyncComponent(() => import('../../views/AuditLogView.vue')),
};

type PermissionRule = string | string[];

interface DossierNode {
  id: 'client' | 'document' | 'quote' | 'contract' | 'agreement' | 'invoice' | 'payment' | 'audit';
  label: string;
  icon: string;
  permission: PermissionRule;
  component: unknown;
}

const nodes: DossierNode[] = [
  { id: 'client', label: 'Cliente', icon: 'pi pi-user', permission: ['clients.read', 'clients.view'], component: componentMap.client },
  { id: 'document', label: 'Documentos', icon: 'pi pi-folder-open', permission: ['documents.read', 'documents.view', 'files.read'], component: componentMap.document },
  { id: 'quote', label: 'Cotizaciones', icon: 'pi pi-calculator', permission: ['quotes.read', 'quotes.view'], component: componentMap.quote },
  { id: 'contract', label: 'Contratos', icon: 'pi pi-file-pdf', permission: ['contracts.read', 'contracts.view'], component: componentMap.contract },
  { id: 'agreement', label: 'Convenios', icon: 'pi pi-handshake', permission: ['agreements.read', 'agreements.view'], component: componentMap.agreement },
  { id: 'invoice', label: 'Facturas', icon: 'pi pi-money-bill', permission: 'finance.invoices.view', component: componentMap.invoice },
  { id: 'payment', label: 'Pagos', icon: 'pi pi-wallet', permission: 'finance.payments.view', component: componentMap.payment },
  { id: 'audit', label: 'Auditoria', icon: 'pi pi-history', permission: ['audit.read', 'audit.view'], component: componentMap.audit },
];

const activeNode = ref<DossierNode['id']>(props.entityType || 'client');
const activeComponent = shallowRef<unknown>(componentMap[activeNode.value] || componentMap.client);

const canAccess = (permission: PermissionRule): boolean => hasPermission(permission);

const selectNode = (node: DossierNode): void => {
  if (!canAccess(node.permission)) {
    return;
  }

  activeNode.value = node.id;
  activeComponent.value = node.component;
};

watch(
  () => props.entityType,
  (newEntityType) => {
    const node = nodes.find((entry) => entry.id === newEntityType);
    if (!node || !canAccess(node.permission)) {
      return;
    }

    activeNode.value = node.id;
    activeComponent.value = node.component;
  },
);
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

