# RBAC_EVIDENCE.md

### Denegación Protegida
- **Permiso Solicitado:** API `audit_logs` sin rol superusuario.
- **Payload:** 
```json
{
  "target": "audit_logs"
}
```
- **Respuesta:** 
```json
{
  "data": {},
  "message": "Only superusers can perform this action.",
  "status": 403
}
```
- **Resultado:** PASS (Status 403). HTTP 403 Forbidden.
- **Clasificación:** A
