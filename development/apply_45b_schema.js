const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function updateSchema() {
    console.log("=== APPLYING 4.5.B++ SCHEMA HARDENING ===");
    await pb.collection('_superusers').authWithPassword('admin@acme.com', 'Password123!');
    
    const collections = await pb.collections.getFullList();
    
    async function upsertCollection(name, data) {
        const existing = collections.find(c => c.name === name);
        if (existing) {
            console.log(`Updating collection: ${name}`);
            // Merge fields safely: add missing fields
            const newFields = data.fields;
            const existingFields = existing.fields;
            for (const nf of newFields) {
                const found = existingFields.find(ef => ef.name === nf.name);
                if (!found) {
                    existingFields.push(nf);
                } else {
                    // Update field definition
                    Object.assign(found, nf);
                }
            }
            existing.fields = existingFields;
            // update API rules if provided
            if (data.listRule !== undefined) existing.listRule = data.listRule;
            if (data.viewRule !== undefined) existing.viewRule = data.viewRule;
            if (data.createRule !== undefined) existing.createRule = data.createRule;
            if (data.updateRule !== undefined) existing.updateRule = data.updateRule;
            if (data.deleteRule !== undefined) existing.deleteRule = data.deleteRule;
            
            try {
                await pb.collections.update(existing.id, existing);
            } catch (e) {
                console.error("Update failed for", name, JSON.stringify(e.response.data, null, 2));
                throw e;
            }
        } else {
            console.log(`Creating collection: ${name}`);
            try {
                await pb.collections.create(data);
            } catch (e) {
                console.error("Create failed for", name, JSON.stringify(e.response.data, null, 2));
                throw e;
            }
        }
    }

    // 1. signature_participants
    await upsertCollection('signature_participants', {
        name: 'signature_participants',
        type: 'base',
        listRule: "", viewRule: "", createRule: "", updateRule: "", deleteRule: "",
        fields: [
            { name: "contract_id", type: "relation", required: true, collectionId: collections.find(c=>c.name==="contracts")?.id || "", maxSelect: 1 },
            { name: "tenant_id", type: "relation", required: true, collectionId: collections.find(c=>c.name==="tenants")?.id || "", maxSelect: 1 },
            { name: "participant_role", type: "text", required: true },
            { name: "participant_name", type: "text", required: true },
            { name: "participant_email", type: "email", required: true },
            { name: "sign_order", type: "number", required: true },
            { name: "status", type: "select", required: true, values: ["pending", "viewed", "signed", "rejected", "expired", "cancelled", "delegated"], maxSelect: 1 },
            { name: "signed_at", type: "date" }
        ]
    });

    // 2. documents
    await upsertCollection('documents', {
        name: 'documents',
        type: 'base',
        listRule: "", viewRule: "", createRule: "", updateRule: "", deleteRule: "",
        fields: [
            { name: "tenant_id", type: "relation", required: true, collectionId: collections.find(c=>c.name==="tenants")?.id || "", maxSelect: 1 },
            { name: "name", type: "text", required: true },
            { name: "version", type: "number", required: true },
            { name: "document_hash", type: "text", required: true },
            { name: "previous_document_hash", type: "text" },
            { name: "hash_algorithm", type: "text", required: true },
            { name: "hash_created_at", type: "date", required: true },
            { name: "legal_hold", type: "bool" },
            { name: "file", type: "file", maxSelect: 1, maxSize: 5242880 }
        ]
    });

    // 3. contract_metrics
    await upsertCollection('contract_metrics', {
        name: 'contract_metrics',
        type: 'base',
        listRule: "", viewRule: "", createRule: "", updateRule: "", deleteRule: "",
        fields: [
            { name: "tenant_id", type: "relation", required: true, collectionId: collections.find(c=>c.name==="tenants")?.id || "", maxSelect: 1 },
            { name: "active_contracts", type: "number" },
            { name: "expiring_contracts", type: "number" },
            { name: "expired_contracts", type: "number" },
            { name: "signed_contracts", type: "number" },
            { name: "renewed_contracts", type: "number" },
            { name: "terminated_contracts", type: "number" },
            { name: "average_duration", type: "number" },
            { name: "average_renewal_cycle", type: "number" },
            { name: "average_signature_time", type: "number" },
            { name: "snapshot_date", type: "date" }
        ]
    });

    // 4. Update contracts
    await upsertCollection('contracts', {
        name: 'contracts',
        fields: [
            { name: "contract_number", type: "text" },
            { name: "contract_year", type: "number" },
            { name: "contract_sequence", type: "number" },
            { name: "contract_prefix", type: "text" },
            { name: "contract_term_days", type: "number" },
            
            { name: "template_name_snapshot", type: "text" },
            { name: "template_version_snapshot", type: "number" },
            { name: "template_hash_snapshot", type: "text" },
            { name: "template_effective_date_snapshot", type: "date" },
            
            { name: "renewal_reason", type: "text" },
            { name: "renewal_notes", type: "text" },
            { name: "renewal_trigger", type: "text" },
            { name: "renewal_chain_depth", type: "number" },
            
            { name: "generated_from_quote_id", type: "text" },
            { name: "generated_from_quote_version_id", type: "text" },
            { name: "generated_from_snapshot_hash", type: "text" },
            { name: "generated_by", type: "text" },
            { name: "generated_at", type: "date" },
            
            { name: "provider_error", type: "bool" },
            { name: "provider_error_code", type: "text" },
            { name: "provider_error_message", type: "text" },
            { name: "provider_response", type: "json" }
        ]
    });

    // 5. Update contract_templates
    await upsertCollection('contract_templates', {
        name: 'contract_templates',
        fields: [
            { name: "tenant_id", type: "relation", required: true, collectionId: collections.find(c=>c.name==="tenants")?.id || "", maxSelect: 1 },
            { name: "effective_from", type: "date" },
            { name: "effective_until", type: "date" }
        ]
    });

    // 6. Update contract_evidence
    await upsertCollection('contract_evidence', {
        name: 'contract_evidence',
        fields: [
            { name: "evidence_type", type: "select", values: ["signed_pdf", "signed_scan", "manual_signature", "docusign_certificate", "email_acceptance", "payment_receipt", "identity_document", "other"], maxSelect: 1 },
            { name: "evidence_source", type: "text" },
            { name: "retention_policy", type: "text" },
            { name: "retention_until", type: "date" },
            { name: "verification_status", type: "text" },
            { name: "verification_hash", type: "text" },
            
            { name: "signed_document_hash", type: "text" },
            { name: "signature_certificate", type: "file", maxSelect: 1, maxSize: 5242880 },
            { name: "signature_provider_version", type: "text" },
            { name: "signature_completion_evidence", type: "json" },
            
            { name: "signer_ip", type: "text" },
            { name: "signer_user_agent", type: "text" },
            { name: "provider_event_id", type: "text" },
            { name: "provider_trace_id", type: "text" },
            { name: "signature_hash", type: "text" },
            { name: "provider_payload", type: "json" }
        ]
    });

    console.log("=== SCHEMA HARDENING COMPLETE ===");
}

updateSchema().catch(console.error);
