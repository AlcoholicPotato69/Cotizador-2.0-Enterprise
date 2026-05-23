# POCKETBASE MIGRATION AUDIT
**Fecha:** 2026-05-21

## 1. Archivos Movidos al Directorio `/archive`

Las siguientes 19 migraciones fueron removidas de `pb_migrations/` y reubicadas en `pb_migrations/archive/`:

1. `1700000000_init_v2.js`
2. `1710000001_core_schema.js`
3. `1710000002_users_rbac.js`
4. `1710000003_clientes_schema.js`
5. `1710000004_espacios_schema.js`
6. `1710000005_cotizaciones_schema.js`
7. `1710000006_documentos_schema.js`
8. `1710000007_contratos_schema.js`
9. `1710000008_rule_engine_registry.js`
10. `1710000009_tenant_settings_templates.js`
11. `1710000010_document_requirements_schema.js`
12. `1710000011_snapshots_cotizaciones_contratos.js`
13. `1710000012_deep_snapshots.js`
14. `1710000013_rbac_normalization.js`
15. `1710000014_security_audit_log.js`
16. `1710000015_f2_builders.js`
17. `1710000016_reservations.js`
18. `1710000017_financial_closing.js`
19. `1710000018_branding_hybrid_rbac.js`

## 2. Motivo del Movimiento

**Incompatibilidad Fatal de Motor y Sintaxis (Crash de Inicio)**.
El ejecutable binario actual de PocketBase (detectado como versión 0.38.1 / equivalente a v0.23+ del nuevo motor JSVM) eliminó el objeto global `Dao` (`new Dao(db)`). 
Los scripts de migración antiguos utilizaban esta sintaxis. Durante el arranque, esto generaba una excepción `ReferenceError: Dao is not defined` (en el caso de las migraciones que intentaban ejecutarse) o un error de colisión `Collection name must be unique` debido a que el esquema ya había sido embebido en el archivo `data.db` previamente. Para permitir el encendido del servidor, las migraciones obsoletas fueron aisladas.

## 3. Impacto Potencial

* **Riesgo Bajo en Runtime Actual:** Dado que el archivo `pb_data/data.db` actual (200KB) ya contiene las colecciones históricas aplicadas (como se comprobó al levantar el motor), no aislar estas migraciones significa que el sistema puede correr con normalidad con las tablas existentes.
* **Riesgo Alto en Despliegues desde Cero (CI/CD):** Si se intenta levantar un entorno vacío y limpio sin el archivo `data.db` actual, el sistema no tendrá ningún esquema. Será imperativo re-generar estas migraciones o extraer un `pb_schema.json` base compatible con v0.23+ para la inicialización.
