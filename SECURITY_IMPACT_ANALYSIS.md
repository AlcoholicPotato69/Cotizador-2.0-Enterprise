# SECURITY IMPACT ANALYSIS

La transición a la Opción B (API Layer) fortalece exponencialmente la seguridad del sistema.

1. **Ocultamiento de Base de Datos:** En la Opción A, el frontend conoce los nombres exactos de las colecciones y columnas de PocketBase. En la Opción B, la API expone DTOs (Data Transfer Objects) sanitizados. El cliente jamás interactúa con la estructura real de la BD.
2. **Validación Criptográfica Segura:** El cálculo de las cadenas Hash (Audit Engine) requiere llaves secretas o procesos CPU-intensive. Realizar esto en una API Layer permite escalar horizontalmente los *workers* sin colgar el hilo de base de datos de PocketBase.
3. **Control de Tasas (Rate Limiting) y WAF:** Una API Layer permite inyectar middlewares de seguridad mucho más maduros que los disponibles internamente en PocketBase.
