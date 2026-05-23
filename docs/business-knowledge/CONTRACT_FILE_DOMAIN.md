# CONTRACT FILE DOMAIN (Futuro Modelo de Entidad)

## 1. Justificación
La generación de un contrato no es el final de un flujo, es el nacimiento de un documento con vida legal propia. La Fase E instituye al **Contract File** como una entidad maestra que no debe existir solo como una columna en la cotización, sino como un objeto robusto con su propio ciclo de vida.

## 2. Alcance del Contract File
En fases futuras (Fase F o posterior), el Contract File encapsulará:

- **Contrato Principal**: El HTML inmutable (`template_snapshot`).
- **Anexos Dinámicos**: Cláusulas o reglamentos adjuntos mediante motores de reglas (Ej. "Anexo de Pirotecnia" incluido por regla comercial).
- **Renovaciones/Adendums**: Registro en línea de tiempo si un contrato sufrió modificaciones mutuas.
- **Auditoría Legal**: Trazabilidad de quién aprobó, quién firmó, y qué documentos de validación existían.
- **Relaciones Financieras**:
  - `recibos`: Historial de abonos vinculados directamente al contrato.
  - `facturas`: Documentos fiscales emitidos para este acuerdo comercial.

## 3. Workflow Integrado
El flujo `Cliente -> Cotización -> Contrato -> Recibo -> Factura` tendrá al **Contract File** como la bisagra legal. Las facturas validarán su existencia contra el contrato antes de ser emitidas (Compliance Driven).
