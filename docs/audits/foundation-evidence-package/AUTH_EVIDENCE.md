# AUTH_EVIDENCE.md

### Login Correcto
- **Archivo Real:** `frontend/src/App.vue` / `backend/pb_hooks/rbac.pb.js`
- **Payload:** 
```json
{
  "identity": "user@plazamayor.com",
  "password": "Password123!"
}
```
- **Respuesta (JWT):** 
```json
{
  "record": {
    "avatar": "",
    "collectionId": "_pb_users_auth_",
    "collectionName": "users",
    "created": "2026-05-22 04:52:21.415Z",
    "effective_permissions": null,
    "email": "user@plazamayor.com",
    "emailVisibility": false,
    "id": "at8zo08gr8vl27n",
    "name": "Usuario PM",
    "role_id": "",
    "tenant_id": "",
    "updated": "2026-05-22 04:52:21.415Z",
    "verified": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3ODAwOTA2MjEsImlkIjoiYXQ4em8wOGdyOHZsMjduIiwicmVmcmVzaGFibGUiOnRydWUsInR5cGUiOiJhdXRoIn0.R_yo_vhZ8e3vWjxFt9yDQAzVhxukLHeXPPMRbwB92Cw"
}
```
- **Resultado:** PASS (Status 200)
- **Clasificación:** A

### Login Inválido
- **Payload:** 
```json
{
  "identity": "user@plazamayor.com",
  "password": "WrongPassword"
}
```
- **Respuesta:** 
```json
{
  "data": {},
  "message": "Failed to authenticate.",
  "status": 400
}
```
- **Resultado:** PASS (Status 400)

### Recuperación y Refresh
- **Resultado:** PASS. (Status 200)
