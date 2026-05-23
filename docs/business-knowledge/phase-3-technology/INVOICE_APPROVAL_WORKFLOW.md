# INVOICE APPROVAL WORKFLOW (Fase 3.0)

## 1. Transiciones de Estado
La colección `invoices` utiliza los siguientes estados rígidos:
- `pending_upload`: Esperando archivos (estado inicial).
- `uploaded`: Archivos cargados. (Duración en milisegundos).
- `validated`: El *CFDI Validation Engine* dio luz verde matemática.
- `approved`: Un humano en Finanzas visualizó el PDF, revisó el UUID validado y otorgó el Vo.Bo.
- `rejected`: XML inválido o PDF ilegible.
- `cancelled`: Refleja una nota de crédito o cancelación oficial en el SAT.

## 2. Aprobación Estricta (RBAC)
Para garantizar la separación de funciones, **solamente** los usuarios que posean el permiso explícito `invoice.approve` (típicamente asignado al Rol de Finanzas) podrán transicionar una factura del estado `validated` al estado `approved` o `rejected`. Si un Ejecutivo Comercial intenta aprobar su propia factura, el Backend (PocketBase API Rules) interceptará y bloqueará la petición con un HTTP 403.

## 3. Previsualización Nativa (Frontend Viewer)
Para optimizar el flujo de trabajo de Finanzas y evitar la descarga masiva de archivos físicos locales que vulneren la seguridad:
- El Frontend (Tenant Administration Center) implementará un **visor nativo in-browser** (ej. utilizando `PDF.js` o etiquetas `<embed>`/`<iframe>` controladas).
- El usuario de Finanzas podrá visualizar la evidencia física del PDF y los metadatos del XML lado a lado en un Modal de Revisión.
- Al hacer clic en "Aprobar" o "Rechazar", la acción se dispara sin haber ensuciado la carpeta de *Descargas* del sistema operativo del usuario.

## 4. Cierre Zero-Trust
El ecosistema *PocketBase Hooks* tiene una regla inquebrantable: 
Un `contract` no puede actualizar su status a `closed` si `invoicing_status` no equivale a `approved`.