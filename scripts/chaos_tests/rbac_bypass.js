// rbac_bypass.js
// Attack objective: Execute an action without the required permission (e.g., approve a quote).

const fetch = require('node-fetch');

async function attack(apiUrl, tokenUser, resourceId) {
  console.log(`[RBAC Bypass Attack] Attempting to execute unauthorized action (approve) on resource ${resourceId}...`);
  
  try {
    const response = await fetch(`${apiUrl}/api/quotes/${resourceId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenUser}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ approved: true })
    });

    if (response.ok) {
      console.log('❌ VULNERABILITY FOUND: RBAC Bypass succeeded!');
      return true;
    } else {
      console.log(`✅ SECURE: Unauthorized action denied (${response.status} ${response.statusText})`);
      return false;
    }
  } catch (err) {
    console.error('Error during attack:', err.message);
    return false;
  }
}

module.exports = { attack };
