# CFDI VALIDATION ENGINE (Fase 3.0)

## 1. El Motor Interceptor (XML Parser)
Al intentar subir un XML, el sistema lo parsea antes de guardarlo en Base de Datos y ejecuta 4 candados inflexibles:

- **CANDADO RFC**: Extrae el `Receptor.Rfc` del XML. Si no es matemáticamente idéntico al `rfc` almacenado en el `client_snapshot`, la subida es **Rechazada**. Error: *RFC Mismatch*.
- **CANDADO MONTO**: Extrae `SubTotal`, `TotalImpuestosTrasladados` y `Total`. Si la suma no empata al centavo con el `financial_snapshot` o los abonos validados, la subida es **Rechazada**. Error: *Financial Mismatch*.
- **CANDADO RAZÓN SOCIAL**: Coteja el `Receptor.Nombre` aplicando un *Fuzzy Match* controlado para obviar signos como "S.A." vs "SA".
- **CANDADO UUID**: Extrae el `TimbreFiscalDigital.UUID`. Si ya existe en la colección de facturas, la subida es **Rechazada**. Error: *Duplicated UUID*.

El XML es la única fuente de verdad; el PDF es tratado como una imagen inerte.