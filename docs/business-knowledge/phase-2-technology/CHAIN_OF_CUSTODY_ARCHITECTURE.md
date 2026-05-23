# CHAIN OF CUSTODY ARCHITECTURE (Fase 2.2)

## Trazabilidad Documental

La tabla `document_audit_log` registrará una bitácora inalterable por cada interacción física con el PDF:
- `GENERATED`: Quién lo emitió y Hash SHA-256 inicial.
- `VIEWED`: Cuándo un rol accedió a su previsualización.
- `DOWNLOADED`: IP de origen, usuario y Timestamp de la descarga física del PDF.
- `ARCHIVED`: Transición automatizada a Cold Storage.
- `RESTORED`: Petición de recuperación desde Glacier con aprobación de admin.

Cualquier actividad sobre un documento se anexará a su Cadena de Custodia.