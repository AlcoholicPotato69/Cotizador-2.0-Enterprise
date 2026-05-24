# CONSTITUCIÓN TÉCNICA DEL ERP COTIZADOR 2.0 ENTERPRISE

**Status:** CONSTITUTION_FROZEN_V7.2
**Date:** 2026-05-23

## 1. Principios Arquitectónicos
- **Source Purity:** Prohibido lecturas cruzadas directas. Intercambio exclusivo vía Snapshots, DTOs y Domain Events.
- **Multi-Tenant Mandatory:** `tenant_id` obligatorio en todas las tablas.
- **Soft Delete Mandatory:** `deleted_at` y `deleted_by` obligatorios.
- **UTC Only:** Todas las fechas en el backend son `UTC`.
- **API Versioning:** Obligatorio prefijo `/api/v1` en todos los endpoints preparando compatibilidad futura.

## 2. Motores Transversales (Engines)
1. **Auth Engine:** JWT, Refresh Rotation.
2. **Tenant Engine:** Aislamiento empresarial.
3. **RBAC Engine:** Verificación estricta de `permissions`. Prohibido hardcodear roles.
4. **Settings & Tax Engine:** `SettingsService` orquesta configuración. IVA y variables fiscales viven en `TaxConfiguration`. Cero hardcoding.
5. **Audit Engine:** Hash Chain, Tamper Detection inmutable.
6. **Snapshot Engine:** Garantiza inmutabilidad.
7. **Approval Engine:** Secuencial, Paralelo, Quorum.
8. **Domain Event Engine:** Eventos asíncronos EDA.
9. **Numbering Engine:** Folios auditables.
10. **Jobs / Scheduler Domain:** Centraliza Retention, Tamper Detection, Notifications y Expiration en un `SchedulerService` único. Prohibidos los cron jobs aislados.
11. **Financial Reconciliation Engine:** Todo balance se materializa en DB. `balance_due`, `amount_paid`, `payment_status` se actualizan atómicamente por el `InvoiceBalanceEngine` tras cada pago. Prohibidos los cálculos al vuelo.

## 3. Finanzas, Moneda y Facturación
- **Money Domain Standardization:** Prohibido usar `float` o `double` para dinero. Obligatorio `Prisma Decimal`. Toda operación pasa por `MoneyService`.
- **Currency Domain:** Multimoneda desde Día 1. Almacenar `currency_code` (MXN base).
- **Document Generation Domain:** Prohibido generar PDFs desde módulos comerciales. Todo pasa por `DocumentGenerationService`.
- **Contract Template Engine:** Prohibido HTML hardcodeado. Todo contrato usa plantillas activas de base de datos.

## 4. Estándares API y Datos
- **Search & Filter:** Todo endpoint lista soporta paginación, sorting y filtrado estandarizado (`page`, `pageSize`, `sort`, `filter`).
- **Bulk Operations Policy:** Soporte de Bulk Update, Archive y Export. Todo bulk dispara eventos y auditoría obligatoria.
- **Import / Export Domain:** CSV, Excel. Con validación pre-persistencia.
- **Error Catalog:** Prohibido arrojar mensajes string aleatorios. Uso de catálogo `ERP-CLIENT-001`, `ERP-INVOICE-001`.

## 5. Reglas de Programación y Gobernanza Autónoma
- **Arquitectura Hexagonal:** Obligatorio.
- **Límites de Ingeniería Autónoma:** Los agentes NO pueden crear nuevos dominios, estados, eventos, permisos o entidades sin actualizar previamente los documentos constitucionales. Si se requiere cambio estructural: se crea ADR y se espera aprobación ejecutiva.
