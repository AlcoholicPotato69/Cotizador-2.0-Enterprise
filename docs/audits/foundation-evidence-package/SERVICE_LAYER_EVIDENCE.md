# SERVICE_LAYER_EVIDENCE.md

### clientService (`frontend/src/services/clientService.ts`)
- **Validación:** Integra PB SDK. Exporta `saveClient()`.
### documentService (`frontend/src/services/documentService.ts`)
- **Validación:** Construye `FormData`, inyecta HMAC nativo y llama `pb.collection('documents').create()`.
