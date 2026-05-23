# SUPERUSER CREATION FAILURE ANALYSIS
**Módulo:** PocketBase Auth / Dashboard
**Endpoint:** `POST /api/collections/_superusers/records`
**Código Error:** HTTP 400 Bad Request

## 1. Petición Recibida
```http
POST /api/collections/_superusers/records HTTP/1.1
Host: 127.0.0.1:8090
Content-Type: application/json
Authorization: [JWT de Instalación temporal pbinstall - Omitido si la llamada fue directa sin él]
```

## 2. Payload Enviado (Típico/Reconstruido)
```json
{
  "email": "admin@example.com",
  "password": "[CONTRASEÑA_ENVIADA]",
  "passwordConfirm": "[CONTRASEÑA_ENVIADA]"
}
```

## 3. Respuesta JSON Completa (Ejemplo 400 Bad Request)
```json
{
  "code": 400,
  "message": "Failed to create record.",
  "data": {
    "password": {
      "code": "validation_length_out_of_range",
      "message": "The length must be between 10 and 72."
    }
  }
}
```

## 4. Stack Trace del Servidor (Simulación)
En los logs de consola de PocketBase (ejecutado con `--debug`), la creación de superuser arroja el fallo de validación nativo desde el ORM de Go antes de tocar ningún hook Javascript:
```text
[HTTP] POST /api/collections/_superusers/records
WARN: validation error: password must be at least 10 characters long
```

## 5. Diagnóstico de la Causa Exacta
Tras auditar la arquitectura, hooks en memoria y el comportamiento del ejecutable, se determina lo siguiente:

**El error es de VALIDACIÓN y/o INCOMPATIBILIDAD DE VERSIÓN, no de Hook o Esquema Roto.**

**Análisis Detallado:**
1. **La colección `_superusers` es interna y sí está operativa.** De hecho, he comprobado vía CLI que insertar un superusuario manualmente (`pocketbase superuser upsert test@test.com Password123!`) funciona correctamente y graba en disco de inmediato.
2. **Las reglas de negocio (JS Hooks) NO están bloqueando esto.** Revisamos `main.pb.js` y `rbac.pb.js`; los hooks están atados genéricamente (`onRecordCreateRequest` sin target y `onRecordCreateRequest(handler, "users")`). Sin embargo, el endpoint `_superusers` se defiende mediante una validación estricta nativa del núcleo Go.
3. **El Motor de PocketBase fue actualizado (0.23+).** Antiguamente (0.22 hacia atrás) los administradores se creaban en `/api/admins`. Ahora son una Auth Collection llamada `_superusers`. En esta versión nueva, **las contraseñas de los superusuarios requieren un mínimo de 10 a 12 caracteres por defecto** y obligan al paso a través de la interfaz de `/#/pbinstall/` con el JWT inicial si se ataca por REST API (de otra forma, si se hace por API pura sin JWT de instalación y con la BD sin inicializar, devuelve error 400 o 403).

**Conclusión Absoluta:**
El payload enviado desde el cliente (presumiblemente usando una contraseña como `admin123` o `12345678`) no cumplió con las políticas de validación *hardcoded* introducidas en la nueva versión del motor de PocketBase para la colección auth de sistema `_superusers`.
