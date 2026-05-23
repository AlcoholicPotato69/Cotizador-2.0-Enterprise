# STORE HEALTH REPORT

**Generado:** 2026-05-22T05:08:00.000Z

## Resumen de Integridad de Stores (Pinia)

Se auditaron los stores de estado global en `src/stores/` para validar su inicialización, persistencia, e integración con PocketBase.

### Auditoría por Módulo

| Store | Estado Físico | Conexión a PB | Lógica Mockeada | Clasificación |
| :--- | :--- | :--- | :--- | :--- |
| `authStore.ts` | ✅ Existe | 🚧 Parcial | No | **B** (Falta sync automático con `pb.authStore.onChange`) |
| `clientStore.ts` | ✅ Existe | ✅ Integrado | ❌ Eliminada | **A** (Recupera datos reales de PB) |
| `tenantStore.ts` | ✅ Existe | ❌ No Integrado | No | **C** (El tenant se hardcodea a 'pm', debe derivarse de la BD) |
| `themeStore.ts` | ✅ Existe | N/A (UI state) | No | **A** (Inyecta clases `.dark` en HTML core) |
| `permissionsStore.ts` | ✅ Existe | ❌ No Integrado | ⚠️ Sí (`setPermissions` hardcoded) | **C** (Permisos hardcodeados en AppLayout) |
| `notificationStore.ts` | ✅ Existe | ❌ No Integrado | No | **B** (Falta sync con websockets/realtime PB) |
| `sessionStore.ts` | ✅ Existe | N/A (UI state) | No | **A** (Gestión de inactividad) |

### Hallazgos Críticos

1. **`tenantStore.ts`:** El Tenant está forzado a inicializarse como `pm`. Para una app multi-tenant real, el tenant activo debe extraerse del payload JWT del usuario tras el login.
2. **`permissionsStore.ts`:** Se inicializa un array vacío de permisos y varias vistas hacen fallback inyectando: `client.read`, `client.create`, etc. Debe acoplarse con la respuesta de `pb.collection('users').getOne()`.

### Recomendaciones (Estabilización Fase 4.4)
- Mapear reactivamente `pb.authStore.onChange` hacia `authStore`, `tenantStore` y `permissionsStore` en un único Bootloader.