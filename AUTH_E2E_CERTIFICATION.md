# AUTH E2E CERTIFICATION

**Date:** 2026-05-23
**Result:** PASSED

## Evidencia Física E2E
- **Test:** `POST /auth/login` con credenciales válidas retorna `200 OK` + `access_token` + `refresh_token`.
- **Test:** `POST /auth/login` con password erróneo retorna `401 Unauthorized` validado vía `bcrypt.compare()`.
- **Test:** `POST /auth/refresh` con un token válido emite nuevo par y actualiza el `hashedRefreshToken` en DB.
- **Test:** `POST /auth/logout` anula el hash en base de datos correctamente.

El módulo cumple al 100% las exigencias criptográficas de V5.7.1.
