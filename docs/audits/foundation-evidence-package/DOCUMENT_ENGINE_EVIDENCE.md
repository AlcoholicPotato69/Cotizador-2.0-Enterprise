# DOCUMENT_ENGINE_EVIDENCE.md

### Flujo Upload y Web Crypto
- **Upload Payload:** 
```json
{
  "tenant_id": "",
  "provider": "pdf",
  "file": "evidence.pdf (Binary)"
}
```
- **Hash Engine:** Implementado SHA-256 en `documentService.ts` (Mock eliminado).
- **Resultado:** Validación robusta activada (Status 400). 
- **Clasificación:** A
