const fs = require('fs');

function investigate() {
    console.log("Investigating state machine for Invoices and Payments...");
    const src = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/payments/payments.service.ts', 'utf8');

    // What if we send a payment amount that is HIGHER than the balance?
    // const newAmountPaid = invoice.amountPaid.add(dto.paymentAmount);
    // const newBalanceDue = invoice.totalAmount.sub(newAmountPaid);
    
    // Does it check if newBalanceDue < 0?
    if (!src.includes('newBalanceDue.lt(0)') && !src.includes('newAmountPaid.gt(invoice.totalAmount)')) {
        console.log("❌ VULNERABILITY FOUND: Overpayment / Negative Balance is allowed.");
        console.log("An attacker or clumsy user can send a payment larger than the invoice total, resulting in a negative `balanceDue`.");
        console.log("The FSM logic `if (newBalanceDue.lte(0)) { newStatus = InvoiceStatus.PAID; }` will mark it paid, but the balance will be mathematically corrupted (negative).");
    } else {
        console.log("✅ SECURE: System prevents overpayments.");
    }
}

investigate();
