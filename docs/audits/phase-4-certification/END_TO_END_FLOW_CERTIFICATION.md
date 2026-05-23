# END_TO_END_FLOW_CERTIFICATION.md

## E2E AUDITOR (AGENT 11)

### FLUJO AUTH & SESSION
`Login → JWT → Tenant → Permisos → Dashboard → F5 → Recuperar`
**Estado: PASS (A)**. El JWT decodificado en `App.vue` mapea al usuario; el Token determina el Tenant y carga la matriz RBAC. Si se recarga, persiste vía `localStorage` (PocketBase authStore).

### FLUJO CLIENTE
`Crear → Guardar → Consultar → Editar → Guardar`
**Estado: PASS (A)**. CRUD verificado vía REST y UI. Tenant injection funciona en `clientService.ts`. Validaciones de base de datos responden adecuadamente.

### FLUJO DOCUMENTO
`Subir → Persistir → Visualizar → Descargar`
**Estado: PASS (A)**. En frontend se usa `FormData` con un `File` nativo y Web Crypto API para el Hash. API rules blindan `documents` por `tenant_id`.

### CONCLUSIÓN
Todos los flujos fundamentales corren de punta a punta, sin Mocks.
