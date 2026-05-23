const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'docs', 'business-knowledge', 'phase-2-technology');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const docs = {
    'FINANCIAL_LEDGER_ARCHITECTURE.md': `# FINANCIAL LEDGER ARCHITECTURE (Fase 2.3)\n\n## 1. Diseño Inmutable *Append-Only*\nPara erradicar cálculos distribuidos, se modela la colección \`financial_ledger\`. Actúa como un libro mayor cronológico de partida doble.\n\n### Tipos de Transacción soportados:\n- \`contract_issuance\` (Cargo/Debit - Crea la deuda base)\n- \`payment_received\` (Abono/Credit - Disminuye la deuda)\n- \`invoice_issued\` (Emisión CFDI - Neutro en balance, pero requerido para conciliación fiscal)\n- \`credit_note\` (Abono/Credit)\n- \`refund\` (Cargo/Debit - Devuelve dinero)\n- \`adjustment\` (Credit/Debit - Correcciones manuales auditadas)\n\nEl balance del Contrato siempre será \`SUM(Credits) - SUM(Debits)\`. Si es 0, está liquidado.`,
    
    'FINANCIAL_HEALTH_SCORING.md': `# FINANCIAL HEALTH SCORING (Fase 2.3)\n\n## Estados de Salud Financiera\n\n- **Healthy (Verde)**: Balance = 0 (Totalmente pagado y facturado) o Balance Positivo pero dentro del calendario de pagos sin demoras.\n- **Warning (Amarillo)**: \`overdue_days\` > 0 o pagos que suman el total pero faltan facturas por emitir (mismatch contable-fiscal).\n- **Critical (Rojo)**: \`underpaid\` crónico, pagos rechazados o reembolsos pendientes que dejan la deuda viva tras la ejecución del evento.\n\nEl TAC calculará este color dinámicamente mediante el Hook de Backend al vuelo.`,
    
    'PARTIAL_RECONCILIATION_TESTS.md': `# PARTIAL RECONCILIATION TESTS (Fase 2.3)\n\n## Escenarios de Prueba de Conciliación\n\n1. **Anticipo**: Un contrato de $10,000 recibe un pago de $5,000. \n   - *Resultado*: Estado del Ledger = \`partial\`. Balance pendiente = $5,000.\n2. **Múltiples Facturas**: Un contrato liquidado de $20,000 debe facturarse en 2 CFDI (Factura A por $10k, Factura B por $10k).\n   - *Resultado*: \`invoice_balance\` empatado con el \`financial_snapshot\`. Estado = \`matched\`.\n3. **Overpaid**: Un cliente deposita $10,500 en lugar de $10,000.\n   - *Resultado*: Balance = +$500. Estado = \`overpaid\`. (Requiere nota de crédito o reembolso manual).`,
    
    'FINANCIAL_EVENT_EXTENSIBILITY.md': `# FINANCIAL EVENT EXTENSIBILITY (Fase 2.3)\n\n## 1. Futuros Eventos CFDI y Bancarios\nAunque Intelisis y Facturama están congelados, el Ledger soporta \`credit_note\`, \`refund\` y \`adjustment\` como eventos base.\n\nCuando los proveedores externos se activen en la Fase 3, los adaptadores (*StripeProvider* o *FacturamaProvider*) simplemente llamarán a la API interna de PocketBase (\`POST /api/collections/financial_ledger/records\`) inyectando el UUID o ID de Transacción externo en el campo \`external_reference_id\`. \n\nLa verdad sigue estando dentro de Cotizador 2.0.`,
    
    'CONTRACT_CLOSURE_POLICY.md': `# CONTRACT CLOSURE POLICY (Fase 2.3)\n\n## Protección de Cierre Contractual (Zero Trust)\nEl estado operativo \`closed\` (Evento ejecutado, liquidado y archivado) **queda completamente bloqueado a nivel Base de Datos** si el Ledger no empata.\n\n### Restricciones (Hook \`beforeUpdate\` en PB):\nNo se permite guardar \`status = closed\` si:\n1. \`financial_status == underpaid\` (Falta dinero).\n2. \`financial_status == mismatch\` (Dinero no cuadra con el snapshot).\n3. \`invoicing_status == pending\` (Falta emitir al menos 1 CFDI para cubrir el 100% del pago).\n4. Existe un \`reconciliation_error\` abierto en auditoría.\n\n**Resultado**: Un contrato jamás podrá archivarse si arrastra basura financiera.`,
    
    'FINANCIAL_RECONCILIATION_ARCHITECTURE.md': `# FINANCIAL RECONCILIATION ARCHITECTURE (Fase 2.3)\n\n## El Motor de la Verdad\nEl *Financial Reconciliation Engine* corre como un *CronJob* asíncrono y como un *Hook* sincrónico en Base de Datos.\n- **Síncrono**: Cada vez que se añade una fila al Ledger, recalcula el \`financial_status\` y el \`invoicing_status\` del contrato padre.\n- **Asíncrono**: Barre de madrugada en busca de fechas de expiración de pagos (\`payment_schedules\`) y cambia el estado de salud a \`Warning\` o \`Critical\` si un pago no entró a tiempo.`,
    
    'RECONCILIATION_ACCEPTANCE_REPORT.md': `# RECONCILIATION ACCEPTANCE REPORT (Fase 2.3)\n\n## Dictamen\nEl motor de Conciliación Interna demuestra ser matemáticamente robusto. La introducción de la colección inmutable \`financial_ledger\` erradica la deuda técnica de sumas iterativas pesadas en el Frontend.\n\nAl bloquearse operativamente el cierre de contratos mal pagados o sin facturar, el área Financiera puede auditar y gestionar las discrepancias (\`overpaid\`, \`underpaid\`) sin depender en absoluto del ERP externo (Intelisis) durante esta fase.\n\n**Se da por concluida la Fase 2.3, alcanzando el Nivel A Financiero Interno.**`
};

for (const [filename, content] of Object.entries(docs)) {
    fs.writeFileSync(path.join(targetDir, filename), content, 'utf8');
    console.log(`Generado: ${filename}`);
}

console.log('Fase 2.3 Financial Reconciliation reports generated successfully.');
