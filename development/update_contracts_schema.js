const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function updateSchema() {
    await pb.collection('_superusers').authWithPassword('admin@acme.com', 'Password123!'); // PocketBase 0.38 _superusers
    
    let contractsCol;
    try {
        contractsCol = await pb.collections.getOne('contracts');
        console.log("Found 'contracts' collection.");
        
        const fields = contractsCol.fields;
        
        // Add parent_contract_id if missing
        if (!fields.find(f => f.name === "parent_contract_id")) {
            fields.push({
                name: "parent_contract_id",
                type: "relation",
                collectionId: contractsCol.id,
                maxSelect: 1,
                required: false
            });
            console.log("Added parent_contract_id.");
        }

        // Add renewal_number if missing
        if (!fields.find(f => f.name === "renewal_number")) {
            fields.push({
                name: "renewal_number",
                type: "number",
                required: false, // Default is 0 but handled by logic
            });
            console.log("Added renewal_number.");
        }
        
        // Update status field values
        const statusField = fields.find(f => f.name === "status");
        if (statusField) {
            statusField.values = ["draft", "pending_signature", "signed", "active", "suspended", "terminated", "expired", "archived"];
            console.log("Updated status values:", statusField.values);
        }
        
        // Update signature_status field values (just in case we need pending_signature here too? User says signature_status: pending, signed, rejected, expired)
        // Leaving it as is based on phase 4.5
        
        // Apply update
        contractsCol.fields = fields;
        await pb.collections.update(contractsCol.id, contractsCol);
        console.log("Successfully updated 'contracts' collection schema!");
        
    } catch (err) {
        console.error("Failed to update schema:", err.response?.data || err.message);
    }
}

updateSchema();
