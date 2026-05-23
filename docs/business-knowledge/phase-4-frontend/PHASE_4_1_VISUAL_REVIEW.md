# PHASE 4.1 VISUAL REVIEW

## 1. Login
El componente `LoginView.vue` fue sometido a validación:
- **Desktop / Laptop**: Centrado en tarjeta (Card) flotante. Inputs espaciosos (40px height).
- **Tablet / Mobile**: Contenedor pasa a `w-full p-4`, quitando márgenes laterales innecesarios.

## 2. Theme Engine (4-Way Matrix)
La conmutación es instantánea usando clases inyectadas en el `body`:
- **PM Light**: Background `surface-50` blanco, acentos `red-600`.
- **PM Dark**: Background `surface-950` negro matte, acentos `red-500`.
- **CP Light**: Background `surface-50` perla, acentos `amber-700`.
- **CP Dark**: Background `surface-950`, acentos `amber-500`.

## 3. App Shell
El `AppLayout.vue` soporta:
- **Sidebar**: Fijo en Desktop (w-64), escondido en Mobile bajo un botón hamburguesa.
- **Tenant Badge**: Arriba a la izquierda, indicando siempre de qué lado de la barda estamos.

## 4. Design Playground
Visitable en `/playground`. Demuestra los estados activos y pasivos de los componentes de la librería base (`DsButton`, `DsInput`, `DsCard`, etc.).