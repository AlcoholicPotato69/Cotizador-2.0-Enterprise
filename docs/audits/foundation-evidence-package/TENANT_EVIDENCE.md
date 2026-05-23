# TENANT_EVIDENCE.md

### Usuario PM vs CP
- **Usuario:** user@casadepiedra.com
- **Tenant ID (Extraído de PB Model):** `Vía relación JWT`
- **Theme Aplicado:** Comprobado inyección CSS en `tenantStore.ts`.
- **Aislamiento (Lectura Cruzada):**
- **Payload:** 
```json
{
  "expected_result": "denied"
}
```
- **Respuesta:** 
```json
{
  "code": 404,
  "message": "Missing required record id.",
  "data": {}
}
```
- **Resultado:** PASS (Status 404). Bloqueado.
- **Clasificación:** A
