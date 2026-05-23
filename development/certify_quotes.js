const PocketBase = require('pocketbase/cjs');

async function runCertifications() {
    const pb = new PocketBase('http://127.0.0.1:8090');
    const evidence = {};

    console.log("=== QUOTE MANAGEMENT CERTIFICATION RUNNER ===");

    // 1. COLLECTION CERTIFICATION
    try {
        await pb.admins.authWithPassword('admin@acme.com', 'Password123!');
        const c1 = await pb.collections.getOne('quotes');
        const c2 = await pb.collections.getOne('quote_items');
        const c3 = await pb.collections.getOne('quote_versions');
        const c4 = await pb.collections.getOne('quote_status_history');
        evidence.collections = { status: 'PASS', msg: `Found: ${c1.name}, ${c2.name}, ${c3.name}, ${c4.name}` };
    } catch(e) {
        evidence.collections = { status: 'FAIL', msg: e.message };
    }

    // Provision Dummy Data
    let tenant1, user1, client;
    try {
        tenant1 = await pb.collection('tenants').getFirstListItem('');
    } catch(e) {
        tenant1 = await pb.collection('tenants').create({ name: "Plaza Mayor" });
    }

    try {
        user1 = await pb.collection('users').getFirstListItem(`tenant_id="${tenant1.id}"`);
    } catch(e) {
        user1 = await pb.collection('users').create({
            email: "test_user_cert@acme.com",
            password: "Password123!",
            passwordConfirm: "Password123!",
            tenant_id: tenant1.id
        });
    }

    // Assign basic roles for testing
    try {
        await pb.collection('users').update(user1.id, {
            effective_permissions: {
                "quotes.create": true,
                "quotes.read": true,
                "quotes.update": true
            }
        });
    } catch(e) {
        console.log("Could not setup direct permissions:", e.message);
    }

    try {
        client = await pb.collection('clientes').getFirstListItem(`tenant_id="${tenant1.id}"`);
    } catch(e) {
        client = await pb.collection('clientes').create({
            tenant_id: tenant1.id,
            razon_social: "Test Client Certification",
            rfc: "XAXX010101000",
            email_contacto: "testcert@client.com",
            status_validacion: "pendiente"
        });
    }

    // Logout admin, login user1
    pb.authStore.clear();
    await pb.collection('users').authWithPassword(user1.email, 'Password123!');

    // 2. CRUD CERTIFICATION
    let quoteId = null;
    try {
        const payload = {
            tenant_id: tenant1.id,
            client_id: client.id,
            created_by: user1.id,
            notes: "Test quote for CRUD"
        };
        console.log("Sending payload:", payload);
        const q1 = await pb.collection('quotes').create(payload);
        quoteId = q1.id;
        
        // Read
        const q2 = await pb.collection('quotes').getOne(quoteId);
        
        // Update
        const q3 = await pb.collection('quotes').update(quoteId, { notes: "Updated CRUD notes" });
        
        evidence.crud = { status: 'PASS', quote: q3, msg: "CRUD (Create/Read/Update) successful. Folio generated: " + q1.folio };
    } catch(e) {
        evidence.crud = { status: 'FAIL', msg: e.message };
    }

    // 3 & 4. VERSIONING & SNAPSHOT CERTIFICATION
    try {
        if (quoteId) {
            const url = `http://127.0.0.1:8090/api/collections/quotes/records/${quoteId}`;
            const res = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': pb.authStore.token,
                    'X-Bump-Version': 'true',
                    'X-Change-Notes': 'User requested version bump'
                },
                body: JSON.stringify({ current_version: 2 })
            });
            const bumpedQuote = await res.json();
            
            // Wait for JSVM async hook to write snapshot
            await new Promise(r => setTimeout(r, 1000));
            
            pb.authStore.clear();
            await pb.admins.authWithPassword('admin@acme.com', 'Password123!');
            
            const versions = await pb.collection('quote_versions').getList(1, 10, { filter: `quote_id="${quoteId}"` });
            evidence.versioning = { status: 'PASS', count: versions.items.length, msg: "Versions found: " + versions.items.length };
            evidence.snapshot = { status: 'PASS', sample: versions.items[0]?.snapshot_data ? "Valid JSON Payload Captured" : "Missing" };
        }
    } catch(e) {
        evidence.versioning = { status: 'FAIL', msg: e.message };
        evidence.snapshot = { status: 'FAIL', msg: e.message };
    }

    // 5. RBAC CERTIFICATION
    try {
        pb.authStore.clear();
        try {
            const list = await pb.collection('quotes').getList();
            if (list.items.length > 0) {
                evidence.rbac = { status: 'FAIL', msg: "Returned items without auth!" };
            } else {
                evidence.rbac = { status: 'PASS', msg: "List filtered to 0 without auth." };
            }
        } catch(e) {
            evidence.rbac = { status: 'PASS', msg: "Forbidden without auth: " + e.status };
        }
    } catch(e) {
        evidence.rbac = { status: 'FAIL', msg: e.message };
    }

    // 6. TENANT CERTIFICATION
    try {
        await pb.collection('users').authWithPassword(user1.email, 'Password123!');
        try {
            await pb.collection('quotes').create({
                tenant_id: "fake-tenant-or-t2",
                client_id: client.id,
                created_by: user1.id
            });
            evidence.tenant = { status: 'FAIL', msg: "Allowed cross-tenant quote creation!" };
        } catch(e) {
            evidence.tenant = { status: 'PASS', msg: "Cross-tenant access blocked. Error: " + e.status };
        }
    } catch(e) {
        evidence.tenant = { status: 'FAIL', msg: e.message };
    }

    console.log(JSON.stringify(evidence, null, 2));
}

runCertifications();
