# Client File Domain Model

## 1. Visión General
El **Expediente de Cliente** es una estructura de datos holística que encapsula toda la interacción, documentación, legalidad y estado de un prospecto comercial con el Tenant.

## 2. Anatomía del Expediente

El expediente no es una sola tabla, es un conjunto de información relacionada:
- **Perfil Comercial**: Datos Generales, Contactos.
- **Perfil Fiscal**: RFC, Dirección de Facturación, Régimen.
- **Expediente Documental**: Colección de archivos digitales asociados (`documentos`).
- **Historial Legal**: Contratos firmados y cotizaciones pasadas.
- **Balance Financiero**: Estado de pagos/adeudos (Integración/API a ERP externo).

## 3. El Flujo de Verificación (Compliance)
La ingesta de un cliente pasa por el rol `verificador` o `compliance`:
1. El comercial recaba el perfil.
2. El sistema requiere N documentos obligatorios (Definidos por configuración del Tenant).
3. El cliente sube archivos (Borradores).
4. El verificador visualiza el Expediente Documental.
5. El verificador emite un veredicto: `Aprobado` o `Rechazado`.

## 4. El Veredicto Final (Elegibilidad)
Como se definió en la arquitectura, un expediente de cliente nunca se considera un "booleano estático".
La estructura del cliente solo provee los datos. Cuando un usuario quiere interactuar comercialmente con él, el sistema envía el "Expediente Completo" al **Client Eligibility Engine**, el cual emite un dictamen en tiempo real basándose en si sus documentos están aprobados, no están vencidos y no hay bloqueos comerciales.
