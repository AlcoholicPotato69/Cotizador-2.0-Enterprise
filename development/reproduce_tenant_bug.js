const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function reproduce() {
    try {
        await pb.collection('_superusers').authWithPassword('admin@acme.com', 'Password123!');
        
        const tenant = await pb.collection('tenants').getFirstListItem('');
        console.log("Tenant fetched:", tenant.id, tenant.slug);
        
        console.log("Attempting to update tenant...");
        const result = await pb.collection('tenants').update(tenant.id, {
            slug: tenant.slug // Just updating with same value to trigger hooks
        });
        
        console.log("Update SUCCESS:", result.id);
    } catch(e) {
        console.error("Update FAILED:", e.status, e.message);
        if (e.response && e.response.data) {
            console.error("Validation Errors:", JSON.stringify(e.response.data, null, 2));
        }
    }
}
reproduce().catch(console.error);
