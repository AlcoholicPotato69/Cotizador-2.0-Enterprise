const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');
async function test() {
    await pb.admins.authWithPassword('admin@acme.com', 'Password123!');
    console.log("Logged in");
}
test().catch(console.error);
