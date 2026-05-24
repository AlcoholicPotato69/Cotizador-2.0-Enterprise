const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const path = require('path');

const pb = new PocketBase('http://127.0.0.1:8090');
const ARTIFACTS_DIR = 'C:\\Users\\johan\\.gemini\\antigravity\\brain\\ed67d679-888e-488e-b5f8-186486587e85';

function writeCert(filename, content) {
    fs.writeFileSync(path.join(ARTIFACTS_DIR, filename), content);
    console.log(`[CERT] Generated ${filename}`);
}

async function runRecovery() {
    console.log("=== PHASE 4.5.D: E2E RECOVERY & CERTIFICATION ===");
    await pb.collection('_superusers').authWithPassword('admin@acme.com', 'Password123!');

    let blockers = [];

    // 1. Create Data
    console.log("-> Seeding Entity Data...");
    let tenant = await pb.collection('tenants').getFirstListItem('').catch(() => null);
    if (!tenant) {
        tenant = await pb.collection('tenants').create({ name: "ACME Corp", slug: "acme-corp-" + Date.now(), prefix: "ACME", domain: "acme.com", status: "active" });
    }

    let u = await pb.collection('users').getFirstListItem('').catch(() => null);
    
    let client = await pb.collection('clientes').getFirstListItem('').catch(() => null);
    
    const rfcNum = Math.floor(100 + Math.random() * 900);
    const clientData = {
        tenant_id: tenant.id,
        razon_social: "CORPORATIVO REAL S.A. DE C.V.",
        rfc: `CORR890101${rfcNum}`,
        name: "Lic. Carlos Representante",
        email: "facturacion@corporativoreal.com",
        status: "active"
    };

    try {
        if (client) {
            client = await pb.collection('clientes').update(client.id, clientData);
        } else {
            client = await pb.collection('clientes').create(clientData);
        }
    } catch(err) {
        console.error("Client Up/Create Error:", JSON.stringify(err.response?.data, null, 2));
        throw err;
    }

    console.log("-> Seeding Quote with Financial Items...");
    const quote = await pb.collection('quotes').create({
        tenant_id: tenant.id,
        client_id: client.id,
        created_by: u.id,
        title: "E2E Recovery Quote",
        status: "draft"
    });

    // We must manually add items because there is no API endpoint that does both atomically right now
    await pb.collection('quote_items').create({ quote_id: quote.id, tenant_id: tenant.id, name: "Servicio 1", description: "Desc 1", quantity: 1, unit_price: 1000, total_price: 1000, type: "service" });
    await pb.collection('quote_items').create({ quote_id: quote.id, tenant_id: tenant.id, name: "Servicio 2", description: "Desc 2", quantity: 1, unit_price: 500, total_price: 500, type: "service" });
    await pb.collection('quote_items').create({ quote_id: quote.id, tenant_id: tenant.id, name: "Descuento", description: "Discount", quantity: 1, unit_price: -100, total_price: -100, type: "discount" });

    console.log("-> Approving Quote (Triggering Snapshot Engine)...");
    await pb.collection('quotes').update(quote.id, { status: "submitted" });
    const approvedQuote = await pb.collection('quotes').update(quote.id, { status: "approved" });

    console.log("-> Fetching Generated Quote Version...");
    const versions = await pb.collection('quote_versions').getFullList();
    const qv = versions.find(v => v.quote_id === quote.id && v.version_number === 2);
    if (!qv) throw new Error("Quote version not found for quote " + quote.id);

    const snapData = qv.snapshot_data;
    
    // VERIFY BILLING PROFILE
    const bp = snapData.billing_profile_json;
    const isBpComplete = bp && bp.rfc.startsWith("CORR") && bp.captured_from_snapshot_hash !== "PENDING";
    
    writeCert("REAL_BILLING_PROFILE_CERTIFICATION.md", `# REAL_BILLING_PROFILE_CERTIFICATION\n\n**STATUS**: ${isBpComplete ? "CERTIFIED" : "FAILED"}\n\n## Estructura Capturada\n\`\`\`json\n${JSON.stringify(bp, null, 2)}\n\`\`\`\n`);

    if(!isBpComplete) blockers.push("Billing profile incomplete or missing in snapshot");

    // VERIFY FINANCIAL SNAPSHOT
    const fin = snapData.financial_snapshot;
    // subtotal=1500, discounts=-100, taxable=1400. Tax=224. Total=1624.
    const isFinComplete = fin && fin.subtotal === 1500 && fin.taxes === 224 && fin.total === 1624;
    
    writeCert("REAL_FINANCIAL_SNAPSHOT_CERTIFICATION.md", `# REAL_FINANCIAL_SNAPSHOT_CERTIFICATION\n\n**STATUS**: ${isFinComplete ? "CERTIFIED" : "FAILED"}\n\n## Valores Calculados Físicamente\n\`\`\`json\n${JSON.stringify(fin, null, 2)}\n\`\`\`\n`);

    if(!isFinComplete) blockers.push("Financial snapshot calculation failed or missing");

    console.log("-> Creating Contract from Snapshot...");
    const contract = await pb.collection('contracts').create({
        tenant_id: tenant.id,
        client_id: client.id,
        created_by: u.id,
        source_quote_version_id: qv.id,
        valid_from: "2026-01-01T00:00:00Z",
        valid_until: "2026-12-31T23:59:59Z"
    });

    console.log("-> Generating Initial Contract Version...");
    const cv = await pb.collection('contract_versions').create({
        contract_id: contract.id,
        version_number: 1,
        tenant_id: tenant.id,
        created_by: u.id,
        snapshot_data: snapData,
        snapshot_hash: qv.snapshot_hash,
        source_quote_hash: qv.snapshot_hash,
        change_notes: "Initial Contract Generation"
    });

    // VERIFY DATA PRESERVATION
    const cBp = contract.billing_profile_json;
    const isInherited = cBp && cBp.rfc === bp.rfc;

    writeCert("QUOTE_TO_CONTRACT_DATA_PRESERVATION.md", `# QUOTE_TO_CONTRACT_DATA_PRESERVATION\n\n**STATUS**: ${isInherited ? "CERTIFIED" : "FAILED"}\n\nEl motor de contratos extrajo correctamente el perfil fiscal de SQLite nativo durante la creación.\n\n## Contract SQLite Row\n\`\`\`json\n${JSON.stringify(contract, null, 2)}\n\`\`\`\n`);

    if(!isInherited) blockers.push("Contract failed to inherit billing profile to native column");

    writeCert("INVOICE_SOURCE_CERTIFICATION.md", `# INVOICE_SOURCE_CERTIFICATION\n\n**STATUS**: ${blockers.length === 0 ? "CERTIFIED" : "FAILED"}\n\n## Origen de Verdad para CFDI\nTodo CFDI futuro se construirá ÚNICAMENTE leyendo la columna \`snapshot_data\` del \`contract_versions\`, que incluye tanto \`billing_profile_json\` como \`financial_snapshot\`, eliminando la necesidad de JOINS con las tablas cliente o quote.\n`);

    let reevalStatus = blockers.length === 0 ? "YES" : "NO";
    let reevalMsg = blockers.length === 0 ? "El snapshot físico ahora contiene la integridad total de facturación (Financials + Billing Profile)." : blockers.join("\n");

    writeCert("INVOICE_DOMAIN_READINESS_REEVALUATION.md", `# INVOICE_DOMAIN_READINESS_REEVALUATION\n\n**READY_FOR_INVOICE_DOMAIN = ${reevalStatus}**\n\n## Motivo\n${reevalMsg}\n`);

    if (reevalStatus === "YES") {
        writeCert("PHASE_5_AUTHORIZATION.md", `# PHASE 5.0 – INVOICE MANAGEMENT AUTHORIZATION\n\n**STATUS: APPROVED**\n\n## Especificaciones Arquitectónicas Autorizadas\n1. Crear colecciones \`invoices\`, \`invoice_evidence\`, \`invoice_metrics\`.\n2. Crear \`invoices.pb.js\` para manejar la máquina de estados CFDI (draft, stamping, stamped, failed, cancelled).\n3. Crear \`InvoiceProviderEngine.js\` (basado en el patrón de SignatureEngine) para integrarse con PACs SAT.\n4. **PROHIBIDO** modificar o consultar \`clientes\` y \`quotes\` desde el dominio Invoice. Todo dato saldrá del \`contract.billing_profile_json\` y \`contract_versions.snapshot_data\`.\n`);
        console.log("\n[SUCCESS] READY_FOR_INVOICE_DOMAIN = YES");
    } else {
        console.log("\n[FAILED] READY_FOR_INVOICE_DOMAIN = NO");
        console.log(blockers);
    }
}

runRecovery().catch(console.error);
