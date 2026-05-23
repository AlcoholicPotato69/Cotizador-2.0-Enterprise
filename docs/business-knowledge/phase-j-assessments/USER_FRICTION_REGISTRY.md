# USER FRICTION REGISTRY (J.6)

## 1. Incidencias de UX y Fricción Operativa
| Módulo | Tipo de Fricción | Descripción | Severidad |
|--------|------------------|-------------|-----------|
| Wizard | Confusión de UX | Los usuarios comerciales de CP olvidaban agregar el Montaje antes del evento, generando advertencias en el `AvailabilityEngine`. | Media |
| TAC | Pasos Innecesarios | Para revocar un permiso a un rol temporalmente, debían crear un rol nuevo. Se solucionó con FLS `is_deny=true`. | Baja |
| Finanzas | Incidencia de Rendimiento | La pantalla de Conciliación tardaba 4s en renderizar 500 `financial_events`. Requiere indexación. | Media |