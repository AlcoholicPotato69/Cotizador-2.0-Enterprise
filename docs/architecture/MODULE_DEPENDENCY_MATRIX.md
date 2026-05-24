# Module Dependency Matrix

Define el flujo de dependencias entre los módulos de NestJS para garantizar una arquitectura limpia y sin dependencias circulares.

| Módulo (Filas) \ Depende de (Columnas) | Quote | Pricing | Catalog | Customer | IAM  | ERP ACL |
|----------------------------------------|-------|---------|---------|----------|------|---------|
| **Quote**                              | -     | SI      | SI      | SI       | SI   | NO      |
| **Pricing**                            | NO    | -       | SI      | SI       | SI   | NO      |
| **Catalog**                            | NO    | NO      | -       | NO       | SI   | NO      |
| **Customer**                           | NO    | NO      | NO      | -        | SI   | NO      |
| **IAM**                                | NO    | NO      | NO      | NO       | -    | NO      |
| **ERP ACL**                            | SI    | SI      | SI      | SI       | NO   | -       |

## Reglas de Arquitectura Estricta (NestJS Modules)

1. **Jerarquía Estricta**: Ningún módulo "Supporting" (Pricing, Catalog, Customer) puede importar directa o indirectamente el módulo "Core" (Quote).
2. **Dependencias Cíclicas Cero**: Prohibido utilizar `forwardRef()` en NestJS. Si dos módulos se necesitan mutuamente, hay un error de modelado; se debe extraer un módulo intermedio (Shared Kernel) o comunicarse por eventos asíncronos.
3. **Comunicación Ascendente**: Las interacciones desde dependencias menores hacia las mayores (ej. Catálogo notificando a Quote) deben ocurrir exclusivamente mediante **Eventos de Dominio** de NestJS (Event Emitter).
4. **Aislamiento del ERP**: Ningún módulo de dominio debe importar librerías SOAP, conectores SAP/Oracle directos u ORMs ajenos. Toda comunicación debe fluir a través del módulo `ERP ACL` inyectando puertos/interfaces.
