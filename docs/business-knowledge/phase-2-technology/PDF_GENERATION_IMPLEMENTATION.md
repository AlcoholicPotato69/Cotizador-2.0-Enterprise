# PDF GENERATION IMPLEMENTATION (Fase 2.1)

## 1. Patrón Template Engine
El Sidecar compila el HTML almacenado en el `template_snapshot` inyectando las variables del `financial_snapshot` mediante Handlebars/Vue SSR.

## 2. Inyección CSS
Se inyecta un bloque `<style>` dinámico con las paletas de color y tipografías almacenadas en el `branding_snapshot` del Tenant actual. Playwright espera al evento `networkidle` para asegurar que las Google Fonts cargaron antes de renderizar.