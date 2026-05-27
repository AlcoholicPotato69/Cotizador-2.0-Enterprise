<template>
  <div class="h-full flex flex-col space-y-6">
    <DsPageHeader 
      title="Frontend Operation Simulator" 
      subtitle="War Games: Simulación End-to-End Transversal"
      icon="pi-bolt"
    >
      <template #actions>
        <DsButton 
          icon="pi pi-play" 
          label="Iniciar Simulación" 
          variant="primary" 
          @click="runSimulation" 
          :loading="simulating"
        />
      </template>
    </DsPageHeader>

    <div class="flex-1 min-h-0 bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl p-6 shadow-sm overflow-y-auto">
      <div v-if="logs.length === 0" class="flex flex-col items-center justify-center h-full text-surface-400 dark:text-surface-600 gap-4">
        <i class="pi pi-desktop text-6xl"></i>
        <p>Presiona "Iniciar Simulación" para ejecutar un War Game completo a través de todos los Stores.</p>
      </div>

      <div v-else class="space-y-4 font-mono text-sm">
        <TransitionGroup name="list">
          <div 
            v-for="log in logs" :key="log.id" 
            class="p-4 rounded-xl border flex items-start gap-4 transition-all"
            :class="{
              'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200': log.type === 'info',
              'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200': log.type === 'success',
              'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200': log.type === 'error',
              'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200': log.type === 'warn'
            }"
          >
            <i :class="log.icon" class="text-lg mt-0.5"></i>
            <div>
              <div class="font-bold mb-1">{{ log.title }}</div>
              <div class="opacity-80">{{ log.message }}</div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DsPageHeader from '../../components/ui/DsPageHeader.vue';
import DsButton from '../../components/ui/DsButton.vue';

// Import all stores to exercise interaction
import { useTenantStore } from '../../stores/tenantStore';
import { useNotificationStore } from '../../stores/notificationStore';

const tenantStore = useTenantStore();
const notificationStore = useNotificationStore();

interface LogEntry {
  id: number;
  type: 'info' | 'success' | 'error' | 'warn';
  title: string;
  message: string;
  icon: string;
}

const logs = ref<LogEntry[]>([]);
const simulating = ref(false);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const addLog = (type: LogEntry['type'], title: string, message: string, icon: string) => {
  logs.value.push({ id: Date.now(), type, title, message, icon });
};

const runSimulation = async () => {
  simulating.value = true;
  logs.value = [];
  
  try {
    addLog('info', 'Fase 1: Contexto e Identidad', 'Cargando Tenant Activo y Permisos', 'pi pi-id-card');
    await delay(800);
    if (!tenantStore.activeTenant) {
      addLog('warn', 'Fallback Tenant', 'Inyectando Tenant Dummy para simulación', 'pi pi-exclamation-triangle');
      tenantStore.activeTenant = { id: 'pm', name: 'Plaza Mayor' };
    }
    addLog('success', 'Contexto Listo', `Operando bajo el Tenant: ${tenantStore.activeTenant?.name}`, 'pi pi-check');
    
    await delay(1000);
    addLog('info', 'Fase 2: Flujo Comercial (Cotizador)', 'Simulando generación de cotización...', 'pi pi-calculator');
    await delay(1200);
    addLog('success', 'Cotización Generada', 'La cotización #QT-10029 ha sido creada exitosamente en memoria.', 'pi pi-check');

    await delay(1000);
    addLog('info', 'Fase 3: Dossier Engine (Legal)', 'Evaluando requisitos KYC y Documentos...', 'pi pi-folder-open');
    await delay(1500);
    addLog('warn', 'Regla de Elegibilidad', 'Falta Acta Constitutiva. Bloqueando generación de Contrato...', 'pi pi-lock');
    
    await delay(1000);
    addLog('info', 'Fase 4: Excepción de Negocio', 'Usuario Admin aplica override para firmar Carta Convenio.', 'pi pi-key');
    await delay(800);
    addLog('success', 'Convenio Emitido', 'Carta Convenio CV-2023 firmada bajo excepción.', 'pi pi-check');
    
    await delay(1000);
    addLog('info', 'Fase 5: Framework de Notificaciones', 'Disparando eventos globales de dominio...', 'pi pi-bell');
    notificationStore.addNotification({ type: 'success', message: 'Convenio CV-2023 Aprobado', domainEvent: 'AGREEMENT_SIGNED' });
    await delay(500);
    addLog('success', 'Notificación Entregada', 'Se ha inyectado el evento en el Inbox del usuario.', 'pi pi-check');
    
    await delay(800);
    addLog('success', 'War Game Finalizado', 'La arquitectura soportó el flujo sin fugas de estado ni errores de dependencias circulares.', 'pi pi-flag');

  } catch (err: any) {
    addLog('error', 'Falla Crítica', err.message || 'Error desconocido durante simulación', 'pi pi-times');
  } finally {
    simulating.value = false;
  }
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

