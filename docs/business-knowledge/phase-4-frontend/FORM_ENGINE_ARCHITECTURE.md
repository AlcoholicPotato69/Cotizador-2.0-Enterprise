# FORM ENGINE ARCHITECTURE (Fase 4.2)

## 1. Composición Estándar
Todo formulario en la plataforma utilizará la dupla de validación `Vuelidate` o `Zod` con Vue Composition API. Los componentes base (`DsInput`, `DsSelect`) aceptan una prop `error` que dibuja el borde rojo (`border-red-500`) y renderiza un `span` con el mensaje de error debajo.

## 2. Dynamic Autosave (Debounced)
Para Wizards comerciales largos (ej. Cotizaciones), los inputs emitirán eventos debounced (`500ms`). El motor detectará `isDirty` y ejecutará parches HTTP (`PATCH`) silenciosos hacia PocketBase para mitigar pérdidas de información.

## 3. Prevención de Doble Envío
El `DsButton type="submit"` intercepta el estado `isLoading` global del formulario, previniendo inyección duplicada de registros en el backend.