# Frontend Development Rules (Vue 3 / Composition API)

Estas reglas conforman la ley de desarrollo para los ingenieros frontend trabajando en la capa de vista de **Cotizador 2.0 Enterprise**. Su cumplimiento es estricto e indispensable para mantener la salud del Design System y la escalabilidad del producto.

## Regla 1: Prohibición Absoluta de Magic Values

Bajo ninguna circunstancia se pueden utilizar valores hardcodeados para colores, espacios, tipografía o radios de borde.

**❌ INCORRECTO:**
```css
.my-card {
  padding: 16px;
  background-color: #F8FAFC;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

**✅ CORRECTO:**
```css
.my-card {
  padding: var(--ds-space-4);
  background-color: var(--ds-color-bg-surface);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-base);
}
```

## Regla 2: Uso Exclusivo de Componentes de Librería

Si se requiere un botón, un input, o una tarjeta, **se debe importar de la librería de componentes**. No se deben construir elementos nativos `<button>` o `<input>` directamente en las vistas de la aplicación.

Si el componente de la librería no cumple con un requerimiento particular, se debe extender el componente de la librería oficial tras discutirlo, no crear un clon temporal en la vista.

## Regla 3: Vue 3 Script Setup & TypeScript

Todo desarrollo debe utilizar la sintaxis `<script setup lang="ts">`.
*   El tipado estricto es obligatorio en todas las propiedades (Props) del componente.
*   Evitar `any`.
*   Aprovechar los genéricos para componentes como Tablas o Selects.

```vue
<!-- Ejemplo estándar de componente Vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { DsButton } from '@/components/ui';

interface Props {
  isLoading?: boolean;
  actionText: string;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <DsButton 
    :loading="props.isLoading" 
    variant="primary" 
    @click="emit('click')"
  >
    {{ props.actionText }}
  </DsButton>
</template>
```

## Regla 4: Responsabilidad de Estado (Dumb vs Smart Components)

1.  **Dumb Components (Design System):** Los componentes de interfaz (Botones, Modales, Inputs) no deben conocer nada sobre Pinia, el negocio, ni llamadas a la API. Se comunican puramente mediante `props` (datos hacia abajo) y `emits` (eventos hacia arriba).
2.  **Smart Components (Views/Features):** Las vistas u orquestadores consumen los Dumb Components, gestionan el estado global y realizan inyección de dependencias y mutaciones.

## Regla 5: CSS Scope

Cuando sea estrictamente necesario escribir CSS personalizado, se debe utilizar `<style scoped>` o CSS Modules (`<style module>`) para evitar polución global en la cascada de estilos.

El Theming se gestionará modificando las clases o atributos del elemento raíz (`html` o `body`), nunca forzando reescrituras de clases mediante `!important`.
