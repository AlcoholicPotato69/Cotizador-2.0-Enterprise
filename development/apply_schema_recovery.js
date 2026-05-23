const fs = require('fs');
const http = require('http');

const PB_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'admin@acme.com';
const ADMIN_PASS = 'Password123!';

async function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(PB_URL + path);
        const options = {
            method,
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (token) {
            options.headers['Authorization'] = 'Bearer ' + token;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data || '{}');
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, data });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function main() {
    console.log("Authenticating...");
    const authRes = await request('POST', '/api/collections/_superusers/auth-with-password', {
        identity: ADMIN_EMAIL,
        password: ADMIN_PASS
    });
    
    if (authRes.status !== 200) {
        console.error("Auth failed:", authRes.data);
        return;
    }
    const token = authRes.data.token;

    // Get collection IDs
    const colsRes = await request('GET', '/api/collections?perPage=100', null, token);
    const colMap = {};
    colsRes.data.items.forEach(c => colMap[c.name] = c.id);

    const getColId = (name) => colMap[name] || name;

    const collections = [
        {
            name: "permissions",
            type: "base",
            fields: [
                { name: "name", type: "text", required: true, max: 100 },
                { name: "domain", type: "text", required: true, max: 100 },
                { name: "description", type: "text", max: 500 }
            ],
            listRule: "@request.auth.id != ''",
            viewRule: "@request.auth.id != ''"
        },
        {
            name: "documents",
            type: "base",
            fields: [
                { name: "tenant_id", type: "relation", required: true, maxSelect: 1, collectionId: getColId("tenants"), cascadeDelete: false },
                { name: "client_id", type: "relation", required: true, maxSelect: 1, collectionId: getColId("clientes"), cascadeDelete: false },
                { name: "file", type: "file", required: true, maxSelect: 1, maxSize: 52428800, mimeTypes: ["application/pdf", "image/jpeg", "image/png", "text/xml"] },
                { name: "provider", type: "text", required: true, max: 50 },
                { name: "hash", type: "text", required: true, max: 64 },
                { name: "legal_hold", type: "bool", required: false },
                { name: "status", type: "text", required: true, max: 50 }
            ],
            listRule: "@request.auth.id != '' && @request.auth.tenant_id = tenant_id",
            viewRule: "@request.auth.id != '' && @request.auth.tenant_id = tenant_id"
        },
        {
            name: "audit_logs",
            type: "base",
            fields: [
                { name: "actor", type: "relation", required: true, maxSelect: 1, collectionId: getColId("users"), cascadeDelete: false },
                { name: "action", type: "text", required: true, max: 100 },
                { name: "payload", type: "json", required: false },
                { name: "ip_address", type: "text", required: false, max: 45 }
            ],
            listRule: null, 
            viewRule: null
        },
        {
            name: "notifications",
            type: "base",
            fields: [
                { name: "user_id", type: "relation", required: true, maxSelect: 1, collectionId: getColId("users"), cascadeDelete: true },
                { name: "type", type: "text", required: true, max: 50 },
                { name: "message", type: "text", required: true, max: 500 },
                { name: "read", type: "bool", required: false }
            ],
            listRule: "@request.auth.id != '' && @request.auth.id = user_id",
            viewRule: "@request.auth.id != '' && @request.auth.id = user_id",
            updateRule: "@request.auth.id != '' && @request.auth.id = user_id"
        }
    ];

    for (const col of collections) {
        console.log(`Creating collection: ${col.name}...`);
        const res = await request('POST', '/api/collections', col, token);
        if (res.status === 200 || res.status === 201) {
            console.log(`Success: ${col.name}`);
            colMap[col.name] = res.data.id;
        } else {
            console.error(`Failed ${col.name}:`, res.data);
        }
    }

    console.log("Fetching users collection schema...");
    const userColRes = await request('GET', '/api/collections/users', null, token);
    if (userColRes.status === 200) {
        const schema = userColRes.data.fields;
        let needsUpdate = false;
        
        if (!schema.find(f => f.name === 'tenant_id')) {
            schema.push({ name: "tenant_id", type: "relation", required: false, maxSelect: 1, collectionId: getColId("tenants"), cascadeDelete: false });
            needsUpdate = true;
        }
        if (!schema.find(f => f.name === 'role_id')) {
            schema.push({ name: "role_id", type: "relation", required: false, maxSelect: 1, collectionId: getColId("roles"), cascadeDelete: false });
            needsUpdate = true;
        }
        if (!schema.find(f => f.name === 'effective_permissions')) {
            schema.push({ name: "effective_permissions", type: "json", required: false });
            needsUpdate = true;
        }

        if (needsUpdate) {
            console.log("Updating users collection...");
            userColRes.data.fields = schema;
            const updateRes = await request('PATCH', `/api/collections/users`, userColRes.data, token);
            if (updateRes.status === 200) {
                console.log("Users collection updated successfully.");
            } else {
                console.error("Failed to update users:", updateRes.data);
            }
        } else {
            console.log("Users collection already has required fields.");
        }
    }
}

main().catch(console.error);
