const fs = require('fs');
require('cross-fetch/polyfill');
const PocketBase = require('pocketbase/cjs');

const pb = new PocketBase('http://127.0.0.1:8090');
const pbCp = new PocketBase('http://127.0.0.1:8090');

const evidence = {
    auth: {},
    tenant: {},
    rbac: {},
    client: {},
    document: {}
};

async function logRequest(category, action, promise, payload) {
    let result = { payload, status: null, response: null };
    try {
        if (typeof promise === 'function') {
            const res = await promise();
            result.status = 200;
            result.response = res;
        } else {
            const res = await promise;
            result.status = 200;
            result.response = res;
        }
    } catch (e) {
        result.status = e.status || 500;
        result.response = e.response || e.message;
    }
    evidence[category][action] = result;
    return result;
}

async function runAudit() {
    console.log("Gathering evidence...");

    // AUTH
    const authPayload = { identity: 'user@plazamayor.com', password: 'Password123!' };
    let authRes = await logRequest('auth', 'valid_login', pb.collection('users').authWithPassword(authPayload.identity, authPayload.password), authPayload);
    
    const invalidPayload = { identity: 'user@plazamayor.com', password: 'WrongPassword' };
    await logRequest('auth', 'invalid_login', pb.collection('users').authWithPassword(invalidPayload.identity, invalidPayload.password), invalidPayload);
    
    await logRequest('auth', 'refresh_session', pb.collection('users').authRefresh(), { action: 'refresh_token' });
    
    // TENANT
    const cpPayload = { identity: 'user@casadepiedra.com', password: 'Password123!' };
    await logRequest('tenant', 'cp_login', pbCp.collection('users').authWithPassword(cpPayload.identity, cpPayload.password), cpPayload);
    
    const pmTenantId = pb.authStore.model.tenant_id;
    const clientPayload = { tenant_id: pmTenantId, razon_social: 'PM Client Corp', rfc: 'PMX010101000', status_validacion: 'pendiente' };
    
    let clientRes = await logRequest('client', 'create_client', pb.collection('clientes').create(clientPayload), clientPayload);
    let pmClientId = clientRes.response?.id;

    await logRequest('client', 'read_client', pb.collection('clientes').getOne(pmClientId), { id: pmClientId });
    
    const editPayload = { status_validacion: 'completado' };
    await logRequest('client', 'edit_client', pb.collection('clientes').update(pmClientId, editPayload), editPayload);

    await logRequest('tenant', 'cross_tenant_read', pbCp.collection('clientes').getOne(pmClientId), { client_id: pmClientId, expected_result: 'denied' });

    // RBAC
    await logRequest('rbac', 'admin_route_access', pb.collection('audit_logs').getFullList(), { target: 'audit_logs' });
    
    // DOCUMENT
    const formData = new FormData();
    formData.append('tenant_id', pmTenantId);
    formData.append('client_id', pmClientId);
    formData.append('provider', 'pdf');
    formData.append('hash', 'test_crypto_hash_abc123');
    formData.append('status', 'valid');
    formData.append('legal_hold', 'false');
    const blob = new Blob(['%PDF-1.4 mock content'], { type: 'application/pdf' });
    formData.append('file', blob, 'evidence.pdf');
    
    let docRes = await logRequest('document', 'upload', pb.collection('documents').create(formData), {
        tenant_id: pmTenantId, client_id: pmClientId, provider: 'pdf', file: 'evidence.pdf (Binary)'
    });
    
    if (docRes.status === 200) {
        await logRequest('document', 'read', pb.collection('documents').getOne(docRes.response.id), { id: docRes.response.id });
    }

    fs.writeFileSync('detailed_evidence.json', JSON.stringify(evidence, null, 2));
    console.log("Evidence gathered.");
}

runAudit().catch(console.error);
