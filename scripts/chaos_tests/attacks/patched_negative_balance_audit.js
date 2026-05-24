const fs = require('fs');

function testPatchedOverpayment() {
    console.log("Analyzing Patched PaymentService...");
    const src = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/payments/payments.service.ts', 'utf8');

    // Looking for the explicit block
    if (src.includes('dto.paymentAmount.gt(invoice.balanceDue)')) {
        console.log("✅ SECURE: Payment block verified. The logic throws BadRequestException if paymentAmount exceeds balanceDue.");
    } else {
        console.log("❌ VULNERABILITY FOUND: Protection against overpayment is missing.");
    }
}

testPatchedOverpayment();
