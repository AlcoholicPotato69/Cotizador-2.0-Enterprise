# Estrategia de Accesibilidad (WCAG 2.1 AA)

El Cotizador 2.0 Enterprise es una herramienta de trabajo intensiva. El cumplimiento de las directrices de accesibilidad (WCAG 2.1 Nivel AA) no es solo un requerimiento legal, sino una forma directa de mejorar la ergonomía y la usabilidad para todos los operadores.

## 1. Contraste Visual
Para prevenir la fatiga visual de los usuarios de 8+ horas:
*   **Texto a Fondo:** Mantener una relación de contraste mínima de `4.5:1` para texto normal y `3:1` para texto grande y elementos de interfaz de usuario (botones, bordes de inputs).
*   **Modo Oscuro (Dark Mode):** Soporte nativo para modo oscuro. Esto reduce significativamente la fatiga ocular en espacios con iluminación controlada o baja.
*   **Información con Color:** Nunca usar el color como la *única* forma de transmitir información. Ejemplo: Si un estado es "Rechazado", debe mostrarse en color rojo, pero también debe incluir un ícono de error [X] y el texto explícito "Rechazado".

## 2. Navegación por Teclado
Los power-users dependen del teclado. El ratón debe ser opcional para flujos críticos:
*   **Foco Visible (`:focus-visible`):** Todos los elementos interactivos deben tener un anillo de foco (focus ring) de al menos `2px` con alto contraste. Evitar modificar el outline nativo del navegador a menos que el reemplazo sea superior.
*   **Orden Lógico del DOM (`tabindex`):** El recorrido del tabulador (`Tab`) debe fluir de izquierda a derecha y de arriba a abajo. Evitar el uso de `tabindex` mayor a 0. Usar `tabindex="-1"` solo para gestionar el foco en modales u overlays.
*   **Skip Links:** Incluir un enlace invisible (que se hace visible al enfocar) al inicio del documento: "Saltar al contenido principal", para esquivar el panel lateral.

## 3. Lectores de Pantalla y Tecnologías de Asistencia
*   **Estructura Semántica:** Uso correcto de `nav`, `main`, `aside`, `section`, `header`, `footer`. Los encabezados (`h1`-`h6`) deben seguir un orden jerárquico estricto.
*   **Avisos en Vivo (`aria-live`):** Para notificaciones (toasts), estados de guardado o errores que aparecen dinámicamente, se usarán regiones `aria-live="polite"` (para avisos) o `aria-live="assertive"` (para errores críticos).
*   **Asociación de Formularios:** Todo `input` debe tener un `label` asociado por `id`. Los errores de validación y textos de ayuda deben conectarse usando `aria-describedby`.
*   **Estados y Propiedades:** Uso proactivo de `aria-expanded`, `aria-selected` y `aria-invalid` en componentes personalizados como selectores multicapa o acordeones.
