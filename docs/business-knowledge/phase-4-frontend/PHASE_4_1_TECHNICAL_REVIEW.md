# PHASE 4.1 TECHNICAL REVIEW

## 1. Permission Driven Navigation
El archivo `src/router/navigation.ts` expone `getAuthorizedNavigation()`. Al renderizar el `Sidebar.vue`, el ciclo `v-for` filtra rutas donde `permissionStore.can(route.permission)` sea falso. Al revocar el permiso `finance.view` a un rol comercial, el enlace "Finanzas" desaparece del DOM, no solo se oculta con CSS.

## 2. Session Management Cycle
- **Login**: Inyecta estado en `authStore`. Redirige a `/`.
- **Refresh**: El `App.vue` montará una validación silenciosa.
- **Expiración**: El `sessionStore` mide 15 minutos de inactividad, invocando `authStore.logout()`.
- **Logout**: Limpia Pinia, destruye caché y redirige a `/login`.

## 3. Estrategia DEV vs PROD (Playground)
La ruta `/playground` es esencial para el equipo UI, pero letal si se expone a clientes.
**Estrategia Aplicada**: El `router.beforeEach` evalúa `import.meta.env.PROD`. Si es `true` (Compilación a Producción), cualquier intento de navegar a `/playground` redirige silenciamente a `/`. El compilador de Vite (Tree-Shaking) descartará los componentes exclusivos del Playground.