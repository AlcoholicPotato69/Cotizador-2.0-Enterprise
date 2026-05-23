# SESSION MANAGEMENT ARCHITECTURE (Fase 4.1)

## 1. Validación Activa
Si el usuario deja la pestaña inactiva por X tiempo o el token JWT expira, el *Axios Interceptor* capturará el error 401 y disparará la acción `authStore.logout()`, forzando el retorno al Login.
## 2. Invalidation Hook
Cualquier cambio a la contraseña o rol del usuario invalida automáticamente todos sus *Tokens* emitidos en la Base de Datos, matando la sesión inmediatamente.