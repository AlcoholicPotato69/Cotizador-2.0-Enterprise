# LONG TERM RISK & SCALABILITY ANALYSIS

## Riesgos a 1 Año (Corto Plazo)
- **Riesgo:** Cuello de botella en el `Approval Engine` si los flujos paralelos no se manejan con bloqueos transaccionales (Transaction Locks).
- **Mitigación:** Usar transacciones de SQLite y *Optimistic Locking* en la máquina de estados.

## Riesgos a 3 Años (Mediano Plazo)
- **Riesgo:** La tabla `audit_logs` crecerá exponencialmente debido a la regla de "Audit Everything", alentando los respaldos.
- **Mitigación:** Estrategia de particionamiento o archivado anual de auditorías hacia bases de datos de solo lectura, manteniendo el *hash_encadenado* íntegro.

## Riesgos a 5 Años (Largo Plazo)
- **Riesgo:** El límite físico de SQLite para manejar millones de `document_evidence` (PDFs y XMLs en base64 o binarios pesados).
- **Mitigación:** Obligatorio desde el día 1 almacenar los archivos en el *File System* o S3 (usando PocketBase Storage) y solo guardar la ruta/hash en SQLite.

## Escalabilidad Numérica
- **10 a 10,000 Clientes:** SQLite manejará las lecturas en microsegundos usando índices en `tenant_id` y `status`.
- **100,000 Contratos y 1,000,000 Auditorías:** Se requiere estricta indexación compuesta (ej. `[tenant_id, contract_id]`) y evitar queries N+1 en las resoluciones de GraphQL/REST. PocketBase escala eficientemente con WAL mode habilitado.
