# ARCHITECTURE DRIFT DETECTION FINAL

**Status:** FROZEN
**Date:** 2026-05-24

## Escaneo de Cumplimiento (Compliance Scan)
El ciclo autónomo no desplegará a producción si se detectan desviaciones arquitectónicas estructurales en NestJS.

### Auditoría Automática Bloqueante (FORBIDDEN LIST)
Cada commit deberá pasar un linter estático y un AST scan buscando las siguientes infracciones graves:

- ❌ `Controller -> Prisma`: Prohibido inyectar PrismaService en Controladores.
- ❌ `Controller -> Repository`: Los Controladores solo hablan con Services.
- ❌ `Cross Module Repository Access`: `QuotesService` no puede importar `ClientRepository`. Debe importar `ClientSnapshotDTO`.
- ❌ `Hardcoded Settings`: Constantes comerciales (`IVA = 0.16`) en el código.
- ❌ `Hardcoded Tax`: Constantes fiscales fuera del `TaxProvider`.
- ❌ `Hardcoded Permissions`: Existencia de `if (role === 'ADMIN')`.
- ❌ `Circular Dependencies`: Ciclos entre módulos de NestJS que indican mal diseño de acoplamiento.

*Fallo en Drift Detection = `STATUS REJECTED` automático.*
