# STORAGE TIERING STRATEGY (Fase 2.2)

## Arquitectura de Niveles

1. **Hot Storage (S3 Standard)**: Documentos de eventos futuros o recientes (< 30 días). Acceso en milisegundos para descarga rápida en el TAC.
2. **Warm Storage (S3 Infrequent Access)**: Contratos de eventos pasados pero dentro del año en curso. Ahorro de costos del 40%, recuperación en milisegundos pero con fee de recuperación.
3. **Archive Storage (S3 Glacier Deep Archive)**: Expedientes finalizados (> 1 año). Almacenamiento ultrabarato. Tiempos de recuperación de hasta 12 horas.