const PocketBase = require('pocketbase/cjs');

async function runRenewalTest() {
    const pb = new PocketBase('http://127.0.0.1:8090');
    
    console.log("=== BLOQUE 1 & 2: RENEWAL ENGINE STRESS TEST ===");
    await pb.collection('_superusers').authWithPassword('admin@acme.com', 'Password123!');

    async function makeActive(contractId) {
        await pb.collection('contracts').update(contractId, { status: 'pending_signature' });
        await pb.collection('contracts').update(contractId, { status: 'signed' });
        return await pb.collection('contracts').update(contractId, { status: 'active' });
    }

    // Get a valid root contract with a version
    const versions = await pb.collection('contract_versions').getList(1, 1, { sort: '@rowid', filter: 'version_number = 1' });
    if(versions.items.length === 0) throw new Error("No versions found");
    const validContractId = versions.items[0].contract_id;
    let currentContract = await pb.collection('contracts').getOne(validContractId);
    
    // Ensure it's active
    if (currentContract.status !== 'active') {
        currentContract = await makeActive(currentContract.id);
    }

    console.log(`-> Starting chain from Root Contract: ${currentContract.id}`);

    // Test 1: exact_clone
    console.log("-> Renewal 1: exact_clone");
    let r1;
    try {
        r1 = await pb.send(`/api/contracts/${currentContract.id}/renew`, {
            method: 'POST',
            body: { renewal_type: 'exact_clone' }
        });
        currentContract = await makeActive(r1.new_contract_id);
    } catch (e) {
        console.error(e);
        throw new Error("Failed exact_clone");
    }

    // Test 2: administrative
    console.log("-> Renewal 2: administrative");
    let r2;
    try {
        r2 = await pb.send(`/api/contracts/${currentContract.id}/renew`, {
            method: 'POST',
            body: { 
                renewal_type: 'administrative', 
                client_updates: { contact_email: "new@email.com", contact_phone: "55555555" }
            }
        });
        currentContract = await makeActive(r2.new_contract_id);
    } catch(e) {
        console.error(e);
        throw new Error("Failed administrative clone");
    }

    // Test 3: administrative invalid (Should block changing RFC)
    console.log("-> Renewal: invalid administrative (should fail)");
    try {
        await pb.send(`/api/contracts/${currentContract.id}/renew`, {
            method: 'POST',
            body: { renewal_type: 'administrative', client_updates: { rfc: "NEW RFC" } }
        });
        throw new Error("Invalid administrative succeeded when it should fail.");
    } catch(err) {
        if(err.status !== 400 && err.status !== 404) throw err;
        console.log("   (Rejected as expected)");
    }

    // Test 4: legal_renewal (Should ALLOW changing razon_social)
    console.log("-> Renewal 3: legal_renewal");
    let r3;
    try {
        r3 = await pb.send(`/api/contracts/${currentContract.id}/renew`, {
            method: 'POST',
            body: { 
                renewal_type: 'legal_renewal', 
                client_updates: { razon_social: "NUEVA EMPRESA SA DE CV" }
            }
        });
        currentContract = await makeActive(r3.new_contract_id);
    } catch(e) {
        console.error(e);
        throw new Error("Failed legal_renewal clone");
    }

    console.log(`\n✅ Renewal Chain Validation Passed. End Contract ID: ${currentContract.id}`);
    console.log(`   Final Chain Depth: ${currentContract.renewal_chain_depth}`);
}

runRenewalTest().catch(console.error);
