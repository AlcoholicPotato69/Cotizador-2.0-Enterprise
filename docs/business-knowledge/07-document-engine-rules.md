# 07 - Document Engine Rules & 08 - Template Engine Rules

## 1. Documentos Inmutables
- Una vez que el Template Engine genera un archivo, este archivo se guarda de forma permanente y segura en el servidor de archivos (PocketBase Storage) en la colección `documentos`.
- No se re-genera el PDF "al vuelo" cada vez que alguien lo solicita, para garantizar que se respeta exactamente lo que se firmó/aprobó.

## 2. Plantillas (Template Engine)
- El Legacy utilizaba editores HTML/Canvas "Drag & Drop" (como se ve en `dictamen-generator.js` y `pdf-editor-hitbox.js`) donde el usuario movía cajas de texto sobre un fondo fijo (Membrete).
- **Placeholders**: Textos como `{{CLIENT_NAME}}`, `{{FOLIO}}`, `{{TODAY}}` se reemplazan al momento de compilar el PDF.

## 3. Reto de Refactorización (V2)
- Mover esta generación a un pipeline consistente. En el legacy dependía fuertemente de `html2pdf` del lado del cliente, lo que generaba resultados distintos en Chrome vs Safari.
- La versión 2.0 deberá abstraer el diseño del documento de la lógica de negocio, idealmente renderizando plantillas Vue controladas.
