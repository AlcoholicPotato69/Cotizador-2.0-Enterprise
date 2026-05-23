# Arquitectura - Cotizador 2.0 Enterprise

Este documento describe la arquitectura tecnológica y los principios de diseño del sistema Cotizador 2.0 Enterprise, el cual busca reemplazar la infraestructura legacy asegurando escalabilidad, mantenibilidad (Opción B: Simplicidad sobre sobreingeniería) y facilidad de entendimiento para futuros desarrolladores.

## 1. Topología del Sistema

El sistema utiliza una arquitectura **SPA (Single Page Application) + BaaS (Backend as a Service)**.
- **Frontend**: Vue 3 (Composition API), Vite, TypeScript, Pinia, Vue Router, PrimeVue.
- **Backend**: PocketBase (SQLite, Go) ejecutándose como un único binario.

## 2. Frontend Arquitectura (App Shell)

Se utiliza el patrón de **Application Shell** para garantizar que los módulos de negocio se concentren únicamente en su lógica, delegando la infraestructura común (navegación, seguridad, notificaciones) al entorno global.

### 2.1 Estructura de Directorios

La carpeta `src/` está rígidamente estructurada para evitar que el proyecto se vuelva inmanejable:

- `app/`: Configuración de inicialización (`main.ts`, setup de plugins como PrimeVue, PocketBase, Pinia).
- `router/`: Configuración de **Vue Router**. Aquí residen los Guards centralizados (`authGuard`, `tenantGuard`).
- `stores/`: Manejo de estado global usando **Pinia**. Contiene stores altamente documentados.
- `services/`: La **única capa autorizada** para interactuar con PocketBase. Aísla las consultas de base de datos de los componentes Vue.
- `composables/`: Hooks reactivos compartidos (ej. `useFormatDate`, `usePdfGenerator`).
- `layouts/`: Componentes estructurales. El más importante es `AppShell.vue`.
- `modules/`: Módulos de negocio aislados (ej. `clients/`, `quotes/`, `contracts/`). Cada módulo es una "mini-app" con sus propias páginas y componentes específicos.
- `shared/`: Componentes UI reutilizables transversalmente (modales, tablas base).
- `types/`: Definiciones de TypeScript genéricas.

### 2.2 Estado Global (Pinia Stores)

El estado se divide en 4 pilares:
1. **`authStore`**: Gestiona el token JWT, login, logout y la identidad del usuario actual (`pb.authStore`).
2. **`permissionsStore`**: Única fuente de verdad para el RBAC. Calcula los roles y permisos efectivos basados en la sesión.
3. **`tenantStore`**: Almacena el Tenant seleccionado (Plaza Mayor o Casa de Piedra) y provee los datos de branding (logo, colores, membrete) al UI.
4. **`uiStore`**: Estado efímero de interfaz (Loaders globales, Notificaciones, visibilidad de Modales transversales).

## 3. Backend Arquitectura (PocketBase)

Se utiliza PocketBase **oficial sin forks**. Las reglas de negocio, seguridad y validaciones se implementan mediante:
1. **API Rules**: Reglas declarativas evaluadas por cada petición. Ej: `@request.auth.tenant_id = tenant_id`.
2. **JS Hooks** (Opcionales): Para lógicas complejas antes/después de operaciones (ej. triggers de auditoría).
3. **Migraciones**: Todo cambio de esquema se versiona en `pb_migrations/`.

## 4. RBAC (Rol-Based Access Control)

La seguridad es "Default Deny".
- **Backend**: Protege los datos filtrando consultas según el Tenant y validando los permisos en el token/registro del usuario.
- **Frontend**: El `permissionsStore` expone funciones como `can('quotes:approve')`. Estas funciones se usan en directivas `v-if` y en los Route Guards para mostrar/ocultar botones o bloquear navegación de forma limpia.

## 5. Diseño Multi-Tenant (Aislamiento Total)

- Todo registro en el backend (clientes, cotizaciones, etc.) tiene un `tenant_id`.
- En el frontend, el `tenantStore` inyecta dinámicamente colores CSS y logotipos según el Tenant activo, lo que permite que una misma vista "Contratos" luzca como Plaza Mayor o Casa de Piedra sin necesidad de duplicar código Vue.

## 6. Motor Documental

La generación de documentos (PDFs, facturas, contratos) rechaza la generación de HTML hardcodeado en strings:
- Los documentos son **Componentes de Vue**.
- Se construyen "Vistas de Impresión" aisladas, que se ocultan en la UI normal.
- El sistema clona ese DOM, le inyecta las variables dinámicas, y lo procesa mediante una librería externa (como `jspdf` o `html2pdf`) manteniendo los estilos CSS consistentes.
- Los membretes fiscales (header/footer) se leen del `tenantStore` y se aplican como *overlays* en el documento final.
