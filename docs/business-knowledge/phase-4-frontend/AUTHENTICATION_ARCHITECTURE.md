# AUTHENTICATION ARCHITECTURE (Fase 4.1)

## Flujo Zero-Trust con PocketBase
1. **Login**: Frontend envía credenciales. PocketBase Auth retorna Token JWT.
2. **Persistencia**: Token se guarda en `localStorage` con *httponly/secure* wrapper vía *Pinia*.
3. **Refresh**: Validación silenciosa del Token al iniciar el *AppShell*.
4. **Logout**: Limpieza del *Token* local y anulación en PB (Forced Logout).