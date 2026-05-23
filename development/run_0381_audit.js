const PocketBase = require('pocketbase/cjs');
const fs = require('fs');

const pb = new PocketBase('http://127.0.0.1:8090');

async function runAudit() {
    console.log("=== STARTING POCKETBASE 0.38.1 AUDIT ===");
    
    // 1. SNAPSHOT SCHEMA
    console.log("\n[1] Fetching quote_versions schema...");
    await pb.collection('_superusers').authWithPassword('admin@acme.com', 'Password123!');
    const schema = await pb.collection('quote_versions').getList(1, 1);
    console.log(JSON.stringify(schema, null, 2));
    
    // 2. FINANCIAL INTEGRITY CASES
    console.log("\n[2] Testing Financial Integrity...");
    await pb.collection('users').authWithPassword('hardening_tester@acme.com', 'Password123!');
    const testCases = [
        { items: [{price: 100, type: 'service'}, {price: 200, type: 'service'}, {price: -50, type: 'discount'}] },
        { items: [{price: 100.55, type: 'service'}, {price: -10.22, type: 'discount'}] }
    ];
    
    const quotesGenerated = [];
    
    for(let i=0; i<testCases.length; i++) {
        const tc = testCases[i];
        console.log(`Testing Case ${i+1}:`, JSON.stringify(tc));
        
        // Create Quote
        const quote = await pb.collection('quotes').create({
            tenant_id: '4yzxanlh8vqssrf',
            client_id: '2tkldys24j6cr35',
            folio: `FIN-TEST-${Date.now()}-${i}`,
            status: 'draft',
            current_version: 1,
            subtotal: 0,
            tax_amount: 0,
            total_amount: 0
        });
        quotesGenerated.push(quote.id);
        
        // Add items
        for(const item of tc.items) {
            await pb.collection('quote_items').create({
                quote_id: quote.id,
                description: 'Item',
                quantity: 1,
                unit_price: item.price,
                total_price: item.price,
                type: item.type
            });
        }
        
        // Bump
        await pb.collection('quotes').update(quote.id, { current_version: 2 });
        
        // Wait for AfterUpdate hook to complete
        await new Promise(r => setTimeout(r, 200));
        
        // Fetch snapshot
        const versions = await pb.collection('quote_versions').getList(1, 1, { filter: `quote_id="${quote.id}" && version_number=2` });
        if(versions.items.length > 0) {
            console.log(`Financial Snapshot Case ${i+1}:`, JSON.stringify(versions.items[0].snapshot_data.financial_snapshot));
        } else {
            console.log(`Failed to generate snapshot for Case ${i+1}`);
        }
        
        await pb.collection('quotes').delete(quote.id).catch(e => {});
    }
    
    // 3. IMMUTABILITY
    console.log("\n[3] Testing Immutability...");
    try {
        await pb.collection('quote_versions').create({
            quote_id: 'dummy',
            version_number: 99,
            snapshot_hash: 'fake'
        });
        console.log("Immutability Failed: Creation allowed!");
    } catch(e) {
        console.log("Creation blocked successfully:", e.status);
    }
    
    // 4. CONTRACT READINESS
    console.log("\n[4] Checking Contract Readiness...");
    
    // We fetch the snapshot from the very last generated quote in testCases
    const lastQuoteId = quotesGenerated[quotesGenerated.length - 1];
    
    const lastVersions = await pb.collection('quote_versions').getList(1, 1, { filter: `quote_id="${lastQuoteId}" && version_number=2` });
    if(lastVersions.items.length > 0) {
        const v = lastVersions.items[0];
        const sd = v.snapshot_data || {};
        console.log("Client Data Present:", !!sd.client_data);
        console.log("Tenant Data Present:", !!sd.tenant_data);
        console.log("Financial Snapshot Present:", !!sd.financial_snapshot);
        
        console.log("\n--- Client Data Extract ---");
        console.log(JSON.stringify(sd.client_data, null, 2));
        
        console.log("\n--- Tenant Data Extract ---");
        console.log(JSON.stringify(sd.tenant_data, null, 2));
    }
    
    console.log("\n=== AUDIT COMPLETE ===");
}

runAudit().catch(console.error);
