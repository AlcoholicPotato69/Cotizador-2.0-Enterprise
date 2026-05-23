# GLOBAL ERROR HANDLING ARCHITECTURE (Fase 4.1)

## 1. Interceptor Central
Todo fallo en la SPA es atrapado por el `Axios Interceptor` / `fetch interceptor`.
- **API Errors (500)**: `GlobalToast.danger("Error de conexión con el Servidor")`.
- **Validation Errors (400)**: Se inyectan en `useForm()` para iluminar en rojo los Inputs específicos.
- **Permission Errors (403)**: `GlobalToast.warning("Sin acceso")` y redirección a *Dashboard*.
- **Network Errors (Offline)**: Pantalla de *Offline Skeleton*.