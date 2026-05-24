const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');
pb.autoCancellation(false);
const crypto = require('crypto');

async function createTenant() {
    const uuid = crypto.randomUUID();
    const tenant = await pb.collection('tenants').create({
        name: `Stress_Tenant_${uuid}`,
        slug: `stress-tenant-${uuid}`,
        status: 'active'
    });
    
    // Create a dummy user to satisfy created_by validations
    const user = await pb.collection('users').create({
        username: `stressuser_${uuid.substring(0,8)}`,
        email: `stress_${uuid.substring(0,8)}@example.com`,
        password: "Password123!",
        passwordConfirm: "Password123!",
        tenant_id: tenant.id
    });
    
    return { tenantId: tenant.id, userId: user.id };
}

async function runStressTest(count, levelName) {
    console.log(`\n========================================`);
    console.log(`🚀 STARTING STRESS TEST: ${levelName} (${count} Contracts)`);
    console.log(`========================================`);
    
    await pb.admins.authWithPassword('admin@acme.com', 'Password123!');
    const { tenantId, userId } = await createTenant();
    
    // 0. Pre-requisites (Client, Quote, QuoteVersion) - Created ONCE per test run
    const uuidSeed = crypto.randomUUID();
    const client = await pb.collection('clientes').create({
        tenant_id: tenantId,
        status: 'activo',
        nombre: `Stress Client ${uuidSeed}`,
        razon_social: `Stress Test SA de CV ${uuidSeed}`,
        status_validacion: 'pendiente',
        rfc: `STR${uuidSeed.substring(0,6).toUpperCase()}`,
        regimen_fiscal: '601',
        uso_cfdi: 'G03',
        codigo_postal: '12345',
        correo_facturacion: 'test@example.com'
    });
    
    const quote = await pb.collection('quotes').create({
        tenant_id: tenantId,
        client_id: client.id,
        status: 'draft',
        total: 1000,
        currency: 'USD'
    });
    
    // Trigger Native Snapshot Generation
    await pb.collection('quotes').update(quote.id, { status: 'submitted' });
    const approvedQuote = await pb.collection('quotes').update(quote.id, { status: 'approved' });
    
    // Fetch the internally generated quote version ID to pass to the contract
    const qvList = await pb.collection('quote_versions').getList(1, 1, { filter: `quote_id='${quote.id}'` });
    const originalQuoteVersionId = qvList.items[0].id;
    
    const startTime = Date.now();
    let maxTime = 0;
    const promises = [];
    
    for (let i = 0; i < count; i++) {
        promises.push((async () => {
            const contractStart = Date.now();
            
            // 1. Create Draft
            const draft = await pb.collection('contracts').create({
                tenant_id: tenantId,
                client_id: client.id,
                created_by: userId, // Pass the dummy User ID
                contract_type_id: "stress_type",
                source_quote_version_id: originalQuoteVersionId,
                status: "draft",
                terms_conditions: "Stress test terms...",
                metadata: { test: true },
                valid_from: new Date().toISOString(),
                valid_until: new Date(Date.now() + 86400000 * 30).toISOString()
            });
            
            // 2. Add Participants
            await pb.collection('signature_participants').create({
                contract_id: draft.id,
                tenant_id: tenantId,
                name: "Signer 1",
                email: "signer1@example.com",
                role: "Client",
                participant_name: "Signer 1",
                participant_email: "signer1@example.com",
                participant_role: "Client",
                status: "pending",
                sign_order: 1
            });
            await pb.collection('signature_participants').create({
                contract_id: draft.id,
                tenant_id: tenantId,
                name: "Signer 2",
                email: "signer2@example.com",
                role: "Internal",
                participant_name: "Signer 2",
                participant_email: "signer2@example.com",
                participant_role: "Internal",
                status: "pending",
                sign_order: 2
            });
            
            // 3. Request Signature (Triggers Multi-Signer Orchestration & DocuSign Provider)
            const pending = await pb.collection('contracts').update(draft.id, {
                status: "pending_signature"
            });
            
            // 4. Fire Webhook (Simulate DocuSign Completed)
            const providerReqId = pending.signature_request_id;
            await fetch(`http://127.0.0.1:8090/api/webhooks/signatures/docusign`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-Provider-Signature": "mock_hmac" },
                body: JSON.stringify({
                    event: "envelope-completed",
                    envelopeId: providerReqId,
                    status: "completed"
                })
            });
            
            // Wait briefly for webhook to process
            await new Promise(r => setTimeout(r, 50));
            
            const contractTime = Date.now() - contractStart;
            if (contractTime > maxTime) maxTime = contractTime;
        })());
    }
    
    await Promise.all(promises);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / count;
    
    console.log(`✅ [${levelName}] FINISHED in ${totalTime}ms`);
    console.log(`   - Total Contracts: ${count}`);
    console.log(`   - Avg Time/Contract: ${avgTime.toFixed(2)}ms`);
    console.log(`   - Max Time/Contract: ${maxTime}ms`);
    
    return { count, totalTime, avgTime, maxTime, tenantId };
}

async function main() {
    try {
        const results = [];
        // Level 1: 100 contracts
        results.push(await runStressTest(100, "Nivel 1"));
        
        // Level 2: 500 contracts
        results.push(await runStressTest(500, "Nivel 2"));
        
        // Level 3: 1000 contracts
        results.push(await runStressTest(1000, "Nivel 3"));
        
        console.log("\n========================================");
        console.log("🏆 PERFORMANCE & SCALE CERTIFICATION COMPLETE");
        console.log(results);
    } catch (e) {
        console.error("Stress Test Failed:", e);
    }
}

main();
