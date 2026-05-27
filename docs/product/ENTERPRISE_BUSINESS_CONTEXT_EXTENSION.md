# ENTERPRISE BUSINESS CONTEXT EXTENSION

## Proposito
Evitar un frontend tecnicamente correcto pero funcionalmente incorrecto.

## 1. Validacion contra Cotizador 1.0
Generar: `COTIZADOR_1_0_PARITY_AUDIT.md`

Antes de implementar cualquier dominio:
- Config
- Clientes
- Catalogo
- Agenda
- Cotizaciones
- Convenios
- Contratos
- Pagos
- Plantillas

Comparar contra:
- `H:\cotizadorpm-pocketbase`

Documentar:
- Migrado
- Mejorado
- Pendiente
- No aplica

## 2. Auditoria del Catalogo
Generar: `CATALOG_BUSINESS_AUDIT.md`

Validar:

Plaza Mayor
- Publicidad fisica
- Publicidad digital
- Mupis
- Pantallas
- Totems
- Vallas

Casa de Piedra
- Salones
- Espacios
- Publicidad fisica
- Publicidad digital

Cada espacio debe tener:
- Clave unica
- Plano PDF
- Reglamento
- Disponibilidad
- Historial

## 3. Auditoria de Agenda
Generar: `AGENDA_ENGINE_AUDIT.md`

Validar:
- Reservas
- Bloqueos
- Reprogramaciones
- Cancelaciones
- Expiraciones

Especialmente:
- ZERO OVERBOOKING

## 4. Auditoria de Convenios
Generar: `AGREEMENT_ENGINE_AUDIT.md`

Validar:
- Patrocinios
- Intercambios
- Cortesias
- Pagos en especie

Confirmar que:
- `Convenio != Contrato`

## 5. Auditoria del Expediente
Generar: `DOSSIER_ENGINE_AUDIT.md`

Validar:

Expediente Cliente
- INE
- RFC
- Constancia
- Poderes
- Documentos juridicos

Expediente Comercial
- Cotizacion
- Contrato
- Convenio
- Factura
- Recibo

## 6. Auditoria de Plantillas
Generar: `TEMPLATE_ENGINE_AUDIT.md`

Validar:
- Contratos
- Convenios
- Facturas
- Recibos
- Cotizaciones
- Reglamentos

Confirmar:
- Versionado
- Historial
- Activacion
- Desactivacion
- Preview

## 7. Auditoria de Firmas
Generar: `SIGNATURE_ENGINE_AUDIT.md`

Validar:

Modo Externo
- DocuSign

Modo Interno
- Firma manual
- Hash
- Evidencia

Confirmar:
- Fallback automatico

## 8. Auditoria Financiera
Generar: `FINANCE_ENGINE_AUDIT.md`

Validar:
- Facturas
- Pagos
- Recibos
- Saldos
- Anticipos
- Sobrepagos

Confirmar:
- Intelisis
- Modo interno

## 9. Auditoria de UX
Generar: `UX_USABILITY_AUDIT.md`

Validar:

Mercadotecnia
- Alta cliente
- Cotizacion
- Reserva

Juridico
- Documentos
- Contratos
- Firmas

Finanzas
- Facturas
- Pagos
- Recibos

## 10. Certificacion Final
No permitir:
- `FRONTEND_COMPLETE = YES`

Hasta que existan:
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
- `UX = PASS`
