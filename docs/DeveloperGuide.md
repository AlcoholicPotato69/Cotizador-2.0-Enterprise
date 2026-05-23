# Guía de Desarrollo - Cotizador 2.0 Enterprise

Esta guía explica a desarrolladores futuros cómo extender el sistema sin romper la arquitectura mantenible (Opción B).

## Reglas de Oro

1. **Nunca acceder a PocketBase directamente desde un Componente Vue**. Siempre usa un servicio en `src/services/`.
2. **Nunca hacer consultas que no estén aisladas por Tenant**, a menos que seas SuperAdmin.
3. **No usar estado local para variables globales**. Si necesitas el usuario, token, permisos o tenant, leélo del Store de Pinia correspondiente.

## 1. ¿Cómo agregar un nuevo Módulo? (ej. Agenda)

1. **Crear Directorio**: Crea la carpeta `src/modules/agenda/`.
2. **Subestructura**: Dentro, crea `pages/`, `components/`, `services/`, `types/`.
3. **Servicio Base**: Crea `src/modules/agenda/services/agendaService.ts`. Aquí importarás `pb` desde tu inicializador global de PocketBase.
4. **Página Base**: Crea `src/modules/agenda/pages/AgendaIndex.vue`.
5. **Ruta**: Registra la ruta en `src/router/index.ts` usando Lazy Loading:
   ```ts
   {
     path: '/agenda',
     component: () => import('@/modules/agenda/pages/AgendaIndex.vue'),
     meta: { requiresAuth: true, permission: 'agenda:view' }
   }
   ```

## 2. ¿Cómo agregar y usar Permisos (RBAC)?

1. **Definir el Permiso**: Los permisos se definen en la Base de Datos (PocketBase) dentro del JSON del Rol asignado al usuario.
2. **Uso en Frontend (Rutas)**: Agrega la propiedad `permission` en el `meta` de Vue Router. El Guard centralizado (`src/router/authGuard.ts`) bloqueará el acceso automáticamente si el usuario no tiene dicho permiso.
3. **Uso en Frontend (UI/Botones)**: Usa el store de permisos.
   ```vue
   <script setup>
   import { usePermissionsStore } from '@/stores/permissionsStore'
   const { can } = usePermissionsStore()
   </script>

   <template>
     <Button v-if="can('quotes:delete')" label="Eliminar Cotización" severity="danger" />
   </template>
   ```

## 3. ¿Cómo agregar nuevas Pantallas a un Módulo?

Si ya tienes un módulo (ej. `quotes/`), y quieres agregar una pantalla de "Detalle":
1. Crea el archivo `src/modules/quotes/pages/QuoteDetail.vue`.
2. Registra la ruta como hija o ruta paralela en `src/router/index.ts`.
3. Si la pantalla necesita datos, llama a `quotesService.getQuote(id)` en el ciclo `onMounted` o usa `Suspense`.

## 4. Estilos y Design System

- Usa **PrimeVue** como framework base (botones, inputs, tablas).
- No uses Tailwind ni estilos utilitarios genéricos si no están aprobados.
- Para modificar la apariencia global, altera las variables CSS en `src/assets/design-system.css`.
- Para estilos específicos de un componente, usa `<style scoped>` dentro de tu `.vue`. Evita selectores profundos que rompan la encapsulación.
