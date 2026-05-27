<template>
  <div class="condition-group p-3 border-1 border-round relative mb-3" :class="groupClass">
    <div class="absolute font-bold px-2 py-1 text-xs border-round" :class="badgeClass" style="top: -10px; left: 10px;">
      {{ modelValue.type === 'AND' ? 'AND (Todas deben cumplirse)' : 'OR (Al menos una debe cumplirse)' }}
    </div>
    
    <div class="flex justify-content-end mb-2">
      <Button v-if="!isRoot && canEdit" icon="pi pi-times" class="p-button-danger p-button-text p-button-sm" @click="$emit('remove')" />
    </div>

    <div v-for="(rule, index) in modelValue.rules" :key="index" class="mb-2">
      <template v-if="rule.type === 'AND' || rule.type === 'OR'">
        <RuleConditionGroup v-model="modelValue.rules[index]" :canEdit="canEdit" @remove="removeRule(index)" />
      </template>
      <template v-else>
        <div class="condition-row flex gap-2 align-items-center">
          <select v-model="rule.field" class="p-2 border-round border-1 border-surface-300 dark:border-surface-600 flex-1 text-sm bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0" :disabled="!canEdit">
            <option value="context.cliente.tipo_persona">Tipo de Persona (Física/Moral)</option>
            <option value="context.espacio.categoria">Categoría del Espacio</option>
            <option value="context.fechas.dia_semana">Día de la Semana</option>
            <option value="context.cotizacion.monto_total">Monto Total</option>
            <option value="context.cotizacion.duracion_horas">Duración (Horas)</option>
            <option value="context.cotizacion.anticipacion_dias">Anticipación (Días)</option>
            <option value="context.cliente.antiguedad_meses">Antigüedad del Cliente (Meses)</option>
            <option value="context.cliente.segmento">Segmento de Cliente</option>
            <option value="context.promocion.codigo">Código Promocional</option>
          </select>
          <select v-model="rule.operator" class="p-2 border-round border-1 border-surface-300 dark:border-surface-600 text-sm bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0" :disabled="!canEdit">
            <option value="EQUALS">Igual a</option>
            <option value="NOT_EQUALS">Diferente de</option>
            <option value="CONTAINS">Contiene</option>
            <option value="GREATER_THAN">Mayor que</option>
            <option value="LESS_THAN">Menor que</option>
            <option value="IN">En lista (separado por comas)</option>
          </select>
          <input type="text" v-model="rule.value" class="p-2 border-round border-1 border-surface-300 dark:border-surface-600 flex-1 text-sm bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0" placeholder="Valor" :disabled="!canEdit" />
          <Button icon="pi pi-trash" class="p-button-danger p-button-text" size="small" v-if="canEdit" @click="removeRule(index)" />
        </div>
      </template>
    </div>

    <div class="flex gap-2 mt-3" v-if="canEdit">
      <Button label="Condición" icon="pi pi-plus" class="p-button-text p-button-sm" @click="addCondition" />
      <Button label="Sub-Grupo (OR)" icon="pi pi-sitemap" class="p-button-text p-button-sm p-button-secondary" @click="addSubGroup('OR')" />
      <Button label="Sub-Grupo (AND)" icon="pi pi-sitemap" class="p-button-text p-button-sm p-button-secondary" @click="addSubGroup('AND')" />
      <Button v-if="modelValue.type === 'AND'" label="Cambiar a OR" icon="pi pi-sync" class="p-button-text p-button-sm p-button-warning" @click="modelValue.type = 'OR'" />
      <Button v-else label="Cambiar a AND" icon="pi pi-sync" class="p-button-text p-button-sm p-button-warning" @click="modelValue.type = 'AND'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from 'primevue/button';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  canEdit: {
    type: Boolean,
    default: true
  },
  isRoot: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'remove']);

const groupClass = computed(() => {
  return props.modelValue.type === 'AND' 
    ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' 
    : 'border-orange-300 bg-orange-50 dark:bg-orange-900/20';
});

const badgeClass = computed(() => {
  return props.modelValue.type === 'AND'
    ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    : 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
});

const addCondition = () => {
  props.modelValue.rules.push({
    field: 'context.espacio.categoria',
    operator: 'EQUALS',
    value: ''
  });
};

const addSubGroup = (type: string) => {
  props.modelValue.rules.push({
    type,
    rules: []
  });
};

const removeRule = (index: number | string) => {
  props.modelValue.rules.splice(Number(index), 1);
};
</script>

