const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function fix() {
    await pb.collection('users').authWithPassword('admin@acme.com', 'Password123!');
    const pmTenant = await pb.collection('tenants').getFirstListItem(`slug="pm"`);
    const cpTenant = await pb.collection('tenants').getFirstListItem(`slug="cp"`);
    
    const pmUser = await pb.collection('users').getFirstListItem(`email="user@plazamayor.com"`);
    await pb.collection('users').update(pmUser.id, { tenant_id: pmTenant.id });
    
    const cpUser = await pb.collection('users').getFirstListItem(`email="user@casadepiedra.com"`);
    await pb.collection('users').update(cpUser.id, { tenant_id: cpTenant.id });
    
    console.log("Users updated with Tenant IDs", pmTenant.id, cpTenant.id);
}
fix().catch(console.error);
