const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function createCollections() {
    await pb.collection('_superusers').authWithPassword('admin@acme.com', 'Password123!');

    const tenantsCol = await pb.collections.getOne('tenants');
    const clientesCol = await pb.collections.getOne('clientes');
    const quotesCol = await pb.collections.getOne('quotes');
    const quoteVersionsCol = await pb.collections.getOne('quote_versions');
    const usersCol = await pb.collections.getOne('users');
    
    // 1. Create contracts
    let contractsCol;
    try {
        console.log("Creating 'contracts' collection...");
        contractsCol = await pb.collections.create({
            name: "contracts",
            type: "base",
            listRule: "@request.auth.id != ''",
            viewRule: "@request.auth.id != ''",
            createRule: null, // Only via hooks
            updateRule: null, // Only via hooks
            deleteRule: null, // Immutable
            fields: [
                { name: "tenant_id", type: "relation", collectionId: tenantsCol.id, maxSelect: 1, required: true },
                { name: "client_id", type: "relation", collectionId: clientesCol.id, maxSelect: 1, required: true },
                { name: "quote_id", type: "relation", collectionId: quotesCol.id, maxSelect: 1, required: true },
                { name: "source_quote_version_id", type: "relation", collectionId: quoteVersionsCol.id, maxSelect: 1, required: true },
                { name: "source_snapshot_hash", type: "text", required: true },
                { name: "folio", type: "text", required: true },
                { name: "status", type: "select", maxSelect: 1, values: ["draft", "active", "suspended", "terminated", "expired"], required: true },
                { name: "signature_status", type: "select", maxSelect: 1, values: ["pending", "signed", "rejected", "expired"], required: true },
                { name: "signed_at", type: "date", required: false },
                { name: "signed_by", type: "relation", collectionId: usersCol.id, maxSelect: 1, required: false },
                { name: "valid_from", type: "date", required: false },
                { name: "valid_until", type: "date", required: false },
                { name: "created_by", type: "relation", collectionId: usersCol.id, maxSelect: 1, required: true },
                { name: "current_version", type: "number", required: true }
            ]
        });
        console.log("'contracts' created.");
    } catch (e) {
        console.error("Error creating contracts:", JSON.stringify(e.response?.data || e.message, null, 2));
    }

    // 2. Create contract_versions
    try {
        console.log("Creating 'contract_versions' collection...");
        await pb.collections.create({
            name: "contract_versions",
            type: "base",
            listRule: "@request.auth.id != ''",
            viewRule: "@request.auth.id != ''",
            createRule: null,
            updateRule: null,
            deleteRule: null,
            fields: [
                { name: "contract_id", type: "relation", collectionId: contractsCol ? contractsCol.id : (await pb.collections.getOne('contracts')).id, maxSelect: 1, required: true },
                { name: "version_number", type: "number", required: true },
                { name: "snapshot_data", type: "json", required: true },
                { name: "snapshot_hash", type: "text", required: true },
                { name: "source_quote_hash", type: "text", required: true },
                { name: "contract_pdf_hash", type: "text", required: false },
                { name: "created_by", type: "relation", collectionId: usersCol.id, maxSelect: 1, required: true }
            ]
        });
        console.log("'contract_versions' created.");
    } catch (e) {
        console.error("Error creating contract_versions:", JSON.stringify(e.response?.data || e.message, null, 2));
    }

    // 3. Create contract_status_history
    try {
        console.log("Creating 'contract_status_history' collection...");
        await pb.collections.create({
            name: "contract_status_history",
            type: "base",
            listRule: "@request.auth.id != ''",
            viewRule: "@request.auth.id != ''",
            createRule: null,
            updateRule: null,
            deleteRule: null,
            fields: [
                { name: "contract_id", type: "relation", collectionId: contractsCol ? contractsCol.id : (await pb.collections.getOne('contracts')).id, maxSelect: 1, required: true },
                { name: "old_status", type: "text", required: true },
                { name: "new_status", type: "text", required: true },
                { name: "reason", type: "text", required: false },
                { name: "changed_by", type: "relation", collectionId: usersCol.id, maxSelect: 1, required: true }
            ]
        });
        console.log("'contract_status_history' created.");
    } catch (e) {
        console.error("Error creating contract_status_history:", JSON.stringify(e.response?.data || e.message, null, 2));
    }
}

createCollections();
