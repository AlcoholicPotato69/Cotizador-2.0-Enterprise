const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function createCollections() {
    await pb.collection('_superusers').authWithPassword('admin@acme.com', 'Password123!');
    const tenantRule = "@request.auth.id != ''";
    const quoteIdRule = "@request.auth.id != ''";

    const tenantsCol = await pb.collections.getFirstListItem(`name="tenants"`);
    const clientsCol = await pb.collections.getFirstListItem(`name="clientes"`);
    const usersCol = await pb.collections.getFirstListItem(`name="users"`);

    const tenantsId = tenantsCol.id;
    const clientsId = clientsCol.id;
    const usersId = usersCol.id;

    // 1. quotes
    const quotesCollection = {
        name: 'quotes',
        type: 'base',
        fields: [
            { name: 'tenant_id', type: 'text', required: true },
            { name: 'client_id', type: 'text', required: true },
            { name: 'created_by', type: 'text', required: true },
            { name: 'folio', type: 'text', required: true },
            { name: 'status', type: 'select', required: true, options: { values: ['draft', 'pending_approval', 'approved', 'rejected', 'expired', 'converted'], maxSelect: 1 } },
            { name: 'subtotal', type: 'number', required: false },
            { name: 'tax_amount', type: 'number', required: false },
            { name: 'total_amount', type: 'number', required: false },
            { name: 'valid_until', type: 'date', required: false },
            { name: 'notes', type: 'text', required: false },
            { name: 'current_version', type: 'number', required: true }
        ],
        listRule: tenantRule,
        viewRule: tenantRule,
        createRule: tenantRule,
        updateRule: tenantRule,
        deleteRule: null
    };

    let quotesId;
    try {
        const existing = await pb.collections.getFirstListItem(`name="quotes"`);
        await pb.collections.update(existing.id, quotesCollection);
        quotesId = existing.id;
        console.log("Updated quotes");
    } catch(e) {
        if (e.status === 404) {
            const created = await pb.collections.create(quotesCollection);
            quotesId = created.id;
            console.log("Created quotes");
        } else { 
            console.error(JSON.stringify(e.response.data, null, 2));
            throw e; 
        }
    }

    // 2. quote_items
    const quoteItemsCollection = {
        name: 'quote_items',
        type: 'base',
        fields: [
            { name: 'quote_id', type: 'text', required: true },
            { name: 'description', type: 'text', required: true },
            { name: 'quantity', type: 'number', required: true },
            { name: 'unit_price', type: 'number', required: true },
            { name: 'total_price', type: 'number', required: true },
            { name: 'type', type: 'select', required: true, options: { values: ['space', 'service', 'product', 'discount'], maxSelect: 1 } }
        ],
        listRule: quoteIdRule,
        viewRule: quoteIdRule,
        createRule: quoteIdRule,
        updateRule: quoteIdRule,
        deleteRule: quoteIdRule
    };

    // 3. quote_versions
    const quoteVersionsCollection = {
        name: 'quote_versions',
        type: 'base',
        fields: [
            { name: 'quote_id', type: 'text', required: true },
            { name: 'version_number', type: 'number', required: true },
            { name: 'snapshot_data', type: 'json', required: true },
            { name: 'created_by', type: 'text', required: true },
            { name: 'change_notes', type: 'text', required: false }
        ],
        listRule: quoteIdRule,
        viewRule: quoteIdRule,
        createRule: null,
        updateRule: null, 
        deleteRule: null
    };

    // 4. quote_status_history
    const quoteStatusHistoryCollection = {
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
    };

    const remainingCols = [quoteItemsCollection, quoteVersionsCollection, quoteStatusHistoryCollection];
    for (let col of remainingCols) {
        try {
            const existing = await pb.collections.getFirstListItem(`name="${col.name}"`);
            await pb.collections.update(existing.id, col);
            console.log("Updated", col.name);
        } catch (e) {
            if (e.status === 404) {
                await pb.collections.create(col);
                console.log("Created", col.name);
            } else {
                console.error(`Error with ${col.name}:`, e.response);
            }
        }
    }
    console.log("Schema fully applied!");
}

createCollections().catch(console.error);
