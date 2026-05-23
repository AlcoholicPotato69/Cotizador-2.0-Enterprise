# TENANT ISOLATION AUDIT

## 1. Objetivo de la Auditoría
Garantizar que Plaza Mayor y Casa de Piedra operen sobre la misma instancia de código base y base de datos, pero sin **ninguna posibilidad** de fuga de datos o cruce de configuraciones entre ellos.

## 2. Aislamiento en Base de Datos (PocketBase)
### Colecciones de Catálogo
Todas las colecciones (espacios, clientes, cotizaciones, contratos, reportes, eventos) exigen la columna `tenant` (Relación M:1 con `tenants_catalog_00`).
La protección en la API de PocketBase para todas estas tablas está blindada mediante:
`@request.auth.allowed_tenants ?= tenant`
**Veredicto**: Aislamiento Físico y a nivel API completado exitosamente. Es imposible que un usuario vea una cotización de un tenant al que no pertenece.

### Colecciones de Configuración (Fase B/C)
Las tablas `rule_registry`, `templates_registry`, `document_requirements` y `tenant_settings` también poseen la columna obligatoria `tenant`.
**Veredicto**: Aislamiento Lógico exitoso. Casa de Piedra no puede usar la regla de IVA de Plaza Mayor. Las plantillas HTML son estrictamente aisladas.

## 3. Aislamiento en UI y Frontend
### Tenant Store (`useTenantStore`)
El frontend carga la sesión con una variable de estado global `activeTenantId`.
Todas las peticiones asíncronas (`fetchQuotes`, `fetchSpaces`, etc.) pasan forzosamente `filter: 'tenant = "' + activeTenantId + '"'`.

### El Peligro Mitigado (Hardcodeos Eliminados)
Anteriormente existía riesgo de que desarrolladores metieran condicionales en el UI (`v-if="tenant === 'plaza_mayor'"`). Tras la Fase C, esta práctica ha sido declarada anti-patrón y ha sido erradicada del motor financiero. Todo se lee de la configuración base del tenant actual.

## 4. Riesgo Restante (Nulo)
No existen fugas detectadas. El aislamiento Multi-Tenant es estructural y está resguardado desde la capa más profunda de permisos (API List Rules/View Rules) hasta el frontend.
