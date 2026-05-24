# Arquitectura de Dominios Expandidos (Scope Expansion)
**Proyecto:** Cotizador 2.0 Enterprise
**Rol:** Enterprise Architect
**Enfoque:** PocketBase (Colecciones, Hooks), Zero Trust, Audit Everything.

Este documento detalla la arquitectura técnica para los nuevos dominios solicitados: Sistema de Pagos, Agenda (Scheduling) y Facturas/Renovaciones.

---

## 1. Sistema de Pagos (Payment Tracking)

### Modelo de Datos (Colecciones PocketBase)
- **Colección:** `payments`
  - `id` (RecordId)
  - `contract_id` (Relation -> contracts)
  - `tenant_id` (Relation -> tenants) [Para Multi-Tenant]
  - `amount` (Number)
  - `currency` (Text)
  - `receipt_image` (File) - *Comprobante de pago subido por el usuario*
  - `status` (Select: `PENDING_VERIFICATION`, `OCR_PROCESSING`, `APPROVED`, `REJECTED`)
  - `ocr_data` (JSON) - *Resultados crudos del análisis externo*
  - `verified_by` (Relation -> users, nullable) - *Usuario interno que aprobó manualmente*

### Servicios Externos
- **Servicio OCR (Ej. AWS Textract / Google Cloud Vision):**
  - **Justificación:** Estrictamente necesario para automatizar la extracción de datos del recibo (monto, fecha, cuenta origen/destino) y evitar cuellos de botella humanos.
  - **Flujo:** PocketBase enviará la imagen firmada (URL temporal) al servicio OCR mediante un hook asíncrono o un worker externo. Alternativamente, se puede optar por un **Flujo de Aprobación Interna** exclusivo donde un operador valide manualmente el comprobante.

### Lógica de Negocio (PocketBase Hooks)
1. **Upload & Queue (`OnRecordAfterCreateRequest` en `payments`):**
   - Al subir un recibo, el estado inicial es `PENDING_VERIFICATION`.
   - Se dispara un evento asíncrono para enviar `receipt_image` al Servicio OCR, cambiando el estado a `OCR_PROCESSING`.
2. **Reconciliación y Aprobación:**
   - Una vez el OCR retorna los datos, un hook evalúa: `monto_ocr == monto_esperado` y `cuenta_destino == cuenta_empresa`.
   - Si la coincidencia es alta (>95% confidence), cambia el estado a `APPROVED` (o lo deja en bandeja para aprobación a un clic, según la política de riesgo de la empresa).
   - Si hay discrepancias o no se usa OCR, se notifica al equipo de finanzas para *Flujo de Aprobación Interna* (cambio manual de estado a `APPROVED` o `REJECTED`).
3. **Actualización de Contrato (`OnRecordAfterUpdateRequest` en `payments`):**
   - Si `status` cambia a `APPROVED`, un hook transaccional deduce el `amount` del saldo pendiente en la colección `contracts` y registra el evento de pago exitoso.

---

## 2. Agenda (Scheduling y Prevención de Overbooking)

### Modelo de Datos (Colecciones PocketBase)
- **Colección:** `space_blocks`
  - `id` (RecordId)
  - `space_id` (Relation -> spaces) - *El lugar/espacio físico*
  - `quote_id` (Relation -> quotes, nullable)
  - `contract_id` (Relation -> contracts, nullable)
  - `start_datetime` (DateTime)
  - `end_datetime` (DateTime)
  - `status` (Select: `TENTATIVE` (Asociado a cotización), `CONFIRMED` (Asociado a contrato), `CANCELLED`)

### Lógica de Negocio (PocketBase Hooks)
1. **Prevención de Overbooking (`OnRecordBeforeCreateRequest` / `OnRecordBeforeUpdateRequest` en `space_blocks`):**
   - **Regla Estricta:** Antes de insertar o actualizar, el hook ejecuta una consulta en SQLite comprobando si existen registros superpuestos para el mismo `space_id` donde el rango `[start_datetime, end_datetime]` colisione y el estado sea `TENTATIVE` o `CONFIRMED`.
   - Si hay colisión, el hook **aborta la transacción** devolviendo un error HTTP 400 (Overbooking detectado).
2. **Ciclo de Vida del Bloqueo:**
   - **Cotización creada:** Genera un `space_block` en estado `TENTATIVE`. (Se le puede asignar un TTL/Caducidad programada que lo cambie a `CANCELLED` si la cotización expira).
   - **Contrato firmado (`OnRecordAfterUpdateRequest` en `contracts`):** Un hook busca los bloques `TENTATIVE` vinculados al `quote_id` original y los promueve a estado `CONFIRMED`.

---

## 3. Facturación y Renovaciones (Invoices & Renewals)

### Modelo de Datos (Colecciones PocketBase)
- **Colección:** `invoices`
  - `id` (RecordId)
  - `contract_id` (Relation -> contracts)
  - `payment_id` (Relation -> payments, nullable) - *Si aplica a un pago específico*
  - `amount` (Number)
  - `issue_date` (DateTime)
  - `due_date` (DateTime)
  - `tax_details` (JSON) - *Desglose de impuestos, datos del timbrado*
  - `status` (Select: `DRAFT`, `ISSUED`, `PAID`, `CANCELLED`)
- **Colección:** `contract_renewals` (Auditoría del ciclo de vida)
  - `id` (RecordId)
  - `original_contract_id` (Relation -> contracts)
  - `new_contract_id` (Relation -> contracts, nullable)
  - `renewal_trigger_date` (DateTime)
  - `status` (Select: `PENDING_REVIEW`, `PROPOSED`, `ACCEPTED`, `REJECTED`)

### Lógica de Negocio (PocketBase Hooks)
1. **Emisión de Facturas:**
   - **Hook de Disparo:** Cuando un contrato se firma o un pago pasa a `APPROVED`, se dispara la creación de un registro en `invoices` en estado `DRAFT`.
   - **Integración Externa (Facturación Electrónica):** De ser necesario por normativas fiscales, un servicio asíncrono toma las facturas `DRAFT`, solicita el timbrado al proveedor (PAC), actualiza el `tax_details` y adjunta el PDF/XML, pasando el estado a `ISSUED`.
2. **Ciclo de Vida de Renovación:**
   - **Generación Proactiva:** Un proceso programado (Go Cron en el binario principal o worker externo) evalúa diariamente la colección `contracts`. Si la fecha de finalización está a 'X' días de expirar, se crea un registro en `contract_renewals` en estado `PENDING_REVIEW`.
   - **Flujo de Renovación:** Esto dispara notificaciones al Tenant/Agente de ventas para contactar al cliente. Permite generar una nueva cotización/contrato clonada. Al firmarse, se enlaza el `new_contract_id` al registro de renovación y se marca como `ACCEPTED`.

---

## Consideraciones Técnicas Finales

1. **Transactional Safety:** Las deducciones de pagos al contrato y las validaciones de agenda se deben realizar dentro de transacciones atómicas de la base de datos (usando el `dao.RunInTransaction` de PocketBase) para evitar condiciones de carrera (Race Conditions).
2. **Audit Trail Constante:** Fiel al principio de "Audit Everything", todas las transiciones de estado en Pagos, Bloqueos de Espacio y Facturas deben registrar el snapshot previo y actual en la colección inmutable de `audit_logs`.
