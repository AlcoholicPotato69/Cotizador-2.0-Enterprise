const { test } = require('node:test');
const assert = require('node:assert');
const { SnapshotsService } = require('../../../backend/dist/src/snapshots/snapshots.service.js');
const { SnapshotsRepository } = require('../../../backend/dist/src/snapshots/snapshots.repository.js');
const { DomainEventPublisher } = require('../../../backend/dist/src/common/events/domain-event-publisher.js');

// Mock for Context
const { tenantContext } = require('../../../backend/dist/src/prisma/tenant-context.js');

test('Snapshot Immutability Override Attack', async () => {
    // We are trying to find out if there's any mechanism to OVERRIDE an existing snapshot hash or history
    // Notice that snapshots.service.ts ONLY has `createSnapshot`. It lacks an `updateSnapshot` completely.
    // However, it does not check if the hash chain is maintained. 
    // Wait, the documentation (DATA_MODEL.md) mentions:
    // "- Hash Chain mandatory: `current_hash`, `previous_hash`, `chain_hash`."
    
    console.log("Auditing Snapshot Engine...");
    
    const serviceSrc = require('fs').readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/snapshots/snapshots.service.ts', 'utf8');
    
    if(!serviceSrc.includes('previous_hash') && !serviceSrc.includes('chain_hash')) {
        console.log("❌ VULNERABILITY FOUND: Snapshot Engine does NOT implement Hash Chain (`previous_hash`, `chain_hash`) as mandated by DATA_MODEL.md. It only hashes the payload.");
    } else {
         console.log("✅ Snapshot Engine seems to implement hash chaining.");
    }
});
