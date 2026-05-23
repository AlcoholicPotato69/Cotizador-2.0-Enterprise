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
    const authRes = await request('POST', '/api/collections/_superusers/auth-with-password', {
        identity: ADMIN_EMAIL,
        password: ADMIN_PASS
    });
    const token = authRes.data.token;

    // 1. Get Users
    const usersRes = await request('GET', '/api/collections/users/records', null, token);
    const pmUser = usersRes.data.items.find(u => u.email === 'user@plazamayor.com');
    const cpUser = usersRes.data.items.find(u => u.email === 'user@casadepiedra.com');

    // 2. Get Tenants
    const tenantsRes = await request('GET', '/api/collections/tenants/records', null, token);
    const pmTenant = tenantsRes.data.items.find(t => t.name === 'Plaza Mayor');
    const cpTenant = tenantsRes.data.items.find(t => t.name === 'Casa de Piedra');

    // 3. Create Admin Role if not exists
    const rolesRes = await request('GET', '/api/collections/roles/records', null, token);
    let adminRole = rolesRes.data.items.find(r => r.name === 'Admin Master');
    
    if (!adminRole) {
        const roleCreateRes = await request('POST', '/api/collections/roles/records', {
            name: "Admin Master",
            level: 100,
            permissions_json: ["client.read", "client.create", "client.update", "client.delete", "document.read", "document.create", "tenant.admin"]
        }, token);
        adminRole = roleCreateRes.data;
        console.log("Created Admin Role");
    }

    // 4. Update PM User
    if (pmUser && pmTenant && adminRole) {
        const payload = {
            tenant_id: pmTenant.id,
            role_id: adminRole.id,
            effective_permissions: adminRole.permissions_json // Hack to bypass hook if hook fails
        };
        await request('PATCH', `/api/collections/users/records/${pmUser.id}`, payload, token);
        console.log("Updated PM User");
    }

    // 5. Update CP User
    if (cpUser && cpTenant && adminRole) {
        const payload = {
            tenant_id: cpTenant.id,
            role_id: adminRole.id,
            effective_permissions: adminRole.permissions_json
        };
        await request('PATCH', `/api/collections/users/records/${cpUser.id}`, payload, token);
        console.log("Updated CP User");
    }
}

main().catch(console.error);
