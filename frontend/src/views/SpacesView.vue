<template>
  <div class="spaces-view flex flex-col gap-6">
    <div class="view-header">
      <h1 class="text-3xl font-extrabold text-slate-900 mb-2">Catálogo de Espacios</h1>
      <p class="text-slate-500">Explora y descubre nuestros recintos, salones y espacios disponibles.</p>
    </div>

    <!-- Filtros -->
    <div class="filters bg-white p-4 border border-slate-200 rounded-xl flex flex-wrap gap-4 items-center">
      <div class="flex-1 min-w-[200px]">
        <InputText v-model="searchQuery" placeholder="Buscar espacio..." class="w-full !p-3 !bg-slate-50 !border-slate-300 !rounded-lg" />
      </div>
      <div class="w-full sm:w-auto">
        <Dropdown v-model="selectedType" :options="spaceTypes" optionLabel="label" optionValue="value" placeholder="Tipo de Espacio" class="w-full sm:w-48 !p-1 !bg-slate-50 !border-slate-300 !rounded-lg" />
      </div>
      <Button label="Buscar" icon="pi pi-search" class="!bg-indigo-600 !border-none !text-white !p-3 !rounded-lg hover:!bg-indigo-700 transition-colors" @click="fetchSpaces" />
    </div>

    <!-- Error/Loading States -->
    <div v-if="loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3">
      <i class="pi pi-exclamation-triangle text-2xl"></i>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="filteredSpaces.length === 0" class="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
      <i class="pi pi-inbox text-5xl text-slate-400 mb-4"></i>
      <h3 class="text-xl font-bold text-slate-700">No se encontraron espacios</h3>
      <p class="text-slate-500 mt-2">Intenta ajustar los filtros de búsqueda.</p>
    </div>

    <!-- Catálogo Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="space in filteredSpaces" :key="space.id" class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer" @click="openSpaceDetails(space)">
        <!-- Imagen (Placeholder si no hay) -->
        <div class="h-48 bg-slate-100 relative overflow-hidden">
          <img :src="getSpaceImage(space)" alt="Space Image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute top-3 right-3 flex gap-2">
            <Tag :value="space.status" :severity="getStatusSeverity(space.status)" class="!rounded-full !px-3 !font-semibold" />
          </div>
        </div>
        
        <!-- Contenido -->
        <div class="p-5 flex-1 flex flex-col">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-bold text-slate-800 line-clamp-1" :title="space.name">{{ space.name }}</h3>
          </div>
          
          <p class="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[40px]">{{ space.description || 'Sin descripción disponible.' }}</p>
          
          <!-- Metadatos -->
          <div class="grid grid-cols-2 gap-3 mb-4 mt-auto">
            <div class="flex items-center gap-2 text-slate-600 text-sm">
              <i class="pi pi-users text-indigo-500"></i>
              <span>{{ space.capacity }} pax</span>
            </div>
            <div class="flex items-center gap-2 text-slate-600 text-sm">
              <i class="pi pi-expand text-indigo-500"></i>
              <span>{{ space.areaSqm }} m²</span>
            </div>
            <div class="flex items-center gap-2 text-slate-600 text-sm col-span-2">
              <i class="pi pi-tag text-indigo-500"></i>
              <span class="capitalize">{{ space.spaceType }}</span>
            </div>
          </div>
          
          <div class="border-t border-slate-100 pt-4 flex justify-between items-center mt-auto">
            <div>
              <p class="text-xs text-slate-400 font-medium uppercase tracking-wider">Precio Base</p>
              <p class="text-lg font-bold text-indigo-700">${{ formatPrice(space.basePricePerHour) }} <span class="text-sm font-normal text-slate-500">/ hr</span></p>
            </div>
            <Button icon="pi pi-arrow-right" rounded text class="!text-indigo-600 hover:!bg-indigo-50" />
          </div>
        </div>
      </div>
    </div>

    <!-- Dialogo de Detalles -->
    <Dialog v-model:visible="detailsDialogVisible" modal :header="selectedSpace?.name" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" class="!rounded-2xl overflow-hidden">
      <div v-if="selectedSpace" class="flex flex-col md:flex-row gap-6 p-4">
        <div class="w-full md:w-1/2">
          <img :src="getSpaceImage(selectedSpace)" class="w-full h-64 object-cover rounded-xl shadow-sm" />
        </div>
        <div class="w-full md:w-1/2 flex flex-col gap-4">
          <div>
            <h4 class="font-bold text-slate-800 text-xl mb-1">Descripción</h4>
            <p class="text-slate-600 leading-relaxed">{{ selectedSpace.description || 'N/A' }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
            <div>
              <p class="text-xs text-slate-500 font-semibold uppercase">Capacidad</p>
              <p class="font-medium text-slate-800">{{ selectedSpace.capacity }} personas</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-semibold uppercase">Superficie</p>
              <p class="font-medium text-slate-800">{{ selectedSpace.areaSqm }} m²</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-semibold uppercase">Categoría</p>
              <p class="font-medium text-slate-800 capitalize">{{ selectedSpace.spaceType }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-semibold uppercase">Estado</p>
              <Tag :value="selectedSpace.status" :severity="getStatusSeverity(selectedSpace.status)" />
            </div>
          </div>

          <div class="mt-auto pt-4 flex gap-3">
            <Button label="Ver Agenda" icon="pi pi-calendar" outlined class="flex-1 !border-indigo-600 !text-indigo-600 hover:!bg-indigo-50 !rounded-lg" @click="goToAgenda(selectedSpace.id)" />
            <Button label="Reservar" icon="pi pi-check" class="flex-1 !bg-indigo-600 !border-none !text-white hover:!bg-indigo-700 !rounded-lg" @click="goToReservation(selectedSpace.id)" />
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import { useRouter } from 'vue-router';

const router = useRouter();

// Estado
const spaces = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Filtros
const searchQuery = ref('');
const selectedType = ref('all');
const spaceTypes = ref([
  { label: 'Todos', value: 'all' },
  { label: 'Salones', value: 'salones' },
  { label: 'Espacios', value: 'espacios' },
  { label: 'Publicidad Física', value: 'publicidad_fisica' },
  { label: 'Publicidad Digital', value: 'publicidad_digital' },
]);

// Detalles
const detailsDialogVisible = ref(false);
const selectedSpace = ref<any>(null);

import { http } from '../api/http';

const fetchSpaces = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await http.get('/spaces');
    spaces.value = res.data;
  } catch (err: any) {
    console.error(err);
    error.value = 'Error al cargar el catálogo de espacios. Verifica tu conexión o sesión.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSpaces();
});

// Computados
const filteredSpaces = computed(() => {
  return spaces.value.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          (space.description || '').toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesType = selectedType.value === 'all' || space.spaceType.toLowerCase().replace(' ', '_') === selectedType.value;
    return matchesSearch && matchesType;
  });
});

// Utilidades
const formatPrice = (price: any) => {
  const num = Number(price);
  return isNaN(num) ? '0.00' : num.toLocaleString('es-MX', { minimumFractionDigits: 2 });
};

const getStatusSeverity = (status: string) => {
  switch(status) {
    case 'AVAILABLE': return 'success';
    case 'MAINTENANCE': return 'warning';
    case 'INACTIVE': return 'danger';
    default: return 'info';
  }
};

const getSpaceImage = (space: any) => {
  // Mock image generator based on space name/type for visual appeal since we don't store raw images yet
  const typeMap: Record<string, string> = {
    'salones': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
    'publicidad': 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800',
  };
  
  const match = Object.keys(typeMap).find(k => space.spaceType?.toLowerCase().includes(k));
  if (match) return typeMap[match];
  
  // Default meeting room
  return `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800&sig=${space.id}`;
};

// Acciones
const openSpaceDetails = (space: any) => {
  selectedSpace.value = space;
  detailsDialogVisible.value = true;
};

const goToAgenda = (spaceId: string) => {
  detailsDialogVisible.value = false;
  router.push({ name: 'schedule', query: { spaceId } });
};

const goToReservation = (spaceId: string) => {
  detailsDialogVisible.value = false;
  router.push({ name: 'schedule', query: { spaceId, action: 'reserve' } });
};
</script>

<style scoped>
/* Las clases de Tailwind manejan la mayoría del estilo.
   Usamos !important (!) en algunas clases de PrimeVue porque 
   PrimeVue unstyled puede requerir inyección específica. */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
