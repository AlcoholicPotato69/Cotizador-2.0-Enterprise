<template>
  <div class="admin-view flex flex-column h-full">
    <div class="view-header mb-4">
      <h1 class="title">Tenant Administration Center</h1>
      <p class="subtitle">Gobernanza centralizada Multi-Tenant. (Configuration Over Code)</p>
    </div>

    <!-- Tabs para los Builders Granulares -->
    <div class="tabs-nav mb-4 border-bottom overflow-x-auto white-space-nowrap pb-2">
       <!-- Fase F.1 -->
       <button class="tab-btn" :class="{'active': activeTab === 'rbac'}" @click="activeTab = 'rbac'" v-permission="'roles.manage'">Roles & Permisos</button>
       <button class="tab-btn" :class="{'active': activeTab === 'spaces'}" @click="activeTab = 'spaces'" v-permission="'spaces.manage'">Espacios Físicos</button>
       <button class="tab-btn" :class="{'active': activeTab === 'docs'}" @click="activeTab = 'docs'" v-permission="'config.manage'">Req. Documentales</button>
       
       <!-- Fase F.2 (Builders Operativos Avanzados con Snapshot Strategy) -->
       <button class="tab-btn" :class="{'active': activeTab === 'promotions'}" @click="activeTab = 'promotions'" v-permission="'promotions.read'">Promotions</button>
       <button class="tab-btn" :class="{'active': activeTab === 'pricing'}" @click="activeTab = 'pricing'" v-permission="'pricing.read'">Pricing Engine</button>
       <button class="tab-btn" :class="{'active': activeTab === 'taxes'}" @click="activeTab = 'taxes'" v-permission="'taxes.read'">Tax Rules</button>
       <button class="tab-btn" :class="{'active': activeTab === 'templates'}" @click="activeTab = 'templates'" v-permission="'templates.read'">Templates</button>
       <button class="tab-btn" :class="{'active': activeTab === 'branding'}" @click="activeTab = 'branding'" v-permission="'branding.read'">Branding</button>
    </div>

    <div class="tab-content flex-1 overflow-auto p-1">
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RbacBuilder from './RbacBuilder.vue';
import SpaceBuilder from './SpaceBuilder.vue';
import DocReqBuilder from './DocReqBuilder.vue';
import PromotionsBuilder from './PromotionsBuilder.vue';
import PricingBuilder from './PricingBuilder.vue';
import TaxBuilder from './TaxBuilder.vue';
import TemplateBuilder from './TemplateBuilder.vue';
import BrandingBuilder from './BrandingBuilder.vue';

const activeTab = ref('rbac');
</script>

<style scoped>
.admin-view { height: 100%; display: flex; flex-direction: column; }
.title { margin: 0; font-size: 1.8rem; font-weight: 900; color: #0f172a; }
.subtitle { margin: 0.25rem 0 0 0; font-size: 0.95rem; color: #64748b; }
.mb-4 { margin-bottom: 1.5rem; }
.pb-2 { padding-bottom: 0.5rem; }
.p-1 { padding: 0.25rem; }
.border-bottom { border-bottom: 1px solid #e2e8f0; }

.tabs-nav { display: flex; gap: 1.5rem; align-items: center; }
.tab-btn { 
  background: transparent; border: none; border-bottom: 3px solid transparent; 
  padding: 0.5rem 0; font-size: 0.95rem; font-weight: 700; color: #64748b; 
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.tab-btn:hover { color: #1e293b; }
.tab-btn.active { color: #3b82f6; border-bottom-color: #3b82f6; }

.tab-content { flex: 1; }
.flex { display: flex; }
.flex-column { flex-direction: column; }
.flex-1 { flex: 1; }
.h-full { height: 100%; }
.overflow-x-auto { overflow-x: auto; }
.overflow-auto { overflow: auto; }
.white-space-nowrap { white-space: nowrap; }
</style>
