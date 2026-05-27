<template>
  <div class="spaces-view p-6 max-w-[1400px] mx-auto flex flex-col gap-8 w-full">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-surface-900 dark:text-surface-0 mb-2 tracking-tight">Catálogo de Espacios</h1>
        <p class="text-surface-500 dark:text-surface-400 font-medium">Explora y descubre nuestros recintos, salones y espacios disponibles.</p>
      </div>
      <div class="flex gap-3">
        <DsButton v-if="permissionsStore.can('spaces.manage')" label="Crear Espacio" icon="pi pi-plus" class="!bg-indigo-600 !border-none hover:!bg-indigo-700 !text-white !px-5 !py-2.5 !rounded-xl shadow-md transition-all" @click="openCreateSpace" />
      </div>
    </div>

    <!-- Filtros -->
    <div class="p-[1px] bg-gradient-to-r from-surface-200 to-transparent dark:from-surface-700 rounded-2xl">
      <div class="bg-surface-0 dark:bg-surface-900 p-5 rounded-2xl flex flex-wrap gap-4 items-center shadow-sm">
        <div class="flex-1 min-w-[200px] relative">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-surface-400"></i>
          <DsInput v-model="searchQuery" placeholder="Buscar espacio por nombre o descripción..." class="w-full pl-11 !p-3 !bg-surface-50 dark:!bg-surface-950 !border-surface-200 dark:!border-surface-700 !rounded-xl" />
        </div>
        <div class="w-full sm:w-auto min-w-[200px]">
          <Dropdown v-model="selectedType" :options="spaceTypes" optionLabel="label" optionValue="value" placeholder="Tipo de Espacio" class="w-full !rounded-xl !bg-surface-50 dark:!bg-surface-950 !border-surface-200 dark:!border-surface-700" />
        </div>
      </div>
    </div>

    <!-- Error/Loading States -->
    <div v-if="spaceStore.loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center gap-3 border border-red-100 dark:border-red-800/30">
      <i class="pi pi-exclamation-triangle text-2xl"></i>
      <p class="font-medium">{{ error }}</p>
    </div>

    <div v-else-if="filteredSpaces.length === 0" class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl p-16 text-center shadow-sm">
      <div class="w-20 h-20 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <i class="pi pi-inbox text-4xl text-surface-400 dark:text-surface-500"></i>
      </div>
      <h3 class="text-xl font-bold text-surface-800 dark:text-surface-100">No se encontraron espacios</h3>
      <p class="text-surface-500 dark:text-surface-400 mt-2 max-w-md mx-auto">Intenta ajustar los filtros de búsqueda o crea un nuevo espacio en el sistema.</p>
    </div>

    <!-- Catálogo Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
      <div v-for="space in filteredSpaces" :key="space.id" class="group bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer relative" @click="openSpaceDetails(space)">
        
        <!-- Imagen -->
        <div class="h-48 bg-surface-100 dark:bg-surface-800 relative overflow-hidden">
          <img :src="getSpaceImage(space)" alt="Space Image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
          
          <div class="absolute top-3 right-3 flex gap-2">
            <DsTag :value="space.status" :severity="getStatusSeverity(space.status)" class="!rounded-full !px-3 !py-1 !font-bold text-xs shadow-sm backdrop-blur-md bg-surface-0/90 dark:bg-surface-950/90" />
          </div>
          
          <div class="absolute bottom-3 left-4 right-4 flex justify-between items-end">
            <h3 class="text-xl font-bold text-white line-clamp-1 drop-shadow-md" :title="space.name">{{ space.name }}</h3>
          </div>
        </div>
        
        <!-- Contenido -->
        <div class="p-5 flex-1 flex flex-col gap-4">
          <p class="text-sm text-surface-600 dark:text-surface-400 line-clamp-2 min-h-[40px] leading-relaxed">{{ space.description || 'Sin descripción disponible para este espacio.' }}</p>
          
          <!-- Metadatos -->
          <div class="grid grid-cols-2 gap-3 mt-auto bg-surface-50 dark:bg-surface-950/50 p-3 rounded-xl border border-surface-100 dark:border-surface-800">
            <div class="flex items-center gap-2.5 text-surface-700 dark:text-surface-300 text-sm font-medium">
              <i class="pi pi-users text-indigo-500 dark:text-indigo-400"></i>
              <span>{{ space.capacity }} pax</span>
            </div>
            <div class="flex items-center gap-2.5 text-surface-700 dark:text-surface-300 text-sm font-medium">
              <i class="pi pi-expand text-indigo-500 dark:text-indigo-400"></i>
              <span>{{ space.areaSqm }} m²</span>
            </div>
          </div>
          
          <div class="flex justify-between items-center pt-2">
            <div>
              <p class="text-[10px] text-surface-400 dark:text-surface-500 font-bold uppercase tracking-wider mb-0.5">Precio Base</p>
              <p class="text-lg font-extrabold text-surface-900 dark:text-surface-0">{{ formatPrice(space.basePricePerHour) }} <span class="text-xs font-medium text-surface-500 dark:text-surface-400">/ hr</span></p>
            </div>
            <div class="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <i class="pi pi-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialogo de Detalles -->
    <DsModal v-model:visible="detailsDialogVisible" modal :header="selectedSpace?.name" class="!rounded-2xl overflow-hidden shadow-2xl" :style="{ width: '55rem' }" :breakpoints="{ '1199px': '75vw', '575px': '95vw' }">
      <div v-if="selectedSpace" class="flex flex-col md:flex-row gap-8 p-2">
        <div class="w-full md:w-5/12">
          <div class="rounded-2xl overflow-hidden shadow-inner h-64 md:h-full relative">
            <img :src="getSpaceImage(selectedSpace)" class="w-full h-full object-cover" />
            <div class="absolute top-4 right-4">
               <DsTag :value="selectedSpace.status" :severity="getStatusSeverity(selectedSpace.status)" class="!rounded-full !px-3 shadow-md" />
            </div>
          </div>
        </div>
        <div class="w-full md:w-7/12 flex flex-col gap-6 py-2">
          <div>
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-extrabold text-surface-900 dark:text-surface-0 text-2xl tracking-tight">{{ selectedSpace.name }}</h4>
              <p class="font-bold text-xl text-indigo-600 dark:text-indigo-400">{{ formatPrice(selectedSpace.basePricePerHour) }}<span class="text-sm text-surface-500 font-medium">/hr</span></p>
            </div>
            <DsTag :value="selectedSpace.spaceType" class="!bg-surface-100 !text-surface-700 dark:!bg-surface-800 dark:!text-surface-300 !text-xs !font-bold uppercase tracking-wider mb-4" />
            <p class="text-surface-600 dark:text-surface-300 leading-relaxed text-sm">{{ selectedSpace.description || 'Sin descripción detallada disponible.' }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4 bg-surface-50 dark:bg-surface-950/50 p-5 rounded-2xl border border-surface-200 dark:border-surface-800">
            <div>
              <p class="text-xs text-surface-500 dark:text-surface-400 font-bold uppercase tracking-wider mb-1">Capacidad Máx.</p>
              <p class="font-semibold text-surface-900 dark:text-surface-100 text-lg flex items-center gap-2"><i class="pi pi-users text-surface-400"></i> {{ selectedSpace.capacity }} pax</p>
            </div>
            <div>
              <p class="text-xs text-surface-500 dark:text-surface-400 font-bold uppercase tracking-wider mb-1">Superficie</p>
              <p class="font-semibold text-surface-900 dark:text-surface-100 text-lg flex items-center gap-2"><i class="pi pi-expand text-surface-400"></i> {{ selectedSpace.areaSqm }} m²</p>
            </div>
            <div>
              <p class="text-xs text-surface-500 dark:text-surface-400 font-bold uppercase tracking-wider mb-1">Código</p>
              <p class="font-mono text-surface-900 dark:text-surface-100 font-medium">{{ selectedSpace.code || 'N/A' }}</p>
            </div>
          </div>

          <div class="mt-auto pt-4 flex gap-3">
            <DsButton v-if="permissionsStore.can('spaces.manage')" label="Editar" icon="pi pi-pencil" text class="!text-surface-600 hover:!bg-surface-100 dark:hover:!bg-surface-800 !rounded-xl" @click="openEditSpace(selectedSpace)" />
            <div class="flex-1"></div>
            <DsButton label="Ver Agenda" icon="pi pi-calendar" outlined class="!border-surface-300 dark:!border-surface-600 !text-surface-700 dark:!text-surface-200 hover:!bg-surface-50 dark:hover:!bg-surface-800 !rounded-xl px-4" @click="goToAgenda(selectedSpace.id)" />
            <DsButton label="Reservar" icon="pi pi-check" class="!bg-indigo-600 !border-none hover:!bg-indigo-700 !text-white !rounded-xl px-6 shadow-md" @click="goToReservation(selectedSpace.id)" />
          </div>
        </div>
      </div>
    </DsModal>

    <!-- Dialogo para Builder -->
    <DsModal v-model:visible="builderDialogVisible" modal :header="isEditing ? 'Editar Espacio' : 'Crear Espacio'" class="!rounded-2xl" :style="{ width: '60rem' }" :breakpoints="{ '1199px': '75vw', '575px': '95vw' }" :closable="false">
      <SpaceBuilderForm v-if="builderDialogVisible" :initial-data="selectedSpace" @cancel="builderDialogVisible = false" @saved="onSpaceSaved" />
    </DsModal>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePermissionsStore } from '../stores/permissionsStore';
import { useSpaceStore } from '../stores/spaceStore';
import type { Space } from '../services/spaceService';
import SpaceBuilderForm from '../components/spaces/SpaceBuilderForm.vue';

const router = useRouter();
const permissionsStore = usePermissionsStore();
const spaceStore = useSpaceStore();

// Estado
const error = ref<string | null>(null);

// Filtros
const searchQuery = ref('');
const selectedType = ref('all');
const spaceTypes = ref([
  { label: 'Todos los tipos', value: 'all' },
  { label: 'Salones de Eventos', value: 'salones' },
  { label: 'Publicidad Física', value: 'publicidad_fisica' },
  { label: 'Publicidad Digital', value: 'publicidad_digital' },
]);

// Detalles y Edición
const detailsDialogVisible = ref(false);
const builderDialogVisible = ref(false);
const selectedSpace = ref<Space | undefined>(undefined);
const isEditing = ref(false);

const fetchSpaces = async () => {
  error.value = null;
  try {
    await spaceStore.fetchSpaces();
  } catch (err) {
    console.error('Error fetching spaces:', err);
    error.value = 'Error al cargar el catálogo de espacios. Verifica tu conexión.';
  }
};

onMounted(() => {
  fetchSpaces();
});

// Computados
const filteredSpaces = computed(() => {
  return spaceStore.spaces.filter(space => {
    const matchesSearch = space.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          (space.description || '').toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesType = selectedType.value === 'all' || space.spaceType?.toLowerCase() === selectedType.value;
    return matchesSearch && matchesType;
  });
});

// Utilidades
const formatPrice = (price: unknown) => {
  const num = Number(price);
  return isNaN(num) ? '$0.00' : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num);
};

const getStatusSeverity = (status: string) => {
  switch(status) {
    case 'AVAILABLE': return 'success';
    case 'MAINTENANCE': return 'warning';
    case 'INACTIVE': return 'danger';
    default: return 'info';
  }
};

const getSpaceImage = (space: Space) => {
  const defaultImg = `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800&sig=${space.id}`;
  if (space.images && Array.isArray(space.images) && space.images.length > 0) {
    return space.images[0].url || defaultImg;
  }
  return defaultImg;
};

// Acciones
const openSpaceDetails = (space: Space) => {
  selectedSpace.value = space;
  detailsDialogVisible.value = true;
};

const openCreateSpace = () => {
  selectedSpace.value = undefined;
  isEditing.value = false;
  builderDialogVisible.value = true;
};

const openEditSpace = (space: Space) => {
  detailsDialogVisible.value = false;
  selectedSpace.value = space;
  isEditing.value = true;
  builderDialogVisible.value = true;
};

const onSpaceSaved = () => {
  builderDialogVisible.value = false;
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

