<template>
  <div class="flex flex-col h-full bg-surface-50 dark:bg-surface-950">
    <DsPageHeader 
      title="Tenant Administration Center" 
      subtitle="Gobernanza centralizada Multi-Tenant. (Configuration Over Code)"
      :breadcrumbs="[{label: 'Administración', to: '/admin'}, {label: 'TAC', to: '/admin'}]"
    />

    <div class="flex-1 p-6 overflow-hidden flex flex-col">
      <div class="bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
        <div class="border-b border-surface-200 dark:border-surface-800 px-4 pt-4">
          <div class="flex space-x-6 overflow-x-auto custom-scroll">
            <button 
              v-for="tab in availableTabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'pb-4 px-2 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap',
                activeTab === tab.id 
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
              ]"
            >
              <i :class="[tab.icon, 'mr-2']"></i>
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 custom-scroll">
           <!-- F.1 -->
           <RbacBuilder v-if="activeTab === 'rbac'" />
           <SpaceBuilder v-if="activeTab === 'spaces'" />
           <DocReqBuilder v-if="activeTab === 'docs'" />
           
           <!-- F.2 -->
           <PromotionsBuilder v-if="activeTab === 'promotions'" />
           <PricingBuilder v-if="activeTab === 'pricing'" />
           <TaxBuilder v-if="activeTab === 'taxes'" />
           <TemplateBuilder v-if="activeTab === 'templates'" />
           <BrandingBuilder v-if="activeTab === 'branding'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePermissionsStore } from '../stores/permissionsStore';
import RbacBuilder from './RbacBuilder.vue';
import SpaceBuilder from './SpaceBuilder.vue';
import DocReqBuilder from './DocReqBuilder.vue';
import PromotionsBuilder from './PromotionsBuilder.vue';
import PricingBuilder from './PricingBuilder.vue';
import TaxBuilder from './TaxBuilder.vue';
import TemplateBuilder from './TemplateBuilder.vue';
import BrandingBuilder from './BrandingBuilder.vue';

const permStore = usePermissionsStore();
const activeTab = ref('rbac');

const allTabs = [
  { id: 'rbac', label: 'Roles & Permisos', icon: 'pi pi-shield', permission: 'roles.manage' },
  { id: 'spaces', label: 'Espacios Físicos', icon: 'pi pi-map', permission: 'spaces.manage' },
  { id: 'docs', label: 'Req. Documentales', icon: 'pi pi-file', permission: 'config.manage' },
  { id: 'promotions', label: 'Promotions', icon: 'pi pi-star', permission: 'promotions.read' },
  { id: 'pricing', label: 'Pricing Engine', icon: 'pi pi-money-bill', permission: 'pricing.read' },
  { id: 'taxes', label: 'Tax Rules', icon: 'pi pi-percentage', permission: 'taxes.read' },
  { id: 'templates', label: 'Templates', icon: 'pi pi-file-edit', permission: 'templates.read' },
  { id: 'branding', label: 'Branding', icon: 'pi pi-palette', permission: 'branding.read' }
];

const availableTabs = computed(() => {
  return allTabs.filter(tab => permStore.hasPermission(tab.permission));
});
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-scroll::-webkit-scrollbar-thumb { background: var(--surface-300); border-radius: 10px; }
.dark .custom-scroll::-webkit-scrollbar-thumb { background: var(--surface-700); }
</style>

