# Estrategia JWT y Autenticación

## Arquitectura de Tokens
La seguridad de la sesión se basa en un patrón de doble token para minimizar el impacto en caso de compromiso.

1. **Access Token (JWT)**: Token sin estado, de corta duración.
   - **Tiempo de vida (TTL)**: 15 minutos.
   - **Firma**: Algoritmo asimétrico RS256 preferentemente, o HS256 con un secreto seguro y rotativo.
   
2. **Refresh Token**: Token opaco con estado, de larga duración.
   - **Tiempo de vida (TTL)**: 7 días.
   - **Almacenamiento**: Persistido en base de datos junto con información de dispositivo e IP (para revocación).

## Payload del Access Token
El JWT debe ser mínimo y NO debe contener información personal identificable (PII) sensible. Solo debe incluir los claims necesarios para la autorización rápida en APIs.

```json
{
  "sub": "user_uuid",
  "email": "user@example.com",
  "tenantId": "tenant_uuid",
  "role": "Ejecutivo_Ventas",
  "iat": 1716500000,
  "exp": 1716500900
}
```

## Almacenamiento y Transmisión
- **Aplicaciones Web**: Se recomienda almacenar el Access Token en Memoria y el Refresh Token en una cookie `HttpOnly`, `Secure` y `SameSite=Strict`.
- **Aplicaciones Móviles o APIs S2S**: Uso de la cabecera estándar `Authorization: Bearer <token>`. Almacenamiento seguro usando los keystores del SO.

## Revocación y Ciclo de Vida
- Dado que el Access Token no tiene estado, su revocación inmediata no es posible. El riesgo es mitigado por su corta duración (15 min).
- Para revocar el acceso de forma inmediata (Logout, bloqueo de cuenta, cambio de contraseña), se debe invalidar el Refresh Token en la base de datos y/o eliminar las cookies de sesión del lado del servidor.
