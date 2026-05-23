# HOOK COMPATIBILITY ANALYSIS (v0.22 vs v0.23+)
**Fecha:** 2026-05-21

Este documento traza las incompatibilidades de la API Javascript de PocketBase que estaban ocasionando el error HTTP 400 (Panic de JSVM) y describe los parches exactos que se aplicarán para estabilizar el sistema.

## 1. `main.pb.js` - Tenant Isolation & RBAC Enforcement

| Línea / Contexto | API Antigua (v0.22-) | API Nueva (v0.23+) | Motivo de la Incompatibilidad |
| :--- | :--- | :--- | :--- |
| **Recuperar Auth Record** | `var authRecord = e.httpContext.get("authRecord");` | `var authRecord = e.auth;` | En v0.23+, `e` en los hooks de peticiones es de tipo `core.RecordRequestEvent`. La propiedad `httpContext` fue deprecada/removida para recuperar el usuario. Ahora el usuario o superusuario autenticado se expone de forma directa y segura en `e.auth`. |
| **Continuación del Request** | `onRecordCreateRequest((e) => { enforceRbac(e, "create"); });` | `onRecordCreateRequest((e) => { enforceRbac(e, "create"); return e.next(); });` | Si un hook de tipo Request no llama y retorna explícitamente `e.next()`, el middleware se detiene abruptamente. Esto causaba que la inserción de registros se abortara lanzando 400 Bad Request. |

## 2. `rbac.pb.js` - FLS & Audit Logging

| Línea / Contexto | API Antigua (v0.22-) | API Nueva (v0.23+) | Motivo de la Incompatibilidad |
| :--- | :--- | :--- | :--- |
| **Identificación en Audit Log** | `const adminId = e.httpContext?.get("admin")?.id;` <br/> `const authRecord = e.httpContext?.get("authRecord");` | `const authRecord = e.auth;` <br/> `const actorId = authRecord ? authRecord.id : null;` | Las colecciones `_admins` y `users` se unificaron en comportamiento como Auth Collections en v0.23+. Ya no existe el concepto `admin` aislado en el `httpContext`. Todo se maneja a través de `e.auth` (si la colección de `e.auth` es `_superusers`, es un superadmin). |
| **Mutación de Registros (Request)** | `onRecordCreateRequest(handleUserSave, "users");` | `onRecordCreateRequest((e) => { handleUserSave(e); return e.next(); }, "users");` | Igual que en `main.pb.js`, el hook no retornaba `e.next()`, bloqueando en seco la creación de usuarios o su actualización, arrojando el error `400 Bad Request`. |

## Impacto de la Corrección
La refactorización se limita exclusivamente a reemplazar los *getters* de la API y asegurar la cadencia del middleware (`e.next()`). **No se altera** la lógica matemática del cálculo de permisos, ni la denegación estricta (Backend Enforcement).
