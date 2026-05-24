// cross_tenant_attack.js
// Attack objective: Read or modify data belonging to another tenant.
// Setup: User belongs to Tenant A. Tries to access resource with ID belonging to Tenant B.

const fetch = require('node-fetch');

async function attack(apiUrl, tokenA, tenantB_resourceId) {
  console.log(`[Cross-Tenant Attack] Attempting to access Tenant B resource (${tenantB_resourceId}) with Tenant A token...`);
  
  try {
    const response = await fetch(`${apiUrl}/api/quotes/${tenantB_resourceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenA}`,
        'Content-Type': 'application/json',
        // Intentional injection or omitting of tenant header
        'X-Tenant-ID': 'Tenant-B' // seeing if header spoofing works
      }
    });

    if (response.ok) {
      console.log('❌ VULNERABILITY FOUND: Cross-tenant access succeeded!');
      const data = await response.json();
      console.log(data);
      return true;
    } else {
      console.log(`✅ SECURE: Request denied (${response.status} ${response.statusText})`);
      return false;
    }
  } catch (err) {
    console.error('Error during attack:', err.message);
    return false;
  }
}

module.exports = { attack };
