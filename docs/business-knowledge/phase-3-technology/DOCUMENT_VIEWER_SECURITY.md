# DOCUMENT VIEWER SECURITY

## 1. Hardening del Frontend PDF Viewer
Para prevenir extracción y fuga de documentos sensibles (`invoice.view`):
- **Prevención de Descarga Físca**: La URL generada hacia el S3 Bucket es temporal (Presigned URL expirando en 5 minutos).
- **Marcas de Agua Dinámicas**: El visor `PDF.js` inyecta un *Overlay* de texto renderizado en Canvas superpuesto al PDF. La marca de agua cruzará la pantalla con el texto: `CONFIDENTIAL - VIEWED BY [user_email] - [timestamp] - [ip_address]`.
- Si un usuario le toma una fotografía a la pantalla, la marca de agua servirá como huella forense infalible.