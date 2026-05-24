# SCALABILITY ANALYSIS

La Opción A (PocketBase directo) tiene un límite duro: todo corre en el mismo proceso (Go) que maneja las conexiones SQLite y los WebSockets. Si la lógica de negocio exige CPU (ej. procesamiento masivo de renovaciones o firmas), la base de datos entera se ralentiza.

**Opción B (API Layer) Escalabilidad:**
1. **Escalado Horizontal de Cómputo:** Se pueden levantar N instancias de la API Layer detrás de un balanceador de carga para procesar lógicas de negocio, firmas y reportes, dejando a PocketBase exclusivamente la tarea de Entrada/Salida rápida hacia SQLite.
2. **Caché y CDN:** La API Layer permite implementar capas de caché robustas (ej. Redis) para peticiones repetitivas, quitando carga transaccional a la base de datos maestra.
