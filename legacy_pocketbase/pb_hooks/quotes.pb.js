/// <reference path="../pb_data/types.d.ts" />

/**
 * QUOTES BUSINESS LOGIC HOOKS
 */



onRecordCreateRequest((e) => {
    // 1. Folio Generation
    if (!e.record.get("folio")) {
        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(1000 + Math.random() * 9000);
        e.record.set("folio", `COT-${yyyy}${mm}${dd}-${random}`);
    }

    // 2. Default Status
    if (!e.record.get("status")) {
        e.record.set("status", "draft");
    }

    // 3. Initial Version
    e.record.set("current_version", 1);
    
    // 4. Set created_by if missing
    if (!e.record.get("created_by") && e.auth) {
        e.record.set("created_by", e.auth.id);
    }

    // Subtotal/Totals are usually 0 initially
    if (!e.record.get("subtotal")) e.record.set("subtotal", 0);
    if (!e.record.get("tax_amount")) e.record.set("tax_amount", 0);
    if (!e.record.get("total_amount")) e.record.set("total_amount", 0);

    return e.next();
}, "quotes");

onRecordUpdateRequest((e) => {
    // 1. Fetch original record to compare status
    const originalRecord = $app.findRecordById("quotes", e.record.id);
    const oldStatus = originalRecord.get("status");
    const newStatus = e.record.get("status");
    
    // 2. Block modifications if already approved or converted
    if ((oldStatus === "approved" || oldStatus === "contract_generated") && oldStatus === newStatus) {
        throw new BadRequestError("QUOTE_FROZEN: Approved quotes cannot be modified. Generate a new version.");
    }
    
    // 3. Status Transition Logic
    if (oldStatus !== newStatus) {
        const validTransitions = {
            "draft": ["submitted"],
            "submitted": ["approved", "rejected"],
            "approved": ["contract_generated", "expired"],
            "rejected": ["draft"],
            "expired": ["draft"]
        };
        
        if (!validTransitions[oldStatus] || !validTransitions[oldStatus].includes(newStatus)) {
            throw new BadRequestError(`INVALID_TRANSITION: Cannot transition from ${oldStatus} to ${newStatus}.`);
        }
        
        // Log status change
        const historyCollection = $app.findCollectionByNameOrId("quote_status_history");
        const historyRecord = new Record(historyCollection);
        historyRecord.set("quote_id", e.record.id);
        historyRecord.set("old_status", oldStatus);
        historyRecord.set("new_status", newStatus);
        historyRecord.set("changed_by", e.auth ? e.auth.id : "system");
        
        let reason = "State transition";
        if (e.httpContext) {
            try { reason = e.httpContext.queryParam("reason") || reason; } catch(ex) {}
        }
        historyRecord.set("reason", reason);
        $app.save(historyRecord);
        
        // 4. Force FINAL SNAPSHOT if approved
        if (newStatus === "approved") {
            const currentVer = parseInt(e.record.get("current_version")) || 1;
            console.log("Status changed to approved. Bumping version from", currentVer, "to", currentVer + 1);
            e.record.set("current_version", currentVer + 1);
        }
    }
    return e.next();
}, "quotes");

onRecordAfterCreateSuccess((e) => {
    try {
        // Create initial version snapshot
        const versionCollection = $app.findCollectionByNameOrId("quote_versions");
        const vRecord = new Record(versionCollection);
        
        vRecord.set("quote_id", e.record.id);
        vRecord.set("version_number", 1);
        vRecord.set("created_by", e.record.get("created_by"));
        vRecord.set("change_notes", "Initial creation");
        
        // Build comprehensive snapshot data
        let snapshotData = JSON.parse(JSON.stringify(e.record.publicExport()));
        
        // Fetch Client Data
        let clientData = {};
        let billing_profile_json = {
            version: 1,
            captured_at: new Date().toISOString(),
            captured_from_snapshot_hash: "PENDING",
            billing_contact_name: "",
            billing_contact_email: "",
            razon_social: "",
            rfc: "",
            direccion_fiscal: "",
            codigo_postal: "",
            pais: "",
            estado: "",
            municipio: "",
            regimen_fiscal: "",
            uso_cfdi: ""
        };
        try {
            const client = $app.findRecordById("clientes", e.record.get("client_id"));
            clientData = client.publicExport();
            
            billing_profile_json.billing_contact_name = client.get("name") || "";
            billing_profile_json.billing_contact_email = client.get("email") || "";
            billing_profile_json.razon_social = client.get("razon_social") || "";
            billing_profile_json.rfc = client.get("rfc") || "";
            billing_profile_json.direccion_fiscal = client.get("direccion_fiscal") || "";
            billing_profile_json.codigo_postal = client.get("codigo_postal") || "";
            billing_profile_json.pais = client.get("pais") || "Mexico";
            billing_profile_json.estado = client.get("estado") || "";
            billing_profile_json.municipio = client.get("municipio") || "";
            billing_profile_json.regimen_fiscal = client.get("regimen_fiscal") || "601";
            billing_profile_json.uso_cfdi = client.get("uso_cfdi") || "G03";
        } catch(ex) { console.error("Client fetch error:", ex); }
        
        // Fetch Items
        let itemsData = [];
        try {
            const items = $app.findRecordsByFilter("quote_items", `quote_id = '${e.record.id}'`);
            itemsData = items.map(i => i.publicExport());
        } catch(ex) { console.error("Items fetch error:", ex); }

        // Financial Snapshot
        let subtotal = 0;
        let discounts = 0;
        itemsData.forEach(i => {
            if(i.type === 'discount') { discounts += i.total_price || 0; }
            else { subtotal += i.total_price || 0; }
        });
        const taxable = subtotal + discounts;
        const tax = taxable * 0.16;
        const total = taxable + tax;
        
        const financial_snapshot = {
            subtotal: Math.round(subtotal * 100) / 100,
            discounts: Math.round(discounts * 100) / 100,
            taxes: Math.round(tax * 100) / 100,
            total: Math.round(total * 100) / 100,
            currency: "MXN",
            tax_rate: 0.16,
            payment_frequency: e.record.get("payment_frequency") || "monthly",
            billing_day: e.record.get("billing_day") || 1
        };
        
        snapshotData.client_data = clientData;
        snapshotData.billing_profile_json = billing_profile_json;
        snapshotData.items = [];
        snapshotData.financial_snapshot = financial_snapshot;
        
        const payloadString = JSON.stringify(snapshotData);
        const auditUtil = require(`${__hooks}/utils/audit.js`);
        const hash = auditUtil.sha256(payloadString);
        
        snapshotData.billing_profile_json.captured_from_snapshot_hash = hash;
        vRecord.set("snapshot_data", snapshotData);
        vRecord.set("snapshot_hash", hash);
        
        $app.save(vRecord);
        
        // Audit Log for Creation
        auditUtil.createAuditLog(
            "QUOTE_CREATED", 
            "quote", 
            e.record.id, 
            1, 
            e.auth ? e.auth.id : "system",
            e.record.get("tenant_id"),
            e.httpContext ? e.httpContext.request() : null,
            hash,
            { folio: e.record.get("folio") },
            $app
        );
    } catch(err) {
        console.error("Error creating initial quote version:", err);
    }
    return e.next();
}, "quotes");



// DEFENSE IN DEPTH: Block external updates and deletes on quote_versions
onRecordUpdateRequest((e) => {
    // If not internal (meaning it comes from HTTP), block it
    if (e.httpContext) {
        throw new BadRequestError("SNAPSHOT_IMMUTABLE: quote_versions cannot be modified.");
    }
}, "quote_versions");

onRecordDeleteRequest((e) => {
    if (e.httpContext) {
        throw new BadRequestError("SNAPSHOT_IMMUTABLE: quote_versions cannot be deleted.");
    }
}, "quote_versions");

onRecordAfterUpdateSuccess((e) => {
    try {
        const verNum = e.record.get("current_version");
        const existingVersions = $app.findRecordsByFilter("quote_versions", `quote_id = '${e.record.id}' && version_number = ${verNum}`);
        
        if (existingVersions.length === 0) {
            const versionCollection = $app.findCollectionByNameOrId("quote_versions");
            const vRecord = new Record(versionCollection);
            
            vRecord.set("quote_id", e.record.id);
            vRecord.set("version_number", verNum);
            vRecord.set("created_by", e.auth ? e.auth.id : e.record.get("created_by"));
            
            // Try to extract notes if passed via HTTP
            let changeNotes = "Auto-bump";
            if (e.httpContext) {
                try { changeNotes = e.httpContext.queryParam("notes") || "Auto-bump"; } catch(e) {}
            }
            vRecord.set("change_notes", changeNotes);
            
            // Build comprehensive snapshot data
            let snapshotData = JSON.parse(JSON.stringify(e.record.publicExport()));
            
            // Fetch Client Data
            let clientData = {};
            let billing_profile_json = {
                version: 1,
                captured_at: new Date().toISOString(),
                captured_from_snapshot_hash: "PENDING",
                billing_contact_name: "",
                billing_contact_email: "",
                razon_social: "",
                rfc: "",
                direccion_fiscal: "",
                codigo_postal: "",
                pais: "",
                estado: "",
                municipio: "",
                regimen_fiscal: "",
                uso_cfdi: ""
            };
            try {
                const client = $app.findRecordById("clientes", e.record.get("client_id"));
                clientData = client.publicExport();
                
                billing_profile_json.billing_contact_name = client.get("name") || "";
                billing_profile_json.billing_contact_email = client.get("email") || "";
                billing_profile_json.razon_social = client.get("razon_social") || "";
                billing_profile_json.rfc = client.get("rfc") || "";
                billing_profile_json.direccion_fiscal = client.get("direccion_fiscal") || "";
                billing_profile_json.codigo_postal = client.get("codigo_postal") || "";
                billing_profile_json.pais = client.get("pais") || "Mexico";
                billing_profile_json.estado = client.get("estado") || "";
                billing_profile_json.municipio = client.get("municipio") || "";
                billing_profile_json.regimen_fiscal = client.get("regimen_fiscal") || "601";
                billing_profile_json.uso_cfdi = client.get("uso_cfdi") || "G03";
            } catch(ex) { console.error("Client fetch error:", ex); }
            
            // Fetch Items
            let itemsData = [];
            try {
                const items = $app.findRecordsByFilter("quote_items", `quote_id = '${e.record.id}'`);
                itemsData = items.map(i => i.publicExport());
            } catch(ex) { console.error("Items fetch error:", ex); }

            // Financial Snapshot
            let subtotal = 0;
            let discounts = 0;
            itemsData.forEach(i => {
                if(i.type === 'discount') { discounts += i.total_price || 0; }
                else { subtotal += i.total_price || 0; }
            });
            const taxable = subtotal + discounts;
            const tax = taxable * 0.16;
            const total = taxable + tax;
            
            const financial_snapshot = {
                subtotal: Math.round(subtotal * 100) / 100,
                discounts: Math.round(discounts * 100) / 100,
                taxes: Math.round(tax * 100) / 100,
                total: Math.round(total * 100) / 100,
                currency: "MXN",
                tax_rate: 0.16,
                payment_frequency: e.record.get("payment_frequency") || "monthly",
                billing_day: e.record.get("billing_day") || 1
            };
            
            // Fetch Tenant Data
            let tenantData = { id: e.record.get("tenant_id") };
            try {
                const tenant = $app.findRecordById("tenants", e.record.get("tenant_id"));
                tenantData = tenant.publicExport();
            } catch(ex) { console.error("Tenant fetch error:", ex); }
            
            // Optional: Template Data (if attached to quote, else mock structure for now to satisfy schema)
            let templateData = { id: "", name: "Default Template", version: 1 };
            try {
                if (e.record.get("template_id")) {
                    const tpl = $app.findRecordById("contract_templates", e.record.get("template_id"));
                    templateData = tpl.publicExport();
                }
            } catch(ex) {}
            
            snapshotData.client_data = clientData;
            snapshotData.billing_profile_json = billing_profile_json;
            snapshotData.tenant_data = tenantData;
            snapshotData.items = itemsData;
            snapshotData.financial_snapshot = financial_snapshot;
            snapshotData.template_data = templateData;
            snapshotData.contract_metadata = {};
            // Generate SHA-256 Hash
            const payloadString = JSON.stringify(snapshotData);
            const auditUtil = require(`${__hooks}/utils/audit.js`);
            const hash = auditUtil.sha256(payloadString);
            
            snapshotData.billing_profile_json.captured_from_snapshot_hash = hash;
            vRecord.set("snapshot_data", snapshotData);
            vRecord.set("snapshot_hash", hash);
            
            $app.save(vRecord);
            
            // If this was an approval, we mark the change note
            if (e.record.get("status") === "approved") {
                vRecord.set("change_notes", "FINAL_APPROVED_SNAPSHOT");
                $app.save(vRecord);
            }
            
            // Audit Log
            auditUtil.createAuditLog(
                "QUOTE_SNAPSHOT", 
                "quote", 
                e.record.id, 
                verNum, 
                e.auth ? e.auth.id : "system",
                e.record.get("tenant_id"),
                e.httpContext ? e.httpContext.request() : null,
                hash,
                { version: verNum, change_notes: vRecord.get("change_notes") },
                $app
            );
        } else {
            const auditUtil = require(`${__hooks}/utils/audit.js`);
            // General Update or Status Change
            // PocketBase v0.23 doesn't easily expose original record in onRecordAfterUpdateSuccess without intercepting BeforeUpdate.
            // But we can just log a generic UPDATE event.
            auditUtil.createAuditLog(
                "QUOTE_UPDATED", 
                "quote", 
                e.record.id, 
                e.record.get("current_version"), 
                e.auth ? e.auth.id : "system",
                e.record.get("tenant_id"),
                e.httpContext ? e.httpContext.request() : null,
                "",
                { status: e.record.get("status"), subtotal: e.record.get("subtotal") },
                $app
            );
        }
        
    } catch(err) {
        console.error("Error in AfterUpdate quotes:", err);
    }
    return e.next();
}, "quotes");
