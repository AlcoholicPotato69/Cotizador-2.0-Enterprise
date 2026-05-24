# Frontend Implementation Strategy - Cotizador 2.0 Enterprise

## 1. Arquitectura Base (Vue + PocketBase + Realtime)
- **Framework**: Vue 3 (Composition API, `<script setup>`) con TypeScript para type safety estricto.
- **State Management**: Pinia (Stores modulares por Dominio de Negocio: IAM, CRM, Quotes).
- **Routing**: Vue Router con Guards de Navegación robustos (validación de Sesión, Tenant activo y permisos RBAC).
- **Cliente Backend**: Instancia global del SDK de PocketBase en el cliente. Interacción directa sin la creación de APIs intermediarias (Code First / Prohibido Backend).

## 2. Estructura de Proyecto (Source Purity)
```text
frontend/src/
├── components/   # UI Reusable, Dumb Components (Data-In, Events-Out)
├── composables/  # Lógica reactiva (ej. useRealtimeSync, useTenant)
├── layouts/      # Estructuras maestras (Dashboard, Public, TenantView)
├── modules/      # Dominios de negocio (Cotizador, Usuarios)
├── pages/        # Vistas de enrutamiento (Smart Components)
├── stores/       # Pinia: Single Source of Truth del lado del cliente
└── utils/        # Funciones de validación puras y formateo
```

## 3. Integración Realtime (SSE)
- Conexión global gestionada vía Composable `usePocketBaseRealtime()`.
- **Tenant Isolation**: Suscripción dinámica y estricta, atada al `tenantId` en curso, garantizando que no existan fugas de información.
- **Stores Reactivos**: Los stores de Pinia escuchan eventos SSE de creación, actualización y borrado, manteniendo la UI en sincronía inmediata con PocketBase.

## 4. UX & Componentes de Interfaz
- **Estándar Enterprise**: Interfaces limpias, modo oscuro nativo y componentes escalables.
- **Feedback al Usuario**: Manejo de errores estandarizado interceptado en el cliente (Toasts) y estados de carga (Skeleton Loaders) globales.
- **Safety & Purity**: Eliminación completa de mocks en producción (`DevToolbar` removido). Toda data debe venir exclusivamente de la instancia real de PocketBase.

## 5. Responsabilidades (Fronteras Estrictas)
- **Pages**: Coordinan la llamada a Stores y administran la navegación.
- **Stores**: Encapsulan las consultas a PocketBase y mantienen la reactividad.
- **Componentes**: Cero lógica de negocio compleja, puramente presentacionales y manejadores de interacción del usuario.
- **Prohibición**: No se crean endpoints. El Frontend asume que la lógica de seguridad y reglas de negocio pesadas ya están certificadas en el backend.
