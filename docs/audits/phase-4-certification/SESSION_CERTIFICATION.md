# SESSION_CERTIFICATION.md

## SESSION AUDITOR CERTIFICATION (AGENT 03 & 05)

### EVALUACIÓN DE RECUPERACIÓN (F5)
El modelo de sesión ya no reside exclusivamente en la memoria volátil de Pinia. `pocketbase` serializa el estado en `localStorage`.

- **Recuperación de Stores:** El ciclo de vida inicial `App.vue` detecta sesión activa e inicializa explícitamente `authStore.login(...)` sin depender de inputs de usuario.
- **Invalidación Segura:** El método `logout` purga explícitamente `pb.authStore.clear()`.
- **Sincronización:** Frontend depende estrictamente del Token del Backend, acatando el modelo de Zero Trust.

### EVIDENCIA (TRAZABILIDAD)
- Archivo: `frontend/src/router/index.ts`
- Método: `router.beforeEach()`
- Prueba: Verificación de guardias de navegación requiriendo `pb.authStore.isValid`.
- Resultado: Las vistas protegidas expulsan al usuario si la sesión no es válida.

### CLASIFICACIÓN FINAL: **A**
