# HOOKS_EVIDENCE.md

### Archivo: main.pb.js
- **Ruta:** `backend/pb_hooks/main.pb.js`
- **Eventos:**
  - onRecordCreateRequest
  - onRecordUpdateRequest
  - onRecordDeleteRequest
  - onRecordViewRequest
- **Prueba Ejecutada:** Edición en vivo y Break Tests E2E de RBAC.
- **Resultado:** Interceptación verificada. Logs transaccionales en consola.

### Archivo: rbac.pb.js
- **Ruta:** `backend/pb_hooks/rbac.pb.js`
- **Eventos:**
  - onRecordCreateRequest (users)
  - onRecordUpdateRequest (users)
  - onRecordUpdate (roles)
  - onRecordUpdate (roles - audit)
- **Prueba Ejecutada:** Edición en vivo y Break Tests E2E de RBAC.
- **Resultado:** Interceptación verificada. Logs transaccionales en consola.

