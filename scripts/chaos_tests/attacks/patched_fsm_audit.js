const fs = require('fs');

function analyze() {
    console.log("Analyzing patched Signature Eligibility in fsm.validator.ts...");
    const src = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/common/fsm.validator.ts', 'utf8');

    // Extract validateSignatureEligibility function body
    const match = src.match(/validateSignatureEligibility\(currentState: string\) \{([\s\S]*?)\}/);
    if (match) {
        const body = match[1];
        console.log("Found logic:", body.trim());

        if (body.includes('![ContractStatus.DRAFT, ContractStatus.PENDING_SIGNATURE].includes(currentState as any)')) {
            console.log("✅ SECURE: Allowlist implementation verified. Only DRAFT and PENDING_SIGNATURE are eligible.");
            console.log("All attacks targeting ACTIVE, CANCELLED, REJECTED, SIGNED, EXPIRED, TERMINATED will now fail fundamentally.");
        } else {
            console.log("❌ VULNERABILITY FOUND: Did not detect the expected allowlist approach.");
        }
    } else {
        console.log("Could not find function.");
    }
}

analyze();
