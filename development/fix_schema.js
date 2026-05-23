const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function fixCollections() {
    await pb.admins.authWithPassword('admin@acme.com', 'Password123!');
    const tenantRule = "@request.auth.id != ''";
    const quoteIdRule = "@request.auth.id != ''";

    const collectionsToDelete = ['quotes', 'quote_items', 'quote_versions', 'quote_status_history', 'audit_logs'];

    for (let cName of collectionsToDelete) {
        try {
            const existing = await pb.collections.getFirstListItem(`name="${cName}"`);
            await pb.collections.delete(existing.id);
            console.log(`Deleted ${cName}`);
        } catch(e) {}
    }

    // 1. quotes
    await pb.collections.create({
        name: 'quotes',
        type: 'base',
        fields: [
            { name: 'tenant_id', type: 'text', required: true },
            { name: 'client_id', type: 'text', required: true },
            { name: 'created_by', type: 'text', required: true },
            { name: 'folio', type: 'text', required: false },
            { name: 'status', type: 'select', required: false, values: ['draft', 'pending_approval', 'approved', 'rejected', 'expired', 'converted'], maxSelect: 1 },
            { name: 'subtotal', type: 'number', required: false },
            { name: 'tax_amount', type: 'number', required: false },
            { name: 'total_amount', type: 'number', required: false },
            { name: 'valid_until', type: 'date', required: false },
            { name: 'notes', type: 'text', required: false },
            { name: 'current_version', type: 'number', required: false }
        ],
        listRule: tenantRule,
        viewRule: tenantRule,
        createRule: tenantRule,
        updateRule: tenantRule,
        deleteRule: null
    });
    console.log("Created quotes");

    // 2. quote_items
    await pb.collections.create({
        name: 'quote_items',
        type: 'base',
        fields: [
            { name: 'quote_id', type: 'text', required: true },
            { name: 'description', type: 'text', required: true },
            { name: 'quantity', type: 'number', required: true },
            { name: 'unit_price', type: 'number', required: true },
            { name: 'total_price', type: 'number', required: true },
            { name: 'type', type: 'select', required: true, values: ['space', 'service', 'product', 'discount'], maxSelect: 1 }
        ],
        listRule: quoteIdRule,
        viewRule: quoteIdRule,
        createRule: quoteIdRule,
        updateRule: quoteIdRule,
        deleteRule: quoteIdRule
    });
    console.log("Created quote_items");

    // 3. quote_versions
    await pb.collections.create({
        name: 'quote_versions',
        type: 'base',
        fields: [
            { name: 'quote_id', type: 'text', required: true },
            { name: 'version_number', type: 'number', required: true },
            { name: 'snapshot_data', type: 'json', required: true },
            { name: 'snapshot_hash', type: 'text', required: true },
            { name: 'created_by', type: 'text', required: true },
            { name: 'change_notes', type: 'text', required: false }
        ],
        listRule: quoteIdRule,
        viewRule: quoteIdRule,
        createRule: null,
        updateRule: null, 
        deleteRule: null
    });
    console.log("Created quote_versions");

    // 4. quote_status_history
    await pb.collections.create({
        name: 'quote_status_history',
        type: 'base',
        fields: [
            { name: 'quote_id', type: 'text', required: true },
            { name: 'old_status', type: 'text', required: false },
            { name: 'new_status', type: 'text', required: true },
            { name: 'changed_by', type: 'text', required: true },
            { name: 'reason', type: 'text', required: false }
        ],
        listRule: quoteIdRule,
        viewRule: quoteIdRule,
        createRule: null,
        updateRule: null,
        deleteRule: null
    });
    console.log("Created quote_status_history");

    // 5. audit_logs
    await pb.collections.create({
        name: 'audit_logs',
        type: 'base',
        fields: [
            { name: 'event_type', type: 'text', required: true },
            { name: 'entity_type', type: 'text', required: true },
            { name: 'entity_id', type: 'text', required: true },
            { name: 'version_number', type: 'number', required: false },
            { name: 'actor_id', type: 'text', required: true },
            { name: 'tenant_id', type: 'text', required: true },
            { name: 'ip_address', type: 'text', required: false },
            { name: 'user_agent', type: 'text', required: false },
            { name: 'snapshot_hash', type: 'text', required: false },
            { name: 'payload', type: 'json', required: false }
        ],
        listRule: null, // Admin only
        viewRule: null,
        createRule: null, // Internal only
        updateRule: null,
        deleteRule: null
    });
    console.log("Created audit_logs");
}

fixCollections().catch(console.error);
