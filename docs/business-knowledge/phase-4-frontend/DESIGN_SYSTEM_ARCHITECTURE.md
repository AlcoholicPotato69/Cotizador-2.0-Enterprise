# DESIGN SYSTEM ARCHITECTURE

## Fuente de Verdad Centralizada
Ningún componente se construirá de manera aislada.
Todo el Frontend será esclavo de una capa *Theme Engine* que conmutará variables dinámicamente:
- **Plaza Mayor**: Theme `pm-light` / `pm-dark` (Rojo Corporativo, identidad de campañas/marketing).
- **Casa de Piedra**: Theme `cp-light` / `cp-dark` (Café Corporativo, identidad salones/eventos).