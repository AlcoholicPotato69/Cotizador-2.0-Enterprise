# MEGA-MANDATO BACKEND V11.0

## FORENSIC AUDIT, AUTOCORRECTION & COMPLETENESS PROGRAM

## Estado Actual
- La arquitectura del backend se considera congelada (`ARCHITECTURE_FROZEN`).
- El objetivo NO es redisenar.
- El objetivo es:
  - AUDITAR
  - CORREGIR
  - COMPLETAR
  - CERTIFICAR

Hasta alcanzar:
- `BACKEND_COMPLETE = YES`
- `BACKEND_CERTIFIED = YES`
- `READY_FOR_FRONTEND = YES`
- `READY_FOR_PRODUCTION = YES`

## Regla de Oro

PROHIBIDO:
- Emitir certificaciones teoricas.
- Emitir PASS sin evidencia.
- Marcar modulos como completos sin pruebas.
- Ocultar errores.
- Ignorar fallos de compilacion.
- Ignorar errores de negocio.

## Enjambre Autorizado

Arquitectura:
- Enterprise Architect
- Solution Architect
- Database Architect
- Backend Lead

Seguridad:
- Security Architect
- Red Team Auditor
- RBAC Auditor
- Tenant Isolation Auditor

Calidad:
- QA Authority
- Forensic Auditor
- Performance Engineer

Negocio:
- Business Process Auditor
- Catalog Business Auditor
- Agreement Auditor
- Finance Auditor
- Document Lifecycle Auditor
- Template Governance Auditor

Integracion:
- API Contract Auditor
- Frontend Compatibility Auditor
- Integration Auditor

Liberacion:
- Release Authority

## Fase 1 - Inventario Total del Backend

Generar:
- `BACKEND_INVENTORY_REPORT.md`

Inventariar:
- Dominios
- Modulos
- Servicios
- Controladores
- DTOs
- Repositorios
- Eventos
- Jobs
- Schedulers
- Plantillas
- Reportes
- Storage
- Permisos
- Integraciones

Clasificar:
- IMPLEMENTADO
- PARCIAL
- ROTO
- HUERFANO
- NO UTILIZADO

## Fase 2 - Deteccion de Modulos Faltantes

Comparar backend real contra requisitos de negocio.

Validar existencia y funcionalidad de:
- Auth
- Tenants
- RBAC
- Clientes
- Expedientes
- Catalogo
- Agenda
- Cotizaciones
- Convenios
- Contratos
- Firmas
- Facturas
- Pagos
- Recibos
- Plantillas
- Reportes
- Notificaciones
- Snapshots
- Auditoria
- Storage
- Document Viewer
- Integraciones

Si algo no existe:
- IMPLEMENTAR

Si existe parcialmente:
- COMPLETAR

## Fase 3 - Auditoria de Negocio

Comparar contra:
- Cotizador 1.0
- `H:\cotizadorpm-pocketbase`

Validar:

Plaza Mayor:
- Publicidad fisica
- Publicidad digital
- Mupis
- Pantallas
- Totems
- Vallas

Casa de Piedra:
- Salones
- Espacios
- Eventos
- Publicidad fisica
- Publicidad digital

## Fase 4 - Auditoria de Catalogo

Verificar:
- Clave unica
- Plano PDF
- Reglamento
- Disponibilidad
- Historial

## Fase 5 - Auditoria de Agenda

Validar:
- Reservas
- Bloqueos
- Reprogramaciones
- Cancelaciones
- Expiraciones

Certificar:
- `ZERO OVERBOOKING`

## Fase 6 - Auditoria de Convenios

Validar:
- Patrocinio
- Intercambio
- Cortesia
- Pago en especie

Confirmar:
- `Convenio != Contrato`

## Fase 7 - Auditoria Documental

Validar:

Expediente Cliente:
- INE
- RFC
- Constancias
- Poderes
- Documentacion juridica

Expediente Comercial:
- Cotizacion
- Contrato
- Convenio
- Factura
- Recibo

## Fase 8 - Auditoria de Plantillas

Validar:
- Contratos
- Convenios
- Facturas
- Recibos
- Cotizaciones
- Reglamentos

Verificar:
- Versionado
- Historial
- Preview
- Activacion
- Desactivacion

## Fase 9 - Auditoria de Firmas

Validar:

Externo:
- DocuSign

Interno:
- Firma manual
- Hash
- Evidencia

Verificar:
- Fallback automatico

## Fase 10 - Auditoria Financiera

Validar:
- Facturas
- Pagos
- Recibos
- Anticipos
- Sobrepagos
- Saldos

Verificar:
- Intelisis
- Modo interno

## Fase 11 - Auditoria RBAC

Buscar:
- `role ===`
- `user.role ===`
- `isAdmin()`
- `superadmin`

Corregir:
- `100% permisos granulares`

## Fase 12 - Auditoria Multi-Tenant

Intentar:
- Cross Tenant Read
- Cross Tenant Write
- Tenant Escape

Certificar:
- Plaza Mayor aislado
- Casa de Piedra aislado

## Fase 13 - Auditoria de API

Validar:
- Swagger
- DTOs
- Errores
- Permisos
- Paginacion
- Tenant Context

Corregir automaticamente inconsistencias.

## Fase 14 - Auditoria de Frontend Readiness

Generar:
- `FRONTEND_CONSUMPTION_AUDIT.md`

Verificar:
- Todos los endpoints consumibles
- Todos los DTOs documentados
- Todos los enums documentados
- Todos los estados documentados

## Fase 15 - Simulacion Empresarial Completa

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

Flujo comercial:
Cliente
↓
Expediente
↓
Catalogo
↓
Reserva
↓
Cotizacion
↓
Contrato
↓
Firma
↓
Factura
↓
Pago
↓
Recibo
↓
Expediente

Flujo convenio:
Cliente
↓
Convenio
↓
Carta Convenio
↓
Firma
↓
Entrega
↓
Cierre

## Protocolo de Autocorreccion

Ante cualquier fallo:
1. Auditar
2. Identificar causa raiz
3. Corregir
4. Recompilar
5. Reejecutar pruebas
6. Volver a auditar
7. Certificar

No detener el proceso hasta que:
- 0 errores de compilacion
- 0 endpoints rotos
- 0 permisos faltantes
- 0 DTOs inconsistentes
- 0 modulos parciales
- 0 TODO
- 0 mocks
- 0 stubs

## Criterio Final

NO emitir:
- `BACKEND_COMPLETE = YES`

Hasta demostrar mediante:
- Codigo
- Logs
- Pruebas
- Evidencia reproducible

Que:
- Todos los modulos existen
- Todos los modulos funcionan
- Todos los flujos funcionan
- Todos los permisos funcionan
- Todas las integraciones funcionan
- Todos los documentos se generan
- Todos los expedientes funcionan
- Todo el backend esta listo para produccion

## Orden de Ejecucion
- `ARCHITECTURE = FROZEN`
- `AUDITS = EXECUTE`
- `FIX_DEFECTS`
- `CERTIFY`
- `START_IMPLEMENTATION`

## Execution Binding
La ejecucion operativa diaria de este mandato queda definida en:
- `docs/product/MEGA_MANDATO_EXECUTION_MODE_V1_0.md`
