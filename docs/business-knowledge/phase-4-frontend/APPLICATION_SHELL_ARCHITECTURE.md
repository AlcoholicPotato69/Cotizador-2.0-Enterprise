# APPLICATION SHELL ARCHITECTURE (Fase 4.1)

## 1. El Marco Operativo (Layout Base)
- **Sidebar**: Navegación principal dinámica generada desde el `usePermissions()`. (Ej. Si no tienes `invoice.view`, no ves la pestaña Financiera).
- **Topbar**: User Profile, Notification Bell y Global Search Bar.
- **Tenant Badge**: Indicador visual persistente (Arriba a la Izquierda) recordando al usuario si está operando Plaza Mayor (Rojo) o Casa de Piedra (Café).