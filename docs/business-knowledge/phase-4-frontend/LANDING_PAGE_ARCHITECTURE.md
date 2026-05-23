# LANDING PAGE ARCHITECTURE (Fase 4.1)

## 1. Portal de Acceso
- **Estado Unauthenticated**: Vista institucional pulida con branding corporativo global (o multi-branding) y formulario de Login.
- **Redirección Mágica**: Si un JWT válido existe, el `Router Guard` bloquea el acceso al *Landing* y catapulta al usuario al Dashboard Base dinámico (Publicidad para PM, Eventos para CP).