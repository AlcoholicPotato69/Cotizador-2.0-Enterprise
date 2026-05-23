# PAYMENT EVIDENCE WORKFLOW (Fase 2.6)

## 1. Naturaleza de la Evidencia
El cobro no es automático. Requiere la acción humana de subir un comprobante físico (PDF, JPG, PNG del SPEI).

## 2. Carga y Trazabilidad
Los comprobantes se almacenan en la colección `payment_evidences` (vinculados al `contract_id` y `client_id`).
Al inyectarse en Base de Datos y S3, el sistema genera metadatos obligatorios:
- `uploaded_by` (ID del usuario operativo o cliente)
- `uploaded_at` (Timestamp inmutable)
- `document_hash` (SHA-256 para prevenir manipulación del JPG/PDF posterior a la carga).