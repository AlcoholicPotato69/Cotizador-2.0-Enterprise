<template>
  <div class="schedule-view flex flex-col gap-6">
    <div class="view-header flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 mb-2">Agenda Operativa</h1>
        <p class="text-slate-500">Gestión de reservas y ocupación de espacios físicos.</p>
      </div>
      <Button label="Nueva Reserva" icon="pi pi-calendar-plus" class="!bg-indigo-600 !border-none !text-white !px-4 !py-2 !rounded-lg hover:!bg-indigo-700" @click="openReserveDialog" />
    </div>

    <!-- Filtros -->
    <div class="filters bg-white p-4 border border-slate-200 rounded-xl flex flex-wrap gap-4 items-center">
      <div class="w-full sm:w-64">
        <label class="block text-xs font-semibold text-slate-500 mb-1 uppercase">Espacio</label>
        <Dropdown v-model="selectedSpace" :options="spaces" optionLabel="name" optionValue="id" placeholder="Todos los espacios" showClear class="w-full !p-1 !bg-slate-50 !border-slate-300 !rounded-lg" />
      </div>
      <div class="w-full sm:w-64">
        <label class="block text-xs font-semibold text-slate-500 mb-1 uppercase">Fecha (Día a visualizar)</label>
        <!-- PrimeVue 4 usa DatePicker, pero si el alias es Calendar usaremos un input de date temporal por compatibilidad si falla, o podemos intentar Calendar -->
        <input type="date" v-model="selectedDate" class="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div class="mt-auto">
        <Button icon="pi pi-refresh" outlined class="!text-slate-600 !border-slate-300 hover:!bg-slate-50 !p-2 !rounded-lg" @click="fetchAgenda" />
      </div>
    </div>

    <!-- Error/Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>
    <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3">
      <i class="pi pi-exclamation-triangle text-2xl"></i>
      <p>{{ error }}</p>
    </div>

    <!-- Contenido Agenda -->
    <div v-else class="agenda-content bg-white border border-slate-200 rounded-xl overflow-hidden">
      <!-- Encabezado del día -->
      <div class="bg-slate-50 p-4 border-b border-slate-200">
        <h2 class="text-xl font-bold text-slate-800 capitalize">{{ formattedSelectedDate }}</h2>
      </div>

      <div v-if="filteredReservations.length === 0" class="p-12 text-center">
        <i class="pi pi-calendar text-5xl text-slate-300 mb-4"></i>
        <h3 class="text-xl font-bold text-slate-700">Sin eventos</h3>
        <p class="text-slate-500 mt-2">No hay reservas programadas para este día.</p>
      </div>

      <!-- Lista de Reservas tipo Timeline / Tabla -->
      <div v-else class="divide-y divide-slate-100">
        <div v-for="res in sortedReservations" :key="res.id" class="p-4 hover:bg-slate-50 flex gap-4 items-stretch transition-colors">
          <!-- Columna Hora -->
          <div class="w-24 flex flex-col items-end justify-center pr-4 border-r border-slate-200">
            <span class="text-lg font-bold text-slate-700">{{ formatTime(res.startTime) }}</span>
            <span class="text-xs text-slate-400">a {{ formatTime(res.endTime) }}</span>
          </div>

          <!-- Columna Detalle -->
          <div class="flex-1 pl-2">
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-bold text-indigo-900 text-lg">Reserva: {{ res.space?.name || 'Espacio Desconocido' }}</h4>
              <Tag :value="res.status" :severity="getStatusSeverity(res.status)" />
            </div>
            <p class="text-sm text-slate-600 mb-1"><i class="pi pi-info-circle mr-1 text-slate-400"></i> Origen: <strong>{{ res.occupancySourceType }}</strong> ({{ res.occupancySourceId }})</p>
            <p class="text-sm text-slate-600"><i class="pi pi-clock mr-1 text-slate-400"></i> Duración: {{ getDurationInHours(res.startTime, res.endTime) }} hrs</p>
          </div>

          <!-- Acciones -->
          <div class="flex flex-col justify-center gap-2 border-l border-slate-100 pl-4">
            <Button icon="pi pi-pencil" v-tooltip.left="'Reprogramar'" text rounded size="small" class="!text-slate-500 hover:!text-indigo-600 hover:!bg-indigo-50" @click="openReschedule(res)" />
            <Button icon="pi pi-times" v-tooltip.left="'Cancelar'" text rounded size="small" class="!text-slate-500 hover:!text-red-600 hover:!bg-red-50" @click="confirmCancel(res)" />
          </div>
        </div>
      </div>
    </div>

    <!-- Dialogo de Creación de Reserva -->
    <Dialog v-model:visible="reserveDialogVisible" modal header="Nueva Reserva" :style="{ width: '35rem' }" class="!rounded-xl">
      <div class="flex flex-col gap-4 pt-2">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Espacio</label>
          <Dropdown v-model="newRes.spaceId" :options="spaces" optionLabel="name" optionValue="id" placeholder="Selecciona un espacio" class="w-full !bg-slate-50 !border-slate-300" />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Fecha</label>
            <input type="date" v-model="newRes.date" class="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500" />
          </div>
          <div></div>
          
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Hora Inicio</label>
            <input type="time" v-model="newRes.startTime" class="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Hora Fin</label>
            <input type="time" v-model="newRes.endTime" class="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Tipo de Origen</label>
          <Dropdown v-model="newRes.occupancySourceType" :options="['AGENDA', 'QUOTE', 'CONTRACT']" class="w-full !bg-slate-50 !border-slate-300" />
        </div>

        <div v-if="reserveError" class="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded">
          <i class="pi pi-times-circle mr-1"></i> {{ reserveError }}
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text class="!text-slate-500" @click="reserveDialogVisible = false" />
        <Button label="Guardar Reserva" icon="pi pi-check" :loading="saving" class="!bg-indigo-600 !border-none" @click="submitReserve" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';

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

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [spRes, agRes] = await Promise.all([
      http.get('/spaces'),
      http.get('/agenda')
    ]);
    spaces.value = spRes.data;
    reservations.value = agRes.data;
  } catch (err: any) {
    console.error(err);
    error.value = 'Error al cargar la agenda o espacios.';
  } finally {
    loading.value = false;
  }
};

const fetchAgenda = async () => {
  try {
    const res = await http.get('/agenda');
    reservations.value = res.data;
  } catch (err) {
    console.error(err);
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
    await http.post('/agenda/reserve', {
      spaceId: newRes.value.spaceId,
      startTime: startDt,
      endTime: endDt,
      occupancySourceType: newRes.value.occupancySourceType,
      occupancySourceId: 'manual-booking-' + Date.now(),
      correlationId: null
    });
    
    reserveDialogVisible.value = false;
    await fetchAgenda();
  } catch (err: any) {
    console.error(err);
    reserveError.value = err.response?.data?.message || 'Error al crear la reserva (tal vez haya traslape).';
  } finally {
    saving.value = false;
  }
};

const openReschedule = (res: any) => {
  alert('Función de reprogramación en desarrollo. ' + res.id);
};

const confirmCancel = async (res: any) => {
  if(confirm('¿Estás seguro de cancelar esta reserva?')) {
    try {
      await http.patch(`/agenda/${res.id}/cancel`, {});
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
