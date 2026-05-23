# DOCUMENT STORAGE STRATEGY (Fase 2.1)

## 1. Ubicación Física
- **Primaria**: AWS S3 Buckets privados configurados vía S3 Hooks en PocketBase.
- **Fallback**: Local Storage de PocketBase si AWS S3 cae.

## 2. Estructura de Directorios
`s3://cotizador-docs/{tenant_id}/{contract_id}/{document_type}_{hash_prefix}.pdf`

## 3. Retención y Archivado
Los documentos activos tienen acceso *Hot*. Los documentos de eventos finalizados (> 6 meses) pasan a S3 Glacier (Cold Storage) mediante ciclo de vida de AWS.