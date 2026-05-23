# DARK MODE AUDIT

**Generado:** 2026-05-22T05:10:00.000Z

## Metodología

Se montó un entorno headless de Chromium (Playwright) para capturar automáticamente el comportamiento físico del sistema bajo los perfiles de `Light` y `Dark` mode.

## Análisis Visual (Enterprise Standards)

### Capturas de Referencia (Playwright)

````carousel
![Login Light Mode (PM)](/C:/Users/johan/.gemini/antigravity/brain/ed67d679-888e-488e-b5f8-186486587e85/screenshots/01_login_light.png)
<!-- slide -->
![Login Dark Mode](/C:/Users/johan/.gemini/antigravity/brain/ed67d679-888e-488e-b5f8-186486587e85/screenshots/02_login_dark.png)
<!-- slide -->
![Dashboard Dark](/C:/Users/johan/.gemini/antigravity/brain/ed67d679-888e-488e-b5f8-186486587e85/screenshots/03_dashboard_dark.png)
<!-- slide -->
![Clients Light (PM)](/C:/Users/johan/.gemini/antigravity/brain/ed67d679-888e-488e-b5f8-186486587e85/screenshots/05_clients_light.png)
<!-- slide -->
![Clients Light (CP)](/C:/Users/johan/.gemini/antigravity/brain/ed67d679-888e-488e-b5f8-186486587e85/screenshots/06_clients_light_cp.png)
````

### 1. Fondos y Superficies (Contraste General)
- **Estado:** ✅ Las superficies primarias (`surface-0` a `surface-950`) se invierten con éxito. El fondo oscuro (`#020617` - Slate 950) proporciona una base premium comparable a Vercel/Linear.
- **Problema Detectado:** Algunos componentes tienen bordes definidos con `border-surface-200` que en Dark Mode se vuelve `border-surface-700` (`#334155`). Este borde es a veces demasiado claro o grueso, restando elegancia "glassmorphic" o sutil al entorno.

### 2. Acentos Primarios (El problema del contraste)
- **Estado:** ❌ Crítico.
- **Descripción:** El Tenant PM usa `--color-primary: #dc2626` (Rojo). En modo oscuro, botones primarios con fondo rojo y texto blanco mantienen cierta legibilidad, pero los textos de estado (ej: un badge `text-primary-700`) se vuelven invisibles contra el fondo negro.
- **Solución Requerida:** La escala `primary` debe tener un bloque de media-query o definición `.dark` paralela que aclare los tonos oscuros de la marca para que sean vibrantes sobre negro, evitando la fatiga visual.

### 3. Formularios y Tablas (Data Density)
- **Estado:** 🚧 Parcial.
- **Descripción:** Las tablas renderizan bien sus filas gracias a la inversión de superficies, pero los *hover states* (ej. `hover:bg-surface-50`) en Dark Mode equivalen a `hover:bg-surface-900` (`#0f172a`), un contraste casi indetectable respecto al fondo base `#020617`. Esto rompe la percepción interactiva (Linear/Notion feedback loop).

## Conclusión de Dark Mode

El modo oscuro no "falla" técnicamente, pero adolece de **Flatness Inconsistente** y **Contraste de Acento**. 

**Clasificación Visual: C (Visualmente inconsistente)**

*No cumple la meta de sentirse como Arc Browser o Stripe Dashboard en su estado actual, requiriendo un refactor de la paleta Primary específica para Dark.*
