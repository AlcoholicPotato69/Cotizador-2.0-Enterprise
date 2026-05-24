# Motion & Interaction System

El sistema de movimiento y animaciones está diseñado para que la interfaz se sienta "premium", responsiva y viva, reduciendo al mismo tiempo la carga cognitiva del usuario. El principio es: **El movimiento debe tener propósito, no distracción.**

## 1. Easing Curves (Curvas de Aceleración)

Reemplazamos las animaciones genéricas `linear` o `ease` con curvas Bézier personalizadas inspiradas en la física del mundo real.

*   `--ds-ease-standard`: `cubic-bezier(0.4, 0.0, 0.2, 1)`
    *   *Uso:* Elementos moviéndose dentro de la pantalla. Acelera rápido y frena suavemente.
*   `--ds-ease-decelerate`: `cubic-bezier(0.0, 0.0, 0.2, 1)`
    *   *Uso:* Elementos entrando a la pantalla (ej: Modals, Drawers). Comienza rápido, termina suave.
*   `--ds-ease-accelerate`: `cubic-bezier(0.4, 0.0, 1, 1)`
    *   *Uso:* Elementos saliendo de la pantalla (ej: Cerrar un toast). Comienza lento, sale rápido.
*   `--ds-ease-spring`: `cubic-bezier(0.175, 0.885, 0.32, 1.275)`
    *   *Uso:* Microinteracciones que requieren un "rebote" juguetón (ej: Checkboxes, toggle switches).

## 2. Durations (Tiempos)

La velocidad lo es todo. Interfaces lentas frustran al usuario.

*   `--ds-duration-fast`: `150ms` (Hover states, color changes, opacities)
*   `--ds-duration-normal`: `250ms` (Drawers, Modals, reordenamiento de listas)
*   `--ds-duration-slow`: `350ms` (Transiciones complejas de páginas completas)

## 3. Core Micro-Interactions

*   **Buttons:** Efecto de "presión" al hacer click (`transform: scale(0.98)`). Cambios de color cruzados con `--ds-duration-fast`.
*   **Cards/Containers:** Elevación al hacer hover. Transición en `box-shadow` y `transform: translateY(-2px)`.
*   **List Reordering / Sorting:** Animaciones basadas en FLIP (Vue `<TransitionGroup>`) para explicar visualmente al cerebro que un elemento ha cambiado de lugar sin que se sienta un "parpadeo" duro.
*   **Feedback/Spinners:** Rotaciones continuas `linear`, o pulsaciones orgánicas lentas (`1000ms`, `ease-in-out`).

## 4. Accesibilidad: Reduced Motion

Todas las animaciones deben respetar las preferencias del sistema operativo del usuario.

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
En lugar de eliminar transiciones, se aceleran al instante visualmente (o se recurre a puros fade in/out muy rápidos) para respetar los estados de Vue que puedan depender de los eventos `transitionend`.
