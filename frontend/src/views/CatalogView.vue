<template>
  <div class="h-full flex flex-col space-y-6">
    <DsPageHeader 
      title="Catálogo de Espacios" 
      subtitle="Gestión de inventario y salones disponibles."
      icon="pi-store"
    >
      <template #actions>
        <DsButton icon="pi pi-plus" label="Nuevo Elemento" variant="primary" @click="openManagerModal()" />
      </template>
    </DsPageHeader>

    <div class="flex-1 flex flex-col min-h-0">
      
      <!-- Filters -->
      <div class="mb-6 flex flex-col md:flex-row gap-4 items-center bg-surface-0 dark:bg-surface-800 p-4 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700">
        <div class="w-full md:w-1/3">
          <DsSearchBar v-model="searchQuery" placeholder="Buscar por espacio, material, ubicación o medidas..." @search="filterCatalog" />
        </div>
        <div class="flex gap-4 w-full md:w-auto">
          <DsSelect v-model="filterType" :options="typeOptions" placeholder="Todos los Tipos" @change="filterCatalog" />
          <DsSelect v-model="sortOrder" :options="sortOptions" placeholder="Orden: Defecto" @change="filterCatalog" />
        </div>
      </div>

      <!-- Grid -->
      <div class="flex-1 overflow-y-auto pb-6">
        <DsLoadingState v-if="loading" message="Cargando catálogo..." />
        
        <div v-else-if="filteredSpaces.length === 0" class="flex flex-col items-center justify-center h-64 text-surface-400">
           <i class="pi pi-images text-4xl mb-4"></i>
           <p>No se encontraron espacios.</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="space in filteredSpaces" 
            :key="space.id"
            class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-3xl overflow-hidden hover:shadow-lg transition flex flex-col cursor-pointer"
            @click="openManagerModal(space)"
          >
            <!-- Image Area -->
            <div class="h-48 bg-surface-100 relative">
              <img v-if="space.images && space.images.length > 0 && space.images[0]" :src="space.images[0]" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-surface-400">
                <i class="pi pi-image text-4xl"></i>
              </div>
              <div class="absolute top-3 right-3">
                <DsStatusBadge :status="space.status" />
              </div>
              <div class="absolute bottom-3 left-3 flex gap-1">
                <span class="bg-surface-900/80 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">{{ space.spaceType }}</span>
                <span v-if="space.isDigital" class="bg-primary-600/90 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm"><i class="pi pi-bolt text-[10px]"></i> Digital</span>
              </div>
            </div>
            
            <!-- Details Area -->
            <div class="p-5 flex flex-col flex-1">
              <p class="text-xs font-mono text-surface-500 mb-1">{{ space.code || 'NO-KEY' }}</p>
              <h3 class="text-lg font-bold text-surface-900 dark:text-surface-0 leading-tight mb-2">{{ space.name }}</h3>
              <p class="text-xs text-surface-600 dark:text-surface-400 line-clamp-2 mb-4">{{ space.description }}</p>
              
              <div class="mt-auto flex items-center justify-between border-t border-surface-100 dark:border-surface-800 pt-4">
                <div>
                  <p class="text-[10px] uppercase font-bold text-surface-500">Precio Base</p>
                  <p class="text-xl font-black text-primary-600">${{ (space.basePricePerHour || 0).toLocaleString() }}</p>
                </div>
                <div v-if="space.allowsAgreement" class="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center tooltip" title="Permite Convenio">
                  <i class="pi pi-handshake"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Manager Modal -->
    <DsModal v-model:visible="managerVisible" :header="editingSpace ? 'Gestor de Espacio' : 'Nuevo Espacio'" size="xl">
      <div class="p-2 space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DsFormField label="Clave / Código" required>
            <DsInput v-model="form.code" placeholder="Ej. L-01" class="uppercase font-mono" />
          </DsFormField>
          <DsFormField label="Tipo">
            <DsSelect v-model="form.spaceType" :options="typeOptions.slice(1)" placeholder="Seleccionar..." />
          </DsFormField>
        </div>

        <DsFormField label="Nombre" required>
          <DsInput v-model="form.name" placeholder="Ej. Local Planta Baja" />
        </DsFormField>

        <DsFormField label="Descripción">
          <textarea v-model="form.description" rows="3" class="w-full border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
        </DsFormField>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DsFormField label="Material">
            <DsInput v-model="form.material" placeholder="Opcional" />
          </DsFormField>
          <DsFormField label="Ubicación">
            <DsInput v-model="form.location" placeholder="Opcional" />
          </DsFormField>
          <DsFormField label="Capacidad (Pax)">
             <DsInput v-model.number="form.capacity" type="number" />
          </DsFormField>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
           <DsFormField label="Ancho">
             <DsInput v-model.number="form.width" type="number" />
           </DsFormField>
           <DsFormField label="Largo / Alto">
             <DsInput v-model.number="form.height" type="number" />
           </DsFormField>
           <DsFormField label="Unidad">
              <DsSelect v-model="form.measureUnit" :options="[{label:'Metros (m)', value:'m'}, {label:'Centímetros (cm)', value:'cm'}]" />
           </DsFormField>
        </div>

        <!-- Medio Digital Toggle -->
        <div class="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-xl p-4">
           <div class="flex items-center justify-between">
              <div>
                 <p class="text-sm font-bold text-sky-700 dark:text-sky-300">Medio Digital</p>
                 <p class="text-xs text-sky-600/70 dark:text-sky-400/70">Activa configuraciones específicas para pantallas o publicidad digital.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="form.isDigital" class="sr-only peer">
                  <div class="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:bg-sky-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-0 after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-surface-0"></div>
              </label>
           </div>
           
           <div v-if="form.isDigital" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <DsFormField label="Tipo de Medio">
                 <DsSelect v-model="form.digitalMediaType" :options="[{label:'Imagen', value:'imagen'}, {label:'Video', value:'video'}, {label:'Híbrido', value:'hibrido'}]" />
              </DsFormField>
              <DsFormField label="Duración (segundos)">
                 <DsInput v-model.number="form.digitalDurationValue" type="number" />
              </DsFormField>
           </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <DsFormField label="Precio Base Total" required>
             <div class="relative">
               <span class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">$</span>
               <DsInput v-model.number="form.basePricePerHour" type="number" class="pl-8" />
             </div>
           </DsFormField>

           <div class="flex items-center justify-between border border-surface-200 dark:border-surface-700 rounded-xl p-3 bg-surface-50 dark:bg-surface-900">
              <div>
                 <p class="text-sm font-bold">Permitir Convenio</p>
                 <p class="text-xs text-surface-500">Apto para contratos de largo plazo</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="form.allowsAgreement" class="sr-only peer">
                  <div class="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:bg-amber-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-0 after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-surface-0"></div>
              </label>
           </div>
        </div>

        <div class="flex items-center justify-between border border-surface-200 dark:border-surface-700 rounded-xl p-3 bg-surface-50 dark:bg-surface-900">
           <p class="text-sm font-bold">Visible en Catálogo (Activo)</p>
           <label class="relative inline-flex items-center cursor-pointer">
               <input type="checkbox" v-model="form.isActive" class="sr-only peer">
               <div class="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-0 after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-surface-0"></div>
           </label>
        </div>

        <!-- Images Note -->
        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
           <p class="text-xs font-bold text-amber-700 dark:text-amber-400">Nota: La subida de imágenes y planos geográficos se habilitará al guardar y crear el expediente del espacio.</p>
        </div>
      </div>
      <template #footer>
         <div class="flex justify-end gap-3 w-full border-t border-surface-100 dark:border-surface-800 pt-4 px-4 pb-4">
            <DsButton label="Eliminar" variant="danger" icon="pi pi-trash" v-if="editingSpace" @click="deleteSpace" />
            <div class="flex-1"></div>
            <DsButton label="Cancelar" variant="secondary" @click="managerVisible = false" />
            <DsButton label="Guardar Espacio" variant="primary" icon="pi pi-save" :loading="saving" @click="saveSpace" />
         </div>
      </template>
    </DsModal>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { spaceService, type Space } from '../services/spaceService';
import DsPageHeader from '../components/ui/DsPageHeader.vue';
import DsButton from '../components/ui/DsButton.vue';
import DsSearchBar from '../components/ui/DsSearchBar.vue';
import DsSelect from '../components/ui/DsSelect.vue';
import DsStatusBadge from '../components/ui/DsStatusBadge.vue';
import DsLoadingState from '../components/ui/DsLoadingState.vue';
import DsModal from '../components/ui/DsModal.vue';
import DsFormField from '../components/ui/DsFormField.vue';
import DsInput from '../components/ui/DsInput.vue';

const spaces = ref<Space[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const filterType = ref('all');
const sortOrder = ref('default');

const typeOptions = [
  { label: 'Todos los Tipos', value: 'all' },
  { label: 'Local', value: 'local' },
  { label: 'Isla', value: 'isla' },
  { label: 'Evento', value: 'evento' },
  { label: 'Publicidad', value: 'publicidad' },
  { label: 'Espacio', value: 'espacio' }
];

const sortOptions = [
  { label: 'Orden: Defecto', value: 'default' },
  { label: 'Precio: Menor', value: 'price_asc' },
  { label: 'Precio: Mayor', value: 'price_desc' }
];

const managerVisible = ref(false);
const editingSpace = ref<Space | null>(null);
const saving = ref(false);

interface SpaceForm extends Partial<Space> {
  isActive?: boolean;
  digitalMediaType?: string;
  digitalDurationValue?: number;
}

const form = ref<SpaceForm>({
  code: '',
  name: '',
  spaceType: 'local',
  description: '',
  capacity: 0,
  material: '',
  location: '',
  width: undefined,
  height: undefined,
  measureUnit: 'm',
  isDigital: false,
  digitalMediaType: 'imagen',
  digitalDurationValue: undefined,
  basePricePerHour: 0,
  allowsAgreement: false,
  isActive: true
});

const filteredSpaces = computed(() => {
  let result = [...spaces.value];
  
  if (filterType.value !== 'all') {
    result = result.filter(s => (s.spaceType || '').toLowerCase() === filterType.value);
  }
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(s => 
      s.name.toLowerCase().includes(q) || 
      (s.code && s.code.toLowerCase().includes(q)) ||
      (s.description && s.description.toLowerCase().includes(q))
    );
  }

  if (sortOrder.value === 'price_asc') {
    result.sort((a, b) => (a.basePricePerHour || 0) - (b.basePricePerHour || 0));
  } else if (sortOrder.value === 'price_desc') {
    result.sort((a, b) => (b.basePricePerHour || 0) - (a.basePricePerHour || 0));
  }
  
  return result;
});

const fetchSpaces = async () => {
  loading.value = true;
  try {
    spaces.value = await spaceService.getAll();
  } catch (error) {
    console.error("Failed to fetch spaces", error);
  } finally {
    loading.value = false;
  }
};

const filterCatalog = () => {
  // Computed property handles this automatically
};

const openManagerModal = (space?: Space) => {
  if (space) {
    editingSpace.value = space;
    form.value = {
      ...space,
      isActive: space.status === 'AVAILABLE' || space.status === 'MAINTENANCE' || space.status === undefined ? true : false,
      capacity: space.capacity || 0,
      basePricePerHour: space.basePricePerHour || 0
    };
  } else {
    editingSpace.value = null;
    form.value = {
      code: '', name: '', spaceType: 'local', description: '', capacity: 0,
      material: '', location: '', width: undefined, height: undefined, measureUnit: 'm',
      isDigital: false, digitalMediaType: 'imagen', digitalDurationValue: undefined,
      basePricePerHour: 0, allowsAgreement: false, isActive: true
    };
  }
  managerVisible.value = true;
};

const saveSpace = async () => {
  saving.value = true;
  try {
    const payload: Partial<Space> = {
      ...form.value,
      status: form.value.isActive ? 'AVAILABLE' : 'INACTIVE',
      // Provide defaults for strict Prisma validations
      areaSqm: form.value.width && form.value.height ? form.value.width * form.value.height : 0,
      allowsAgreement: form.value.allowsAgreement || false,
      isDigital: form.value.isDigital || false
    };
    
    if (editingSpace.value) {
      await spaceService.update(editingSpace.value.id, payload);
    } else {
      await spaceService.create(payload);
    }
    managerVisible.value = false;
    fetchSpaces();
  } catch (error) {
    console.error("Failed to save space", error);
  } finally {
    saving.value = false;
  }
};

const deleteSpace = async () => {
  if (!editingSpace.value) return;
  if (confirm("¿Estás seguro de eliminar este espacio?")) {
    try {
      await spaceService.remove(editingSpace.value.id);
      managerVisible.value = false;
      fetchSpaces();
    } catch (e) {
      console.error(e);
    }
  }
};

onMounted(() => {
  fetchSpaces();
});
</script>

