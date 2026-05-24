# Política de Auditoría y Hash Chaining

## Objetivos del Diseño
Garantizar la inmutabilidad, trazabilidad y el no-repudio de todas las operaciones críticas que mutan el estado de los datos (CREATE, UPDATE, DELETE, GRANT/REVOKE, LOGIN/LOGOUT).

## Estructura del Log de Auditoría
Todo evento de auditoría debe guardarse en la tabla o colección global de `audit_logs` con un schema estricto:

- `id`: UUID único del log.
- `tenant_id`: UUID del tenant.
- `actor_id`: UUID del usuario que ejecutó la acción (o identificador de sistema).
- `action`: Tipo de acción (CREATE, UPDATE, DELETE, etc).
- `entity_type`: Tabla, modelo o recurso afectado.
- `entity_id`: Identificador del recurso afectado.
- `payload_before`: JSON con el estado previo (null en creación).
- `payload_after`: JSON con el estado nuevo (null en borrado).
- `ip_address`: Dirección IP del origen.
- `timestamp`: Marca de tiempo UTC estricta.
- `previous_hash`: Hash criptográfico del registro de auditoría inmediatamente anterior de este tenant (o del sistema general).
- `current_hash`: Hash calculado de este registro.

## Hash Chaining (Inmutabilidad Criptográfica)
Para prevenir la alteración silenciosa de los registros de auditoría por atacantes internos (incluyendo DBAs o usuarios root comprometidos), se exige un mecanismo de Hash Chaining similar a un ledger blockchain básico.

**Cálculo del Hash:**
El backend debe computar el `current_hash` en el momento de la inserción:
`current_hash = HMAC_SHA256( id + timestamp + actor_id + action + entity_id + previous_hash , SECRET_AUDIT_KEY )`

**Reglas Críticas:**
1. El primer registro de auditoría (génesis) tiene un `previous_hash` estático y conocido.
2. Cada nuevo registro toma el `current_hash` del último registro insertado como su `previous_hash`.
3. Un worker independiente validará la cadena de forma asíncrona periódicamente. Si `current_hash[N] != previous_hash[N+1]`, se detonará un **Incidente Crítico de Seguridad (Tampering Detectado)**, bloqueando operaciones e informando inmediatamente al Security Architect / DevOps.
