const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function seedData() {
    await pb.collection('_superusers').authWithPassword('admin@acme.com', 'Password123!');
    
    console.log("Updating Tenant...");
    await pb.collection('tenants').update('4yzxanlh8vqssrf', {
        settings_json: {
            nombre_comercial: "Acme Corp",
            razon_social: "Acme Corporation S.A. de C.V.",
            rfc: "ACME010101000",
            direccion_fiscal: "Av. Reforma 222, CDMX",
            representante_legal: "John Doe"
        }
    });

    console.log("Updating Client...");
    await pb.collection('clientes').update('2tkldys24j6cr35', {
        expediente_json: {
            correo: "cliente@test.com",
            telefono: "555-1234-567",
            direccion_fiscal: "Insurgentes Sur 100, CDMX",
            representante_legal: "Jane Smith"
        }
    });

    console.log("Creating Quote...");
    const newQuote = await pb.collection('quotes').create({
        tenant_id: '4yzxanlh8vqssrf',
        client_id: '2tkldys24j6cr35',
        created_by: pb.authStore.model.id,
        folio: "Q-" + Date.now(),
        status: "draft",
        notes: "Test deterministic hash",
        valid_until: "2026-12-31 00:00:00.000Z",
        current_version: 1
    });
    console.log("Data Seeded Successfully");
}

seedData().catch(console.error);
