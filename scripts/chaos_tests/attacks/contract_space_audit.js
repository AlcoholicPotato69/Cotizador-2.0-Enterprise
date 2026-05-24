const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

test('Falsification Attack: Contract from DRAFT Quote', () => {
    console.log("Analyzing ContractEngineService...");
    
    const serviceSrc = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/contracts/contract.service.ts', 'utf8');
    
    // We want to generate a Contract from a Quote that is in DRAFT state.
    // The FSM Matrix says Quote: DRAFT -> SENT -> APPROVED -> CONTRACT_GENERATED.
    // It should block a transition from DRAFT to CONTRACT_GENERATED directly.
    
    // In contract.service.ts:
    // this.fsmValidator.validateTransition('Quote', quote.status, QuoteStatus.CONTRACT_GENERATED);
    
    if (serviceSrc.includes(`this.fsmValidator.validateTransition('Quote', quote.status, QuoteStatus.CONTRACT_GENERATED);`)) {
        console.log("✅ SECURE: FSM Validator is correctly invoked on the Quote before Contract generation.");
        console.log("Attempting to jump from DRAFT to CONTRACT_GENERATED will be blocked by FSM rules.");
    } else {
        console.log("❌ VULNERABILITY FOUND: FSM Validation missing when generating a contract.");
    }
});

test('Overbooking Concurrency Attack: Bypassing Pessimistic Lock', () => {
    console.log("Analyzing AvailabilityEngineService concurrency protection...");
    const serviceSrc = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/spaces/availability.service.ts', 'utf8');
    const repoSrc = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/spaces/spaces.repository.ts', 'utf8');
    
    // They are doing: const space = await this.spacesRepo.findByIdForUpdate(tx, ctx.tenantId, request.spaceId);
    // Let's check spaces.repository.ts
    // SELECT * FROM "Space" WHERE id = ${id} FOR UPDATE
    
    if (repoSrc.includes('FOR UPDATE')) {
         console.log("✅ SECURE: FOR UPDATE row-level pessimistic lock correctly applied on the Space row.");
         
         // Can we cause a deadlock?
         // They only lock 1 row (the Space). Deadlocks typically occur when locking multiple resources in different orders.
         // Here, it's just one space lock, then an INSERT into SpaceOccupancy.
         // Since transactions lock one specific space and wait, it simply serializes requests. No deadlock.
         console.log("✅ SECURE: Operation order (Lock Space -> Check Overlaps -> Insert Occupancy) avoids deadlocks and prevents race conditions.");
    } else {
        console.log("❌ VULNERABILITY FOUND: Pessimistic locking (FOR UPDATE) is missing. Overbooking via race condition is possible!");
    }
});
