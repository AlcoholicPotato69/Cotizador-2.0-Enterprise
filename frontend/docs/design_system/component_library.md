# Component Library Specifications

Este documento especifica los requisitos, propiedades, estados y comportamiento de los componentes fundamentales. **No se incluye el código fuente aquí**, sirviendo exclusivamente como plano arquitectónico para la implementación en Vue 3.

## 1. Inputs & Controles de Formulario

### Buttons
*   **Variants:** `primary`, `secondary`, `tertiary`, `danger`, `ghost`, `link`.
*   **Sizes:** `sm`, `md` (default), `lg`, `icon-only`.
*   **States:** Default, Hover, Active/Pressed, Disabled, Loading (muestra spinner interno preservando la anchura).
*   **Specs:** Deben usar los radius, fonts y motion tokens. Soporte estricto para navegación con tabulador (focus-visible).

### Inputs (Text, Password, Number)
*   **Props:** `placeholder`, `label`, `hint`, `error`, `left-icon`, `right-icon`, `clearable`.
*   **States:** Default, Hover, Focus (Ring de 2px con `--ds-color-primary-main`), Disabled, Error (borde rojo, texto de error y shake animation opcional).
*   **UX:** Float labels o labels fijos con excelente contraste.

### Selects & Autocomplete
*   **Props:** `searchable`, `multiple`, `clearable`.
*   **Specs:** El dropdown debe inyectarse en el `<Teleport to="body">` para evitar problemas de `overflow: hidden` o `z-index`. Uso de Virtual Scrolling para +100 opciones.

### Date Pickers
*   **Modes:** Single Date, Date Range, Month/Year Picker.
*   **UX:** Soporte para entrada manual de texto (ej. "DD/MM/YYYY"). Highlight de rangos con color primario con 10% opacidad.

## 2. Visualización de Datos

### Tables & Data Grids
*   **Props:** `columns`, `data`, `loading`, `sortable`, `paginated`, `selectable` (checkboxes), `sticky-header`.
*   **Specs:** Renderizado eficiente (Virtual Scrolling para grid pesado). Las filas deben tener estado hover sutil. Acciones en la última columna deben ser un `Dropdown` o un row-hover-actions group.

### Cards
*   **Estructura:** Header, Body, Footer. Slots independientes para cada sección.
*   **Props:** `elevated` (boolean), `bordered` (boolean), `interactive` (efecto hover de levantamiento sutil si es clickable).

### Timelines
*   **Uso:** Visualización de histórico de cotizaciones o auditoría de cambios.
*   **Props:** `items` (array de eventos), `status-colors` para distinguir creación, aprobación, o error.

## 3. Navegación y Estructura

### Tabs
*   **Variants:** `underline` (minimalista, borde inferior), `pills` (fondo encapsulado estilo botón).
*   **Specs:** Soporte de accesibilidad con flechas direccionales para cambiar tab. Transición fluida del indicador activo.

### Drawers (Off-canvas)
*   **Placement:** Right, Left.
*   **Props:** `size` (sm, md, lg, full), `backdrop-blur` (para interfaz premium).
*   **Comportamiento:** Debe pausar el scroll del body (`overflow: hidden`). Captura de escape (`ESC`) para cerrar.

### Modals / Dialogs
*   **Variantes:** `alert` (confirmación rápida), `standard` (formularios o detalle), `fullscreen` (flujos complejos).
*   **Specs:** Animación de entrada (`zoom-in` o `slide-up`), focus trap interior.

## 4. Componentes Específicos del Negocio

### Approval Flow Viewer
*   **Propósito:** Visualizar la jerarquía de aprobación de una cotización.
*   **Specs:** Visualización de nodos estilo grafo o árbol horizontal. Hover states que muestren tooltips con el email y cargo del aprobador, fecha de estado y SLA.

### Notification Center
*   **Uso:** Drawer o Popover accesible desde el App Header.
*   **Specs:** Agrupación por fecha. Indicadores visuales de no-leído (punto azul/rojo). Transiciones de eliminación (swipe-to-dismiss o fade-out).

### Command Palette
*   **Atajo:** `Ctrl + K` / `Cmd + K`.
*   **Propósito:** Búsqueda rápida de cotizaciones, clientes o saltos directos de navegación.
*   **Specs:** Oscurecimiento completo del fondo. Focus automático. Navegación 100% por teclado (Up/Down, Enter). Debounce inyectado para las búsquedas.
