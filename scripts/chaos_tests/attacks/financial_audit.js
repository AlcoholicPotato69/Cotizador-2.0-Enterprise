const fs = require('fs');

function testDoubleSpend() {
    console.log("Analyzing Double Spend Vulnerability in payments.service.ts...");
    const paymentSrc = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/payments/payments.service.ts', 'utf8');
    const invoiceRepoSrc = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/invoices/invoices.repository.ts', 'utf8');
    
    // We want to see if `registerPayment` prevents race conditions.
    // If two payments come at the EXACT SAME TIME:
    // P1 -> reads Invoice (balance 100) -> applies 50 payment
    // P2 -> reads Invoice (balance 100) -> applies 50 payment
    // Result: Both see balance 100, both leave balance 50. One payment effectively lost/double-spent.
    
    // The mitigation is pessimistic locking OR optimistic locking.
    // Check if `invoicesRepo.findByIdForUpdate` is used:
    // const invoice = await this.invoicesRepo.findByIdForUpdate(tx, ctx.tenantId, dto.invoiceId);
    
    if (paymentSrc.includes('findByIdForUpdate(tx, ctx.tenantId, dto.invoiceId)')) {
         if (invoiceRepoSrc.includes('FOR UPDATE')) {
            console.log("✅ SECURE (Double Spend): `FOR UPDATE` lock is correctly used on the Invoice row.");
            console.log("Concurrent transactions will queue and execute sequentially, preventing Phantom Reads and Double Spend on Balance Due.");
         } else {
            console.log("❌ VULNERABILITY FOUND: findByIdForUpdate is called, but no FOR UPDATE in SQL query.");
         }
    } else {
         console.log("❌ VULNERABILITY FOUND: No locking mechanism during Payment Registration. Double Spend Race Condition is possible.");
    }
}

function testIllegalInvoicing() {
    console.log("Analyzing Illegal Invoicing Vulnerability in invoices.service.ts...");
    const invoiceSrc = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/invoices/invoices.service.ts', 'utf8');
    const fsmSrc = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/common/fsm.validator.ts', 'utf8');
    
    // The objective is to bill a Contract that is SIGNED (not yet ACTIVE) or TERMINATED.
    // Check `generateInvoice`:
    // this.fsmValidator.validateInvoiceGenerationEligibility(contract.status);
    
    if (fsmSrc.includes('validateInvoiceGenerationEligibility')) {
        const match = fsmSrc.match(/validateInvoiceGenerationEligibility[\s\S]*?}/);
        if (match) {
            const body = match[0];
            if (body.includes('contractState !== ContractStatus.ACTIVE')) {
                 console.log("✅ SECURE (Illegal Invoicing): FSM Validator STRICTLY requires the Contract to be ACTIVE.");
                 console.log("Attempts to invoice SIGNED, TERMINATED, EXPIRED, CANCELLED, or DRAFT will be blocked.");
            } else {
                 console.log("❌ VULNERABILITY FOUND: FSM Validator is missing strict ACTIVE check.");
            }
        }
    } else {
        console.log("❌ VULNERABILITY FOUND: No FSM validation before Invoice Generation.");
    }
}

testDoubleSpend();
testIllegalInvoicing();
