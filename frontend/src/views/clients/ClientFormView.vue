<template>
  <div class="space-y-6">
    <DsPageHeader title="Nuevo Cliente" subtitle="Validación Master Data Management" :breadcrumbs="[{label: 'Inicio', to: '/'}, {label: 'Clientes', to: '/clients'}, {label: 'Nuevo', to: '/clients/new'}]" />
    
    <div class="px-6 max-w-4xl mx-auto">
      <DsCard>
        <template #header>Datos Fiscales</template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DsFormField label="Tipo de Persona" required>
            <DsSelect v-model="type" :options="['moral', 'fisica']" placeholder="Seleccione" />
          </DsFormField>
          
          <DsFormField label="RFC" required hint="12 o 13 caracteres">
            <DsInput v-model="rfc" placeholder="XAXX010101000" />
          </DsFormField>
          
          <DsFormField :label="type === 'moral' ? 'Razón Social' : 'Nombre Completo'" required>
            <DsInput v-model="name" placeholder="Ingrese el nombre oficial..." />
          </DsFormField>
          
          <DsFormField v-if="type === 'fisica'" label="CURP" required>
            <DsInput v-model="curp" placeholder="Ingrese CURP..." />
          </DsFormField>
          <DsFormField v-if="type === 'moral'" label="Representante Legal" required>
            <DsInput v-model="rep" placeholder="Nombre del Representante..." />
          </DsFormField>
        </div>
        
        <template #footer>
          <div class="flex justify-end gap-3">
            <DsButton variant="outline" @click="$router.push('/clients')">Cancelar</DsButton>
            <DsButton variant="primary" :loading="isSaving" @click="handleSave">Guardar Cliente</DsButton>
          </div>
        </template>
      </DsCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useClientStore } from '../../stores/clientStore';
import DsPageHeader from '../../components/ui/DsPageHeader.vue';
import DsCard from '../../components/ui/DsCard.vue';
import DsFormField from '../../components/ui/DsFormField.vue';
import DsInput from '../../components/ui/DsInput.vue';
import DsSelect from '../../components/ui/DsSelect.vue';
import DsButton from '../../components/ui/DsButton.vue';

const router = useRouter();
const clientStore = useClientStore();

const type = ref('moral');
const rfc = ref('');
const name = ref('');
const curp = ref('');
const rep = ref('');
const email = ref(''); // Added email for contact
const isSaving = ref(false);

async function handleSave() {
  if (!name.value || !rfc.value) return;
  isSaving.value = true;
  try {
    await clientStore.saveClient({
      name: name.value,
      rfc: rfc.value,
      email: email.value
    });
    router.push('/clients');
  } catch (err) {
    alert("Error al guardar cliente");
  } finally {
    isSaving.value = false;
  }
}
</script>