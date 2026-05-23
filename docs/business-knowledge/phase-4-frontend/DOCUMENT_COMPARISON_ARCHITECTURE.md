# DOCUMENT COMPARISON ARCHITECTURE (Fase 4.2)

## 1. Diseño Extensible (Side-by-Side)
Para preparar el sistema para futuras revisiones contractuales, el lienzo central del `DsDocumentViewer` se diseña como un `Flexbox Container` dinámico.
- Al activar el modo "Comparación", el lienzo se divide al 50/50.
- Permite incrustar **Documento A vs Documento B** (ej. Cotización V1 vs Cotización V2).
- Permite incrustar **Documento vs Snapshot** (ej. PDF Renderizado vs JSON Crudo de la Base de Datos).
- El *Panel de Auditoría Lateral* se contrae automáticamente o flota sobre la interfaz para no robar espacio al contraste documental.