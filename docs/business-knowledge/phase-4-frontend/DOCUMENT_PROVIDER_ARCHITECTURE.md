# DOCUMENT PROVIDER ARCHITECTURE (Fase 4.2)

## 1. Capa de Abstracción MIME Type
El `DsDocumentViewer` no renderizará PDFs directamente; delegará la tarea a una interfaz `DocumentProvider`.
- Si `mimeType === 'application/pdf'`, invoca al **PDFProvider** (basado en `PDF.js` Canvas Render).
- Si `mimeType === 'text/xml' || mimeType === 'application/xml'`, invoca al **XMLProvider** (Inyecta un árbol DOM con Syntax Highlighting).
- Si `mimeType === 'image/jpeg' || mimeType === 'image/png'`, invoca al **ImageProvider** (Lienzo interactivo con zoom/pan).

Esta inyección de dependencias permite agregar futuros `VideoProviders` o `WordProviders` sin tocar el cascarón de seguridad y auditoría del `DsDocumentViewer`.