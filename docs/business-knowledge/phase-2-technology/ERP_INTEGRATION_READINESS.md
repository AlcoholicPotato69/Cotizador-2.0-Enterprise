# ERP INTEGRATION READINESS (Fase 2.6 / Preparación Fase 3)

## 1. Intelisis (ERP Externo)
- **Estado Actual**: Mock/Discovery.
- **Objetivo Futuro**: Cuando exista documentación técnica oficial (WSDL/REST endpoints) provista por el proveedor de Intelisis, se construirá un `IntelisisProvider`.
- **Mecanismo Diseñado**: Este proveedor interceptará el evento `invoice_approved` y enviará el XML/JSON al ERP de manera asíncrona. 

## 2. Facturama (PAC Externo)
- **Estado Actual**: Mock/Discovery.
- **Objetivo Futuro**: Timbrado automático mediante API.
- **Mecanismo Diseñado**: El `FacturamaProvider` construirá el payload UUID/Conceptos extrayendo la información matemáticamente congelada en el `financial_snapshot`, garantizando que la factura emitida concuerde al centavo con el contrato.