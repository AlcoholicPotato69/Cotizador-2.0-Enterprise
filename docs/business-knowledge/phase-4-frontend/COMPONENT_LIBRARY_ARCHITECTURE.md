# COMPONENT LIBRARY ARCHITECTURE

## Catálogo Base Obligatorio
- **Botones**: Primary, Ghost, Danger.
- **Inputs**: `ds-input-text`, `ds-input-currency` (auto-formato MXN).
- **Feedback**: Toast, Modal genérico, Drawers laterales (Slide-overs).
- Todo componente debe heredar de los Design Tokens, nunca colores *hardcodeados*.