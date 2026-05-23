# TENANT FISCAL VALIDATION

## 1. El Candado de Identidad del Emisor
El *CFDI Validation Engine* incorpora una validación de aislamiento Multi-Tenant crítica para corporativos.

Durante el Parseo del XML:
Se extrae el campo `Emisor.Rfc` del XML subido.

Ese valor es comparado estrictamente contra el `tenant.tax_profile.rfc` almacenado en la Base de Datos.

### Resultado de la Validación:
Si un ejecutivo intenta subir una factura emitida por **Plaza Mayor** a un Contrato perteneciente al entorno de **Casa de Piedra**, el sistema generará un rechazo automático de Nivel Arquitectónico (HTTP 403: *Tenant Fiscal Mismatch*).

Es matemáticamente imposible cruzar contabilidades entre inquilinos.