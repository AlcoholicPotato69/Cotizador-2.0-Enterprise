<template>
  <div class="schedule-view flex flex-col gap-6">
    <div class="view-header flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-extrabold text-surface-900 dark:text-surface-0 mb-2">Agenda Operativa</h1>
        <p class="text-surface-500 dark:text-surface-400">Gestión de reservas y ocupación de espacios físicos.</p>
      </div>
      <DsButton label="Nueva Reserva" icon="pi pi-calendar-plus" class="!bg-indigo-600 !border-none !text-surface-0 dark:text-surface-900 !px-4 !py-2 !rounded-lg hover:!bg-indigo-700" @click="openReserveDialog" />
    </div>

    <!-- Filtros -->
    <div class="filters bg-surface-0 dark:bg-surface-900 p-4 border border-surface-200 dark:border-surface-700 rounded-xl flex flex-wrap gap-4 items-center">
      <div class="w-full sm:w-64">
        <label class="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1 uppercase">Espacio</label>
        <Dropdown v-model="selectedSpace" :options="spaces" optionLabel="name" optionValue="id" placeholder="Todos los espacios" showClear class="w-full !p-1 !bg-surface-50 dark:bg-surface-950 !border-surface-300 dark:border-surface-600 !rounded-lg" />
      </div>
      <div class="w-full sm:w-64">
        <label class="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1 uppercase">Fecha (Día a visualizar)</label>
        <!-- PrimeVue 4 usa DatePicker, pero si el alias es Calendar usaremos un input de date temporal por compatibilidad si falla, o podemos intentar Calendar -->
        <input type="date" v-model="selectedDate" class="w-full p-2 bg-surface-50 dark:bg-surface-950 border border-surface-300 dark:border-surface-600 rounded-lg text-surface-700 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div class="mt-auto">
        <DsButton icon="pi pi-refresh" outlined class="!text-surface-600 dark:text-surface-300 !border-surface-300 dark:border-surface-600 hover:!bg-surface-50 dark:bg-surface-950 !p-2 !rounded-lg" @click="fetchAgenda" />
      </div>
    </div>

    <!-- Error/Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <DsProgressSpinner />
    </div>
    <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3">
      <i class="pi pi-exclamation-triangle text-2xl"></i>
      <p>{{ error }}</p>
    </div>

    <!-- Contenido Agenda -->
    <div v-else class="agenda-content bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
      <!-- Encabezado del día -->
      <div class="bg-surface-50 dark:bg-surface-950 p-4 border-b border-surface-200 dark:border-surface-700">
        <h2 class="text-xl font-bold text-surface-800 dark:text-surface-100 capitalize">{{ formattedSelectedDate }}</h2>
      </div>

      <div v-if="filteredReservations.length === 0" class="p-12 text-center">
        <i class="pi pi-calendar text-5xl text-surface-300 dark:text-surface-600 mb-4"></i>
        <h3 class="text-xl font-bold text-surface-700 dark:text-surface-200">Sin eventos</h3>
        <p class="text-surface-500 dark:text-surface-400 mt-2">No hay reservas programadas para este día.</p>
      </div>

      <!-- Lista de Reservas tipo Timeline / Tabla -->
      <div v-else class="divide-y divide-slate-100">
        <div v-for="res in sortedReservations" :key="res.id" class="p-4 hover:bg-surface-50 dark:bg-surface-950 flex gap-4 items-stretch transition-colors">
          <!-- Columna Hora -->
          <div class="w-24 flex flex-col items-end justify-center pr-4 border-r border-surface-200 dark:border-surface-700">
            <span class="text-lg font-bold text-surface-700 dark:text-surface-200">{{ formatTime(res.startTime) }}</span>
            <span class="text-xs text-surface-400 dark:text-surface-500">a {{ formatTime(res.endTime) }}</span>
          </div>

          <!-- Columna Detalle -->
          <div class="flex-1 pl-2">
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-bold text-indigo-900 text-lg">Reserva: {{ res.space?.name || 'Espacio Desconocido' }}</h4>
              <DsTag :value="res.status" :severity="getStatusSeverity(res.status)" />
            </div>
            <p class="text-sm text-surface-600 dark:text-surface-300 mb-1"><i class="pi pi-info-circle mr-1 text-surface-400 dark:text-surface-500"></i> Origen: <strong>{{ res.occupancySourceType }}</strong> ({{ res.occupancySourceId }})</p>
            <p class="text-sm text-surface-600 dark:text-surface-300"><i class="pi pi-clock mr-1 text-surface-400 dark:text-surface-500"></i> Duración: {{ getDurationInHours(res.startTime, res.endTime) }} hrs</p>
          </div>

          <!-- Acciones -->
          <div class="flex flex-col justify-center gap-2 border-l border-surface-100 dark:border-surface-800 pl-4">
            <DsButton icon="pi pi-pencil" v-tooltip.left="'Reprogramar'" text rounded size="small" class="!text-surface-500 dark:text-surface-400 hover:!text-indigo-600 hover:!bg-indigo-50" @click="openReschedule(res)" />
            <DsButton icon="pi pi-times" v-tooltip.left="'Cancelar'" text rounded size="small" class="!text-surface-500 dark:text-surface-400 hover:!text-red-600 hover:!bg-red-50" @click="confirmCancel(res)" />
          </div>
        </div>
      </div>
    </div>

    <!-- Dialogo de Creación de Reserva -->
    <DsModal v-model:visible="reserveDialogVisible" modal header="Nueva Reserva" :style="{ width: '35rem' }" class="!rounded-xl">
      <div class="flex flex-col gap-4 pt-2">
        <div>
          <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1">Espacio</label>
          <Dropdown v-model="newRes.spaceId" :options="spaces" optionLabel="name" optionValue="id" placeholder="Selecciona un espacio" class="w-full !bg-surface-50 dark:bg-surface-950 !border-surface-300 dark:border-surface-600" />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1">Fecha</label>
            <input type="date" v-model="newRes.date" class="w-full p-2 bg-surface-50 dark:bg-surface-950 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:border-indigo-500" />
          </div>
          <div></div>
          
          <div>
            <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1">Hora Inicio</label>
            <input type="time" v-model="newRes.startTime" class="w-full p-2 bg-surface-50 dark:bg-surface-950 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1">Hora Fin</label>
            <input type="time" v-model="newRes.endTime" class="w-full p-2 bg-surface-50 dark:bg-surface-950 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1">Tipo de Origen</label>
          <Dropdown v-model="newRes.occupancySourceType" :options="['AGENDA', 'QUOTE', 'CONTRACT']" class="w-full !bg-surface-50 dark:bg-surface-950 !border-surface-300 dark:border-surface-600" />
        </div>

        <div v-if="reserveError" class="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded">
          <i class="pi pi-times-circle mr-1"></i> {{ reserveError }}
        </div>
      </div>

      <template #footer>
        <DsButton label="Cancelar" icon="pi pi-times" text class="!text-surface-500 dark:text-surface-400" @click="reserveDialogVisible = false" />
        <DsButton label="Guardar Reserva" icon="pi pi-check" :loading="saving" class="!bg-indigo-600 !border-none" @click="submitReserve" />
      </template>
    </DsModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Data API
const spaces = ref<any[]>([]);
const reservations = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Filtros
const selectedSpace = ref<string | null>(null);
const selectedDate = ref(new Date().toISOString().split('T')[0]);

// Modales
const reserveDialogVisible = ref(false);
const saving = ref(false);
const reserveError = ref<string | null>(null);
const newRes = ref({
  spaceId: '',
  date: new Date().toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '11:00',
  occupancySourceType: 'AGENDA'
});

import { http } from '../api/http';
import { useTenantStore } from '../stores/tenantStore';

const tenantStore = useTenantStore();

const fetchData = async () => {
  if (!tenantStore.activeTenant?.id) return;
  loading.value = true;
  error.value = null;
  try {
    const spRes = await http.get('/spaces');
    spaces.value = spRes.data.data ? spRes.data.data : spRes.data;
    await fetchAgenda();
  } catch (err: any) {
    console.error(err);
    error.value = 'Error al cargar la agenda o espacios.';
  } finally {
    loading.value = false;
  }
};

const fetchAgenda = async () => {
  if (!tenantStore.activeTenant?.id) return;
  try {
    const res = await http.get('/agenda');
    const records = res.data.data ? res.data.data : res.data;
    
    const mapped: any[] = [];
    records.forEach((c: any) => {
      mapped.push({
        id: c.id,
        startTime: c.startTime,
        endTime: c.endTime,
        spaceId: c.spaceId,
        space: c.space || { name: 'Espacio Desconocido' },
        status: c.status,
        occupancySourceType: c.occupancySourceType,
        occupancySourceId: c.occupancySourceId
      });
    });
    
    reservations.value = mapped;
  } catch (err: any) {
    console.error(err);
    error.value = 'Error al cargar reservas';
  }
};

onMounted(() => {
  fetchData().then(() => {
    // Si venimos de SpacesView con params
    if (route.query.spaceId) {
      selectedSpace.value = route.query.spaceId as string;
    }
    if (route.query.action === 'reserve') {
      openReserveDialog();
    }
  });
});

// Computados
const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return '';
  const d = new Date(selectedDate.value + 'T00:00:00'); // Force local tz
  return d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

const filteredReservations = computed(() => {
  return reservations.value.filter(res => {
    // Match date
    const resDateStr = new Date(res.startTime).toISOString().split('T')[0];
    const matchesDate = resDateStr === selectedDate.value;
    
    // Match space
    const matchesSpace = !selectedSpace.value || res.spaceId === selectedSpace.value;
    
    return matchesDate && matchesSpace;
  });
});

const sortedReservations = computed(() => {
  return [...filteredReservations.value].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
});

// Utilidades
const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
};

const getDurationInHours = (start: string, end: string) => {
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  return (diffMs / (1000 * 60 * 60)).toFixed(1);
};

const getStatusSeverity = (status: string) => {
  switch(status) {
    case 'RESERVED': return 'info';
    case 'CONTRACTED': return 'success';
    case 'HOLD': return 'warning';
    case 'CANCELLED': 
    case 'EXPIRED': return 'danger';
    case 'RELEASED': return 'secondary';
    default: return 'info';
  }
};

// Acciones
const openReserveDialog = () => {
  reserveError.value = null;
  newRes.value = {
    spaceId: selectedSpace.value || '',
    date: selectedDate.value || new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '11:00',
    occupancySourceType: 'AGENDA'
  };
  reserveDialogVisible.value = true;
};

const submitReserve = async () => {
  if (!newRes.value.spaceId) {
    reserveError.value = 'Debes seleccionar un espacio.';
    return;
  }
  
  saving.value = true;
  reserveError.value = null;
  
  // Construct DateTimes
  const startDt = new Date(`${newRes.value.date}T${newRes.value.startTime}:00Z`).toISOString();
  const endDt = new Date(`${newRes.value.date}T${newRes.value.endTime}:00Z`).toISOString();
  
  try {
    await http.post('/quotes', {
      tenant: tenantStore.activeTenant?.id,
      start_date: startDt.replace('T', ' ').replace('Z', ''),
      end_date: endDt.replace('T', ' ').replace('Z', ''),
      items: [newRes.value.spaceId],
      status: 'draft',
      total_amount: 0
    });
    
    reserveDialogVisible.value = false;
    await fetchAgenda();
  } catch (err: any) {
    console.error(err);
    reserveError.value = err.message || 'Error al crear la reserva.';
  } finally {
    saving.value = false;
  }
};

const openReschedule = (res: any) => {
  alert('Función de reprogramación temporalmente no disponible. ' + res.id);
};

const confirmCancel = async (res: any) => {
  if(confirm('¿Estás seguro de cancelar esta reserva?')) {
    try {
      await http.patch(`/quotes/${res.id}`, { status: 'cancelled' });
      await fetchAgenda();
    } catch (err) {
      alert('Error al cancelar la reserva');
    }
  }
};
</script>

<style scoped>
/* Scoped overrides */
</style>


