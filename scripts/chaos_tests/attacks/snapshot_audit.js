const fs = require('fs');

function testSnapshotChain() {
    console.log("Auditing Snapshot Engine...");
    
    const serviceSrc = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/snapshots/snapshots.service.ts', 'utf8');
    
    if(!serviceSrc.includes('previous_hash') && !serviceSrc.includes('chain_hash')) {
        console.log("❌ VULNERABILITY FOUND: Snapshot Engine does NOT implement Hash Chain (`previous_hash`, `chain_hash`) as mandated by DATA_MODEL.md. It only hashes the payload.");
        return true; // Vuln found
    } else {
         console.log("✅ Snapshot Engine seems to implement hash chaining.");
         return false;
    }
}

testSnapshotChain();
