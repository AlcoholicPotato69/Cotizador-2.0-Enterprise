const fs = require('fs');

function testV1PaymentEngine() {
    console.log("Analyzing Payment Engine V1...");
    const src = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/payments/payments.service.ts', 'utf8');

    // 1. Doble Aprobación (Race Condition)
    // El motor usa pessimistic lock en Invoices:
    // const invoice = await this.invoicesRepo.findByIdForUpdate(tx, ctx.tenantId, payment.invoiceId);
    // Pero ¿hace lock en Payments?
    // const payment = await this.paymentsRepo.findById(tx, ctx.tenantId, paymentId);
    
    // Si dos usuarios llaman `approvePayment(P1)` en paralelo:
    // TX1: lee P1 (UNDER_REVIEW), bloquea Invoice, verifica, aprueba P1.
    // TX2: lee P1 (UNDER_REVIEW), espera bloqueo en Invoice.
    // TX1: Termina, P1 = APPROVED, Invoice descontado.
    // TX2: Despierta, vuelve a verificar Invoice, ¿P1 sigue en UNDER_REVIEW?
    // TX2 leyó P1 antes del bloqueo! P1 sigue pareciendo UNDER_REVIEW en memoria.
    // TX2 vuelve a descontar el saldo usando P1.
    
    if (src.includes('const payment = await this.paymentsRepo.findById(') && !src.includes('const payment = await this.paymentsRepo.findByIdForUpdate(')) {
        console.log("❌ VULNERABILITY FOUND (Double Approval): No Pessimistic Lock on `Payment` entity during approval.");
        console.log("A Race Condition can approve the same payment twice! TX2 reads Payment in memory before TX1 finishes modifying it.");
    } else {
        console.log("✅ SECURE (Double Approval): Pessimistic Lock correctly used on Payment entity.");
    }

    // 2. Sobrepago
    if (src.includes('payment.paymentAmount.gt(invoice.balanceDue)')) {
        console.log("✅ SECURE (Overpayment): Code correctly handles overpayment and auto-rejects.");
    } else {
        console.log("❌ VULNERABILITY FOUND (Overpayment): Missing validation.");
    }
}

testV1PaymentEngine();
