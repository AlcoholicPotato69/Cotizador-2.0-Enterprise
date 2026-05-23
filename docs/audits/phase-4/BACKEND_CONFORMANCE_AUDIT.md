# BACKEND CONFORMANCE AUDIT
**Fase:** 4.3.5
**Fecha:** 2026-05-21
**Entorno:** Runtime Local (PocketBase v0.23+)

## 1. Estructura Física
* `pb_hooks/`: Existe.
* `pb_migrations/`: Existe.
* `collections/`: Existe virtualmente a través de migraciones/db.
* Base de datos principal (`pb_data/data.db`): Encontrada y con un tamaño inicial válido (~200KB) denotando inicialización.

## 2. Framework de Seguridad (JS Hooks)
Se ha validado la ejecución en tiempo de ejecución del motor de reglas en Javascript para la versión `v0.23+`.

### 2.1. Tenant Isolation & API Enforcement (`main.pb.js`)
* **Estado:** **Funcional (Aprobado)**
* Se corrigieron los hooks a la sintaxis moderna de la v0.23+ (`onRecordCreateRequest`, `onRecordUpdateRequest`, `onRecordDeleteRequest`).
* El Hook principal aplica `enforceRbac` bloqueando mutaciones donde no se identifique un TenantID o el usuario carezca de permisos.

### 2.2. Motor RBAC / FLS (`rbac.pb.js`)
* **Estado:** **Funcional (Aprobado)**
* Normalizado a sintaxis moderna utilizando `$app.findRecordsByFilter` en lugar del obsoleto `dao()`.
* **Cálculo de Permisos Efectivos:** Integrado sobre las transacciones en memoria antes del guardado de usuarios.
* **Actualización en Cascada:** Hook activo para propagar cambios desde Roles hacia Usuarios.

## 3. Estado de la Arquitectura Documentada vs Real

* **Tenant Isolation:** Encontrado en `main.pb.js`.
* **RBAC Enforcement:** Encontrado en `main.pb.js`.
* **Audit Trail:** Encontrado en `rbac.pb.js` (`onRecordUpdate` para registro de modificaciones críticas de roles).
* **Document Integrity (Legal Hold):** Documentado teóricamente, pero **NO** existe hook JavaScript físico interceptando el borrado de documentos bajo estado "Legal Hold". (Marcado como Deuda Técnica).
* **Financial Ledger / Deep Snapshots:** Existen scripts iniciales en migrations, pero la lógica de consolidación contable real en hooks aún **NO** está implementada físicamente (Marcado como Deuda Técnica).

## 4. Correcciones Ejecutadas en Vivo
Durante la validación de arranque (Runtime), PocketBase falló (Crash inicial).
1. Se detectó incompatibilidad grave de JS Hooks de versiones previas (< v0.22) con el binario ejecutable moderno (v0.23). Se refactorizó todo el código Javascript globalmente reemplazando `Dao` por `$app` y normalizando los hooks.
2. Se implementó mitigación de colisión de esquema (`1710000001_core_schema.js`) y se archivaron migraciones antiguas incompatibles en `/archive` para permitir un arranque en frío exitoso (Exit Code 0).
