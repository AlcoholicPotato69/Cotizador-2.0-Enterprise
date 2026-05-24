# TECHNICAL DEBT REGISTER

## Identificadores de Deuda

1. **RBAC Disabled**
   - Ubicación: `backend/pb_hooks/rbac.pb.js.disabled`
   - Severidad: Alta
   - Descripción: El hook de Role-Based Access Control está desactivado, violando el principio "Zero Trust" si se despliega así.
   - Solución: Reparar lógica y reactivar hook.

2. **Frontend Mocking (SSE Notifications)**
   - Ubicación: `frontend/src/components/dev/DevToolbar.vue`
   - Severidad: Media (Depende del ambiente)
   - Descripción: Uso de eventos simulados de SSE (Server-Sent Events) como "Mock notification emitted: quote.approved".
   - Solución: Integrar SSE real con PocketBase (Realtime API).

3. **Falta de Pruebas Automatizadas (E2E / Integration)**
   - Ubicación: Todo el repositorio
   - Severidad: Crítica para Enterprise Ready
   - Descripción: Ausencia de un directorio `tests/` o infraestructura automatizada verificable en frontend (Playwright/Cypress) o backend (Go tests).

4. **Retention / Expiration Engine Ausentes**
   - Ubicación: Runtime Backend
   - Severidad: Alta
   - Descripción: Aunque se definen como parte de los dominios en validación, no se encontró evidencia concreta de motores de limpieza/expiración (cron jobs en pb_hooks).
