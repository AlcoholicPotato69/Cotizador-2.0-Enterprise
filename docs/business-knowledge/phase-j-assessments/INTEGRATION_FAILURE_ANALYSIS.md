# INTEGRATION FAILURE ANALYSIS (J.5)

## Escenarios de Falla Simulados

1. **Intelisis / Facturama Caídos (Timeout / 500)**
- *Comportamiento*: El sistema detecta el timeout en 8 segundos.
- *Recuperación/Fallback*: La factura pasa a estado `pending_retry` y se delega el timbrado asíncrono a una cola (Cron Job de PocketBase) cada 15 mins. El usuario puede seguir operando.

2. **Storage Fuera de Línea (AWS S3)**
- *Comportamiento*: Falla al subir el PDF/XML.
- *Recuperación/Fallback*: PocketBase almacena el archivo temporalmente en el `local_filesystem` (EBS) y un flag activa la sincronización diferida hacia S3 cuando este vuelva.

3. **XML Manual Inválido / Modificado**
- *Comportamiento*: Un cliente sube un XML manualmente que no cuadra con el `financial_snapshot`.
- *Recuperación*: El *ManualProvider* rechaza instantáneamente la subida (Zero Trust), protegiendo la integridad fiscal del Contrato sin romper la UX (mensaje descriptivo en UI).