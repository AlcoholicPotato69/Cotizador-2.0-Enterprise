# INTEGRATION RESILIENCE MATRIX (J.5)

| Integración | Timeout | Retries | Circuit Breaker | Fallback | Degradación Aceptable |
|-------------|---------|---------|-----------------|----------|-----------------------|
| Facturama / PAC | 8s | 3 (Exp. Backoff) | Tras 5 fallos (Abre por 15m) | ManualProvider / Queue | Timbrado Asíncrono Retrasado |
| S3 Storage | 5s | 2 | Tras 3 fallos (Abre por 5m) | Local Storage (PocketBase FS) | Desempeño IO local menor |
| SendGrid (SMTP) | 5s | 3 | Tras 10 fallos | Polling interno de BD | Los usuarios deberán descargar PDFs manualmente |