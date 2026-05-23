# PDF ENGINE EVALUATION (Fase 2.1)

## Objetivo
Seleccionar el motor de generación documental backend para erradicar la dependencia de "Imprimir desde el navegador", garantizando soporte Multi-Tenant y compatibilidad absoluta con el *Branding Builder* y *Template Builder*.

## Análisis Comparativo

### 1. PDFKit (Librería Nativa Node)
- **Fidelidad HTML/CSS**: Nula. Requiere dibujar coordenadas manuales (X,Y).
- **Compatibilidad Builder**: Nula. No renderiza HTML.
- **Rendimiento / RAM**: Excelente (Muy bajo consumo).
- **Veredicto**: Descartado. Rompe la arquitectura del *Template Builder* HTML.

### 2. Puppeteer (Headless Chrome)
- **Fidelidad HTML/CSS**: 100%. Mismo motor de renderizado que el navegador del usuario.
- **Compatibilidad Builder**: 100%. Renderiza CSS Grid, Flexbox y webfonts.
- **Rendimiento / RAM**: Alto consumo (~150MB por instancia). Requiere manejo estricto de concurrencia y reciclaje de instancias (`puppeteer-cluster`).
- **Riesgos Operativos**: Fugas de memoria si los *browser contexts* no se cierran adecuadamente. 
- **Veredicto**: Viable.

### 3. Playwright PDF (Headless Chromium)
- **Fidelidad HTML/CSS**: 100%.
- **Compatibilidad Builder**: 100%.
- **Rendimiento / RAM**: Consumo similar a Puppeteer, pero arquitectura interna más moderna orientada a contextos aislados (BrowserContext), ideal para aislamiento Multi-Tenant.
- **Mantenibilidad**: Soporte nativo y activo por Microsoft. Tiempos de arranque en frío (*cold start*) ligeramente menores a Puppeteer.
- **Veredicto**: Viable.

## Recomendación Técnica Documentada

Se selecciona **Playwright (Headless Chromium)** como el único motor de generación PDF de la Fase 2.

**Justificación Técnica:**
1. Garantiza el 100% de fidelidad CSS del *Template Builder*.
2. Los `BrowserContexts` de Playwright son más eficientes y aislados para procesar peticiones simultáneas de múltiples Tenants (Ej. un contrato de Plaza Mayor y uno de Casa de Piedra concurrentes sin contaminación de cache de fuentes/logos).
3. Erradica la necesidad de coordinar coordenadas manuales (PDFKit) manteniendo el paradigma "Configuration over Code" del TAC.

**Siguiente paso:** Proceder a diseñar la arquitectura del servicio en base a Playwright y emitir los certificados de inmutabilidad.