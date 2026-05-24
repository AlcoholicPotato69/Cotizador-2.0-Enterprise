const fs = require('fs');

function analyze() {
    console.log("Analyzing Signature Eligibility in fsm.validator.ts...");
    const src = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/common/fsm.validator.ts', 'utf8');

    // Extract validateSignatureEligibility function body
    const match = src.match(/validateSignatureEligibility\(currentState: string\) \{([\s\S]*?)\}/);
    if (match) {
        const body = match[1];
        console.log("Found logic:", body.trim());

        const missingBlocks = [];
        if (!body.includes('ACTIVE')) missingBlocks.push('ACTIVE');
        if (!body.includes('CANCELLED')) missingBlocks.push('CANCELLED');
        if (!body.includes('REJECTED')) missingBlocks.push('REJECTED');

        if (missingBlocks.length > 0) {
            console.log(`❌ VULNERABILITY FOUND: FSM Validator allows signatures on the following states: ${missingBlocks.join(', ')}`);
        } else {
            console.log("✅ SECURE: All terminal and post-sign states are correctly blocked.");
        }
    } else {
        console.log("Could not find function.");
    }
}

analyze();
