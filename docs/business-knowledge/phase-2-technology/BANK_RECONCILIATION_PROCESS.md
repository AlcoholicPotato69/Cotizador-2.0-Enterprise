# BANK RECONCILIATION PROCESS (Fase 2.6)

## 1. El Triángulo de Conciliación
La conciliación en Cotizador 2.0 se logra garantizando que tres vértices empaten:
- **Monto Base**: Extraído del `financial_snapshot` del contrato.
- **Referencia**: Atrapada en el snapshot e impresa en las instrucciones de pago del PDF.
- **Abono**: El monto real capturado por Finanzas (tras ver su banco) e inyectado al `financial_ledger`.

Al no depender de APIs bancarias externas, la responsabilidad del ingreso de dinero recae en el usuario de Finanzas, mientras que la responsabilidad de la cuadratura matemática y el bloqueo del cierre de contrato recae en PocketBase.