# SESSION SECURITY ARCHITECTURE (J.4)

## 1. Hardening de Sesiones (Mitigación ZT-03)
Para evitar el *Session Hijacking* se ha diseñado el siguiente ecosistema:
- **Token Rotation**: El JWT emitido por PocketBase se rota automáticamente cada 30 minutos.
- **Absolute Revocation**: Si se detectan 2 IPs distintas operando el mismo token, se revoca instantáneamente el acceso a toda la cuenta.
- **Global Logout**: El usuario o Administrador de Tenant puede matar todas las sesiones activas.
- **Invalidación Cíclica**: Cualquier cambio en contraseñas o en los Permisos Efectivos (`RBAC`) invalida inmediatamente los tokens existentes.