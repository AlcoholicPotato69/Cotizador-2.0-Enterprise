# DOCUMENT INTEGRITY STRATEGY (Fase 2.1)

## 1. Metadatos de Trazabilidad
Cada `.pdf` almacenado tendrá los siguientes campos en la tabla `documents` de PB:
- `tenant_id`
- `contract_id`
- `snapshot_id`
- `template_version`
- `branding_version`
- `generated_by` (user_id o 'SYSTEM')
- `generated_at`

## 2. Firma Criptográfica
Se genera y almacena un `document_hash` (SHA-256) del binario resultante. Si alguien modifica el archivo físico en disco, el hash de PB no empatará, alertando de manipulación (Tampering).