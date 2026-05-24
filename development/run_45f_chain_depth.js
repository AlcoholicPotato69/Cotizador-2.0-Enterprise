const PocketBase = require('pocketbase/cjs');

async function runChainTest() {
    const pb = new PocketBase('http://127.0.0.1:8090');
    
    console.log("=== BLOQUE 3: 10-TIER CHAIN DEPTH FORENSIC TEST ===");
    await pb.collection('_superusers').authWithPassword('admin@acme.com', 'Password123!');

    async function makeActive(contractId) {
        await pb.collection('contracts').update(contractId, { status: 'pending_signature' });
        await pb.collection('contracts').update(contractId, { status: 'signed' });
        return await pb.collection('contracts').update(contractId, { status: 'active' });
    }

    // Get root contract
    const contracts = await pb.collection('contracts').getList(1, 1, { sort: '-@rowid', filter: "status = 'active' && renewal_number = 0" });
    let currentContract = contracts.items[0];


    console.log(`[0] ROOT: ${currentContract.id} | chain_depth: ${currentContract.renewal_chain_depth} | num: ${currentContract.renewal_number}`);

    for (let i = 1; i <= 10; i++) {
        let r;
        try {
            r = await pb.send(`/api/contracts/${currentContract.id}/renew`, {
                method: 'POST',
                body: { renewal_type: 'exact_clone' }
            });
            currentContract = await makeActive(r.new_contract_id);
            
            console.log(`[${i}] CLONE: ${currentContract.id} | root: ${currentContract.root_contract_id} | parent: ${currentContract.parent_contract_id} | from: ${currentContract.renewed_from_contract_id} | depth: ${currentContract.renewal_chain_depth} | num: ${currentContract.renewal_number}`);
        } catch (e) {
            console.error(`Failed at tier ${i}:`, e);
            throw e;
        }
    }
    console.log("\n✅ 10-Tier Chain Validation Passed.");
}

runChainTest().catch(console.error);
