// payload_corruption.js
// Attack objective: Bypass schema validation, insert massive payloads, or corrupt the Audit Hash Chain by supplying bad inputs.

const fetch = require('node-fetch');

async function attack(apiUrl, token) {
  console.log(`[Payload Corruption] Sending corrupted payloads...`);
  
  const payloads = [
    // 1. Missing Tenant ID entirely
    { name: "Test Quote" },
    // 2. Spoofing internal fields like 'current_hash' or 'chain_hash'
    { name: "Tamper Quote", current_hash: "HACKED_HASH", previous_hash: "HACKED_PREVIOUS" },
    // 3. Massive JSON payload to test memory limits / Storage Engine overflow
    { name: "Massive Quote", payload: "A".repeat(10 * 1024 * 1024) },
    // 4. SQL/NoSQL Injection in JSON
    { name: "Injection Quote", 'tenant_id': { '$ne': null } },
    // 5. Array instead of Object
    [{ name: "Array Quote" }]
  ];

  let vulnerabilitiesFound = 0;

  for (let i = 0; i < payloads.length; i++) {
    try {
      const response = await fetch(`${apiUrl}/api/quotes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payloads[i])
      });

      if (response.ok) {
        console.log(`❌ VULNERABILITY FOUND: System accepted payload ${i + 1}`);
        vulnerabilitiesFound++;
      } else {
        console.log(`✅ SECURE: Payload ${i + 1} rejected (${response.status})`);
      }
    } catch (err) {
      console.log(`✅ SECURE: Payload ${i + 1} caused a safe exception (${err.message})`);
    }
  }

  return vulnerabilitiesFound > 0;
}

module.exports = { attack };
