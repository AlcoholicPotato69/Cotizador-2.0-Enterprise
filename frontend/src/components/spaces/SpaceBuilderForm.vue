<template>
  <div class="space-builder-form flex flex-col gap-6">
    <form @submit.prevent="saveSpace" class="flex flex-col gap-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="field">
          <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Nombre del Espacio</label>
          <InputText v-model.trim="formData.name" required autofocus class="!w-full !rounded-lg" placeholder="Ej. Gran Salón" />
        </div>
        <div class="field">
          <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Categoría / Tipo</label>
          <Dropdown v-model="formData.spaceType" :options="spaceTypes" optionLabel="label" optionValue="value" placeholder="Seleccione el tipo" class="!w-full !rounded-lg" required />
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="field">
          <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Capacidad (pax)</label>
          <InputNumber v-model="formData.capacity" :min="1" required class="!w-full" inputClass="!rounded-lg" placeholder="100" />
        </div>
        <div class="field">
          <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Superficie (m²)</label>
          <InputNumber v-model="formData.areaSqm" :min="1" required class="!w-full" inputClass="!rounded-lg" placeholder="150" />
        </div>
        <div class="field">
          <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Precio Base/Hora</label>
          <InputNumber v-model="formData.basePricePerHour" mode="currency" currency="MXN" required class="!w-full" inputClass="!rounded-lg" placeholder="$1,500.00" />
        </div>
      </div>
      
      <div class="field">
        <label class="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Descripción</label>
        <Textarea v-model.trim="formData.description" rows="3" class="!w-full !rounded-lg resize-none" placeholder="Descripción detallada del espacio..." />
      </div>

      <div class="field flex gap-4 items-center bg-surface-50 dark:bg-surface-900 p-4 rounded-xl border border-surface-200 dark:border-surface-700">
        <label class="text-sm font-semibold text-surface-700 dark:text-surface-200">Estado Inicial</label>
        <div class="flex gap-4">
          <div class="flex items-center gap-2">
            <RadioButton v-model="formData.status" inputId="status1" name="status" value="AVAILABLE" />
            <label for="status1" class="text-sm cursor-pointer">Disponible</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioButton v-model="formData.status" inputId="status2" name="status" value="MAINTENANCE" />
            <label for="status2" class="text-sm cursor-pointer">Mantenimiento</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioButton v-model="formData.status" inputId="status3" name="status" value="INACTIVE" />
            <label for="status3" class="text-sm cursor-pointer">Inactivo</label>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
        <Button label="Cancelar" icon="pi pi-times" text severity="secondary" @click="$emit('cancel')" class="!rounded-lg" />
        <Button type="submit" label="Guardar Espacio" icon="pi pi-save" :loading="spaceStore.saving" class="!bg-indigo-600 hover:!bg-indigo-700 !border-none !text-white !rounded-lg px-6" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import { useSpaceStore } from '../../stores/spaceStore';
import type { Space } from '../../services/spaceService';

const props = defineProps<{
  initialData?: Space
}>();

const emit = defineEmits(['cancel', 'saved']);

const spaceStore = useSpaceStore();

const formData = ref<Partial<Space>>({
  name: '',
  spaceType: '',
  capacity: 0,
  areaSqm: 0,
  basePricePerHour: 0,
  description: '',
  status: 'AVAILABLE',
  allowsAgreement: false,
  isDigital: false
});

const spaceTypes = ref([
  { label: 'Salones de Eventos', value: 'salones' },
  { label: 'Publicidad Física', value: 'publicidad_fisica' },
  { label: 'Publicidad Digital', value: 'publicidad_digital' },
]);

onMounted(() => {
  if (props.initialData) {
    formData.value = { ...formData.value, ...props.initialData };
  }
});

const saveSpace = async () => {
  if (!formData.value.name || !formData.value.spaceType || !formData.value.capacity || !formData.value.areaSqm || !formData.value.basePricePerHour) {
    return;
  }
  
  try {
    if (props.initialData?.id) {
      await spaceStore.updateSpace(props.initialData.id, formData.value);
    } else {
      await spaceStore.createSpace(formData.value);
    }
    emit('saved');
  } catch (error) {
    console.error('Error saving space:', error);
  }
};
</script>

