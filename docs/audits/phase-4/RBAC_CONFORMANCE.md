# RBAC & PERMISSIONS CONFORMANCE AUDIT

**Generado:** 2026-05-22T05:38:00.000Z

## Evidencia Física y Ejecutable

### 1. Sistema de Autorización en Frontend (Directivas)
* **Documento:** `FRONTEND_AUTHORIZATION_ARCHITECTURE.md`
* **Archivo Real:** `src/directives/permission.ts` y `src/stores/permissionsStore.ts`
* **Prueba Ejecutada:** Verificar existencia de `v-permission` y su inyección.
* **Resultado:** La directiva `v-permission` existe, está registrada globalmente y llama a `usePermissionsStore().can(permission)`. La capa visual reacciona ocultando el elemento.
* **Clasificación:** **A** (Estructura base de Vue).

### 2. Fuente de Verdad de Permisos (La vulneración)
* **Archivo Real:** `src/views/clients/ClientListView.vue` (Línea 66)
* **Prueba Ejecutada:** Trazabilidad de cómo se llena el store de permisos.
* **Resultado:** Falla crítica (Mock Data Detectado). El componente inyecta hardcodeado: `permissions.setPermissions(['client.read', 'client.create', 'client.update', 'client.documents.read', 'client.banking.read'])`. Los permisos **no provienen de PocketBase**. 
* **Clasificación:** **C**

### 3. Guards de Rutas
* **Archivo Real:** `src/router/index.ts`
* **Prueba Ejecutada:** Inspección de guards de enrutador.
* **Resultado:** El enrutador bloquea accesos no autenticados, pero NO lee el `permissionStore` de manera dinámica para impedir navegar a pantallas donde no hay permisos de lectura.
* **Clasificación:** **C**

## Conclusión del Dominio RBAC
La UI aparenta soportar permisos y ocultar botones, pero opera con un simulador local sin ninguna conexión a los roles y reglas de negocio del Backend.

**Calificación Final del Dominio: C (Usa Mocks Hardcodeados)**
