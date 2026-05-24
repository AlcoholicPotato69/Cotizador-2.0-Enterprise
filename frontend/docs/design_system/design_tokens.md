# Design Tokens & Theming Architecture

Este documento define la base matemática y visual del Design System. La arquitectura está diseñada estrictamente bajo un modelo **White Label**, permitiendo el intercambio de temas de manera instantánea mediante variables CSS inyectadas en el `:root` o en contenedores específicos.

## 1. Arquitectura de Theming (White Label)

Para soportar el modelo White Label y Light/Dark mode fluido, usamos un sistema de dos niveles:
1.  **Global Tokens (Primitives)**: Valores literales (hex, rem, px). No se usan directamente en componentes.
2.  **Alias Tokens (Semantics)**: Definen el *propósito* del token. Mapean a los Global Tokens y cambian según el tema activo.

### Estructura base (CSS Variables)

```css
/* Primitivas de Color (No usar directamente) */
:root {
  --ds-global-blue-500: #2563EB;
  --ds-global-blue-600: #1D4ED8;
  --ds-global-slate-50: #F8FAFC;
  --ds-global-slate-900: #0F172A;
}

/* Semántica Light Mode (Default Theme) */
:root[data-theme="light"] {
  --ds-color-primary-main: var(--ds-global-blue-500);
  --ds-color-primary-hover: var(--ds-global-blue-600);
  --ds-color-bg-base: #FFFFFF;
  --ds-color-bg-surface: var(--ds-global-slate-50);
  --ds-color-text-primary: var(--ds-global-slate-900);
}

/* Semántica Dark Mode (Default Theme) */
:root[data-theme="dark"] {
  --ds-color-primary-main: var(--ds-global-blue-500);
  --ds-color-bg-base: var(--ds-global-slate-900);
  --ds-color-bg-surface: #1E293B;
  --ds-color-text-primary: #F8FAFC;
}
```

## 2. Typography Scale

Basado en una escala modular matemática (ratio 1.2 o 1.25).

*   `--ds-font-family-base`: 'Inter', system-ui, sans-serif;
*   `--ds-font-family-mono`: 'JetBrains Mono', monospace;

**Scale:**
*   `--ds-text-xs`: 0.75rem (12px) | Line Height: 1.125rem
*   `--ds-text-sm`: 0.875rem (14px) | Line Height: 1.25rem
*   `--ds-text-base`: 1rem (16px) | Line Height: 1.5rem
*   `--ds-text-lg`: 1.125rem (18px) | Line Height: 1.75rem
*   `--ds-text-xl`: 1.25rem (20px) | Line Height: 1.75rem
*   `--ds-text-2xl`: 1.5rem (24px) | Line Height: 2rem
*   `--ds-text-3xl`: 1.875rem (30px) | Line Height: 2.25rem

## 3. Spacing System

Escala predecible basada en factor de 4px (0.25rem).
*   `--ds-space-1`: 0.25rem (4px)
*   `--ds-space-2`: 0.5rem (8px)
*   `--ds-space-3`: 0.75rem (12px)
*   `--ds-space-4`: 1rem (16px)
*   `--ds-space-5`: 1.25rem (20px)
*   `--ds-space-6`: 1.5rem (24px)
*   `--ds-space-8`: 2rem (32px)
*   `--ds-space-12`: 3rem (48px)
*   `--ds-space-16`: 4rem (64px)

## 4. Border Radius

Tokens semánticos para suavizar las esquinas.
*   `--ds-radius-none`: 0px
*   `--ds-radius-sm`: 0.125rem (2px) - Checkboxes, Tooltips
*   `--ds-radius-base`: 0.25rem (4px) - Botones estándar, Inputs
*   `--ds-radius-md`: 0.375rem (6px) - Cards pequeñas, Menús
*   `--ds-radius-lg`: 0.5rem (8px) - Cards principales, Modals
*   `--ds-radius-xl`: 0.75rem (12px) - Drawers, Elementos flotantes grandes
*   `--ds-radius-full`: 9999px - Badges circulares, Avatars

## 5. Elevation & Shadow System

Las sombras deben comunicar jerarquía en el eje Z. Dependen del tema activo para verse naturales (sombras más oscuras y opacas en dark mode).

*   `--ds-shadow-sm`: Elevación mínima (ej: botones, inputs ligeros).
*   `--ds-shadow-base`: Elevación estándar (ej: dropdowns, cards).
*   `--ds-shadow-md`: Elevación media (ej: tooltips, popovers).
*   `--ds-shadow-lg`: Elevación alta (ej: modales, dialogos).
*   `--ds-shadow-xl`: Elevación máxima (ej: notificaciones toast, command palette flotante).

*Nota: En modo oscuro, las sombras usarán rgba() con colores de acento oscuros, o se combinarán con bordes sutiles (ej: 1px solid rgba(255,255,255,0.1)) para simular elevación.*
