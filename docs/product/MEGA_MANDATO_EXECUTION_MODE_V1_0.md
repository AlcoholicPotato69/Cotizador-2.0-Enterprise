# MEGA-MANDATO EXECUTION MODE V1.0

## Estado Actual

La fase de planeacion ha terminado.

Los siguientes documentos ya existen y son la fuente oficial de verdad:
- `BACKEND_INTEGRITY_FRONTEND_COMPATIBILITY_PROGRAM.md`
- `MEGA_MANDATO_BACKEND_V11_0.md`
- `ENTERPRISE_BUSINESS_CONTEXT_EXTENSION.md`
- `ENTERPRISE_FRONTEND_READINESS_EXTENSION.md`

Toda la arquitectura se considera congelada.

`ARCHITECTURE = FROZEN`

## Prohibido

- Crear nuevos planes estrategicos.
- Crear nuevas propuestas de arquitectura.
- Crear nuevos roadmaps.
- Crear documentacion redundante.
- Solicitar confirmaciones innecesarias.
- Posponer implementacion.
- Emitir PASS sin evidencia.
- Generar certificaciones sin pruebas.

A partir de este momento el objetivo es:
- IMPLEMENTAR
- AUDITAR
- CORREGIR
- REPROBAR
- CERTIFICAR

## Modo de Trabajo Obligatorio

Para cada modulo:
1. Auditar codigo existente.
2. Detectar defectos.
3. Corregir defectos.
4. Completar funcionalidades faltantes.
5. Ejecutar pruebas.
6. Documentar evidencia.
7. Continuar al siguiente modulo.

Si se detecta un problema:
- NO generar un reporte solamente.

OBLIGATORIO:
- Corregir.
- Recompilar.
- Reprobar.
- Validar.

## Enjambre Autorizado

- Enterprise Architect
- Solution Architect
- Database Architect
- Backend Lead
- Security Architect
- RBAC Auditor
- Tenant Isolation Auditor
- API Contract Auditor
- Business Process Auditor
- Catalog Business Auditor
- Agreement Auditor
- Finance Auditor
- Document Lifecycle Auditor
- Template Governance Auditor
- QA Authority
- Performance Engineer
- Forensic Auditor
- Frontend Compatibility Auditor
- Integration Auditor
- Release Authority

## Orden de Ejecucion

### Fase 1

Auditar backend completo.

Generar:
- `BACKEND_INVENTORY_REPORT.md`

Identificar:
- IMPLEMENTADO
- PARCIAL
- ROTO
- HUERFANO
- NO UTILIZADO

### Fase 2

Corregir automaticamente:
- errores de compilacion
- DTOs inconsistentes
- endpoints rotos
- permisos faltantes
- errores tenant
- errores snapshots
- errores storage
- errores documentales

### Fase 3

Comparar logica real contra:
- `H:\cotizadorpm-pocketbase`

Validar:

Plaza Mayor:
- publicidad fisica
- publicidad digital
- mupis
- pantallas
- totems
- vallas

Casa de Piedra:
- salones
- espacios
- eventos
- publicidad fisica
- publicidad digital

Implementar cualquier funcionalidad faltante.

### Fase 4

Auditar:
- catalogo
- agenda
- convenios
- contratos
- cotizaciones
- expedientes
- firmas
- facturacion
- pagos
- plantillas
- reportes
- notificaciones
- auditoria

Completar todo lo faltante.

### Fase 5

Eliminar completamente:
- `role ===`
- `user.role ===`
- `isAdmin()`
- `superadmin` hardcoded

Migrar todo a permisos granulares.

### Fase 6

Ejecutar pruebas de aislamiento:
- Plaza Mayor
- Casa de Piedra

Validar:
- Cross Tenant Read
- Cross Tenant Write
- Tenant Escape

Corregir cualquier fuga.

### Fase 7

Ejecutar simulacion empresarial completa.

Tenant PM:
- 20 clientes
- 10 espacios
- 15 cotizaciones
- 5 contratos
- 5 convenios
- 5 facturas
- 5 pagos

Tenant CP:
- 20 clientes
- 10 espacios
- 15 cotizaciones
- 5 contratos
- 5 convenios
- 5 facturas
- 5 pagos

Flujo Comercial:
Cliente -> Expediente -> Catalogo -> Reserva -> Cotizacion -> Contrato -> Firma -> Factura -> Pago -> Recibo -> Expediente

Flujo Convenio:
Cliente -> Convenio -> Carta Convenio -> Firma -> Entrega -> Cierre

Todo fallo debe corregirse automaticamente.

### Fase 8

Auditoria Frontend Readiness.

Verificar:
- Swagger
- DTOs
- enums
- estados
- permisos
- paginacion
- errores documentados

Corregir inconsistencias.

### Fase 9

NO comenzar nuevas vistas frontend hasta alcanzar:
- `BACKEND_INTEGRITY = PASS`
- `API_CONTRACTS = PASS`
- `RBAC = PASS`
- `TENANT_ISOLATION = PASS`
- `SNAPSHOTS = PASS`
- `DOCUMENT_LIFECYCLE = PASS`
- `CATALOG = PASS`
- `AGENDA = PASS`
- `AGREEMENTS = PASS`
- `DOSSIER = PASS`
- `TEMPLATES = PASS`
- `SIGNATURES = PASS`
- `FINANCE = PASS`

## Criterio Final

No detener la ejecucion hasta alcanzar:
- 0 errores de compilacion
- 0 endpoints rotos
- 0 permisos faltantes
- 0 DTOs inconsistentes
- 0 TODO
- 0 mocks
- 0 stubs
- 0 modulos parciales

No emitir:
- `BACKEND_COMPLETE = YES`

Hasta demostrar mediante:
- codigo
- logs
- pruebas
- evidencia reproducible

Que el backend esta completamente operativo, consistente, seguro y listo para frontend y produccion.
