# BACKEND INTEGRITY & FRONTEND COMPATIBILITY PROGRAM

## Objetivo
Garantizar que el frontend se construya sobre comportamiento real y no sobre supuestos.

## Regla Principal
Antes de implementar cualquier vista, el sistema debe ejecutar una auditoria completa del backend.

## Prohibido
- Crear mocks frontend para ocultar problemas backend.
- Crear datos ficticios para aparentar funcionamiento.
- Ignorar errores de API.
- Asumir contratos de respuesta.

Todo endpoint debera ser validado fisicamente.

## Nuevo Equipo
- Backend Integration Auditor
- API Contract Auditor
- Business Flow Auditor
- RBAC Auditor
- Snapshot Auditor
- Document Lifecycle Auditor
- Frontend Integration Architect

## Inventario Backend
Generar: `BACKEND_INVENTORY_REPORT.md`

Analizando:
- Dominios
- Modulos
- Controladores
- Endpoints
- DTOs
- Eventos
- Permisos
- Snapshots
- Jobs
- Storage
- Plantillas
- Reportes

Clasificar:
- IMPLEMENTADO
- PARCIAL
- ROTO
- HUERFANO
- NO UTILIZADO

## Auditoria de Endpoints
Generar: `API_CONTRACT_AUDIT.md`

Validando:
- Request DTO
- Response DTO
- Swagger
- Permisos
- Tenant Isolation
- Soft Delete
- Paginacion

Detectar:
- Endpoints sin documentacion
- Endpoints sin permisos
- Endpoints sin tenant
- Endpoints sin validacion
- Endpoints sin manejo de errores

## Auditoria RBAC
Generar: `RBAC_BACKEND_AUDIT.md`

Verificar:
- 100% endpoints protegidos
- 100% permisos documentados
- 0 role hardcoded
- 0 superadmin hardcoded

Buscar:
- `role ===`
- `user.role ===`
- `isAdmin()`

## Auditoria Multi-Tenant
Generar: `TENANT_ISOLATION_AUDIT.md`

Validar:
- Plaza Mayor
- Casa de Piedra

Intentar:
- Tenant Escape
- Cross Tenant Read
- Cross Tenant Write

## Auditoria de Snapshots
Generar: `SNAPSHOT_INTEGRITY_AUDIT.md`

Verificar:
- Client Snapshot
- Quote Snapshot
- Contract Snapshot
- Invoice Snapshot

Validar:
- Inmutabilidad
- Hash
- Versionado
- Integridad

## Auditoria Documental
Generar: `DOCUMENT_LIFECYCLE_AUDIT.md`

Validar:
- Client File
- Quote File
- Contract File
- Agreement File
- Financial File

Verificar:
- Storage
- Viewer
- Descarga
- Versionado
- Legal Hold
- Retencion

## Auditoria de Negocio
Simular:

Plaza Mayor
Cliente
↓
Expediente
↓
Espacio Publicitario
↓
Cotizacion
↓
Contrato
↓
Factura
↓
Pago

Convenios Plaza Mayor
Cliente
↓
Convenio
↓
Carta Convenio
↓
Firma
↓
Entrega

Casa de Piedra
Cliente
↓
Expediente
↓
Salon
↓
Reserva
↓
Cotizacion
↓
Contrato
↓
Factura
↓
Pago

Generar: `BUSINESS_FLOW_AUDIT.md`

## Frontend Compatibility Check
Antes de construir una vista, verificar:
- Existe endpoint
- Existe DTO
- Existe permiso
- Existe documentacion
- Existe flujo de negocio

Si algo falta:
- NO crear workaround.
- NO crear mocks.
- NO inventar comportamiento.

Crear: `BACKEND_DEFECT_REPORT.md`

Documentando:
- Modulo
- Problema
- Impacto
- Solucion sugerida

## Protocolo de Correccion
Si se detecta:
- Endpoint roto
- Permiso faltante
- Respuesta inconsistente
- DTO incorrecto
- Error de tenant
- Error de snapshot

El equipo debe:
1. Auditar
2. Corregir Backend
3. Re-ejecutar pruebas
4. Certificar
5. Continuar Frontend

## Bloqueo Absoluto
NO IMPLEMENTAR:
- CRM
- Catalog
- Quotes
- Agreements
- Contracts
- Finance
- Reports
- Dossier

Hasta que:
- `BACKEND_INTEGRITY = PASS`
- `API_CONTRACTS = PASS`
- `RBAC = PASS`
- `TENANT_ISOLATION = PASS`
- `SNAPSHOTS = PASS`
- `DOCUMENT_LIFECYCLE = PASS`

## Resultado Esperado
El frontend debe convertirse en una validacion viva del backend.

No se permitira construir interfaces sobre:
- Endpoints incompletos
- Permisos faltantes
- Contratos API ambiguos
- Flujos de negocio rotos
- Snapshots inconsistentes

La prioridad es:
Backend Integrity
↓
Frontend Integration
↓
Frontend Implementation
↓
Frontend Certification

## Mandatory Extension
Este programa incluye una extension obligatoria:

- `docs/product/MEGA_MANDATO_BACKEND_V11_0.md`
- `docs/product/MEGA_MANDATO_EXECUTION_MODE_V1_0.md`
- `docs/product/ENTERPRISE_BUSINESS_CONTEXT_EXTENSION.md`
- `docs/product/ENTERPRISE_FRONTEND_READINESS_EXTENSION.md`

No se permite continuar implementacion frontend si estas extensiones no estan aplicadas y certificadas.
