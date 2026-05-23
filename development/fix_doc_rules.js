const http = require('http');

const PB_URL = 'http://127.0.0.1:8090';

async function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(PB_URL + path);
        const options = {
            method,
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            headers: { 'Content-Type': 'application/json' }
        };
        if (token) options.headers['Authorization'] = 'Bearer ' + token;
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data || '{}') }));
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function fix() {
    let authRes = await request('POST', '/api/collections/_superusers/auth-with-password', {
        identity: 'admin@acme.com', password: 'Password123!'
    });
    const token = authRes.data.token;

    let colRes = await request('GET', '/api/collections/documents', null, token);
    
    colRes.data.createRule = "@request.auth.id != '' && @request.auth.tenant_id = tenant_id";
    colRes.data.updateRule = "@request.auth.id != '' && @request.auth.tenant_id = tenant_id";
    
    let patchRes = await request('PATCH', '/api/collections/documents', colRes.data, token);
    console.log("Documents Rules patched:", patchRes.status);
}
fix();
