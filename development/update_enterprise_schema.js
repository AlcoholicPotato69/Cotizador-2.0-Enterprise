const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function createOrUpdateCollection(name, collectionData) {
    try {
        const existing = await pb.collections.getOne(name);
        console.log(`Updating collection '${name}'...`);
        // Merge fields
        const existingFieldsMap = new Map(existing.fields.map(f => [f.name, f]));
        const newFieldsMap = new Map(collectionData.fields.map(f => [f.name, f]));
        
        for (const [fieldName, field] of newFieldsMap) {
            if (existingFieldsMap.has(fieldName)) {
                // Update existing field properties (e.g. enum values)
                const extField = existingFieldsMap.get(fieldName);
                if (field.values) extField.values = field.values;
                if (field.type) extField.type = field.type;
                if (field.maxSelect !== undefined) extField.maxSelect = field.maxSelect;
            } else {
                existing.fields.push(field);
            }
        }
        await pb.collections.update(existing.id, existing);
        console.log(`Updated '${name}'.`);
    } catch (e) {
        if (e.status === 404) {
            console.log(`Creating collection '${name}'...`);
            try {
                await pb.collections.create(collectionData);
                console.log(`Created '${name}'.`);
            } catch(createErr) {
                console.error(`Error creating '${name}':`, JSON.stringify(createErr.response?.data || createErr.message, null, 2));
            }
        } else {
            console.error(`Error fetching '${name}':`, JSON.stringify(e.response?.data || e.message, null, 2));
        }
    }
}

async function updateSchema() {
    await pb.collection('_superusers').authWithPassword('admin@acme.com', 'Password123!');
    
    const usersCol = await pb.collections.getOne('users');
    const tenantsCol = await pb.collections.getOne('tenants');
    const contractsCol = await pb.collections.getOne('contracts');
    const contractVersionsCol = await pb.collections.getOne('contract_versions');

    // 1. contract_templates
    await createOrUpdateCollection('contract_templates', {
        name: "contract_templates",
        type: "base",
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { name: "name", type: "text", required: true },
            { name: "contract_type", type: "text", required: true },
            { name: "version", type: "number", required: true },
            { name: "status", type: "text", required: true },
            { name: "is_active", type: "bool", required: false },
            { name: "template_file_id", type: "text", required: false },
            { name: "template_hash", type: "text", required: false },
            { name: "created_by", type: "relation", collectionId: usersCol.id, maxSelect: 1, required: true },
            { name: "retired_at", type: "date", required: false },
            { name: "retired_reason", type: "text", required: false }
        ]
    });

    const templatesCol = await pb.collections.getOne('contract_templates');

    // 2. contracts
    await createOrUpdateCollection('contracts', {
        name: "contracts",
        type: "base",
        fields: [
            { name: "contract_type", type: "select", values: ["lease", "temporary_space", "event", "advertising", "sponsorship", "other"], maxSelect: 1, required: false },
            { name: "template_id", type: "relation", collectionId: templatesCol.id, maxSelect: 1, required: false },
            { name: "template_name", type: "text", required: false },
            { name: "template_version", type: "number", required: false },
            { name: "template_hash", type: "text", required: false },
            { name: "root_contract_id", type: "relation", collectionId: contractsCol.id, maxSelect: 1, required: false },
            { name: "renewed_from_contract_id", type: "relation", collectionId: contractsCol.id, maxSelect: 1, required: false },
            { name: "renewal_reason", type: "text", required: false },
            { name: "renewal_type", type: "select", values: ["exact_clone", "administrative", "commercial", "full_reissue"], maxSelect: 1, required: false },
            { name: "signature_mode", type: "select", values: ["manual", "electronic", "hybrid"], maxSelect: 1, required: false },
            { name: "signature_provider", type: "select", values: ["manual", "docusign", "adobe_sign", "dropbox_sign", "internal"], maxSelect: 1, required: false },
            { name: "signature_status", type: "select", values: ["unsigned", "pending", "sent", "viewed", "signed", "rejected", "expired", "cancelled"], maxSelect: 1, required: false },
            { name: "signature_request_id", type: "text", required: false },
            { name: "signature_completed_at", type: "date", required: false },
            { name: "signature_hash", type: "text", required: false },
            { name: "signature_metadata_json", type: "json", required: false },
            { name: "signed_document_id", type: "text", required: false },
            { name: "billing_profile_json", type: "json", required: false },
            { name: "status", type: "select", values: ["draft", "pending_signature", "signed", "active", "expiring", "expired", "renewal_pending", "renewed", "terminated", "archived"], maxSelect: 1, required: true },
            { name: "legal_hold", type: "bool", required: false },
            { name: "legal_hold_reason", type: "text", required: false },
            { name: "legal_hold_created_at", type: "date", required: false },
            { name: "legal_hold_created_by", type: "relation", collectionId: usersCol.id, maxSelect: 1, required: false }
        ]
    });

    // 3. contract_pdfs
    await createOrUpdateCollection('contract_pdfs', {
        name: "contract_pdfs",
        type: "base",
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { name: "tenant_id", type: "relation", collectionId: tenantsCol.id, maxSelect: 1, required: true },
            { name: "contract_id", type: "relation", collectionId: contractsCol.id, maxSelect: 1, required: true },
            { name: "contract_version_id", type: "relation", collectionId: contractVersionsCol.id, maxSelect: 1, required: true },
            { name: "pdf_hash", type: "text", required: true },
            { name: "pdf_file", type: "file", maxSelect: 1, required: false },
            { name: "generated_at", type: "date", required: true },
            { name: "generated_by", type: "relation", collectionId: usersCol.id, maxSelect: 1, required: true },
            { name: "generation_metadata_json", type: "json", required: false }
        ]
    });

    // 4. contract_signatures
    await createOrUpdateCollection('contract_signatures', {
        name: "contract_signatures",
        type: "base",
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { name: "tenant_id", type: "relation", collectionId: tenantsCol.id, maxSelect: 1, required: true },
            { name: "contract_id", type: "relation", collectionId: contractsCol.id, maxSelect: 1, required: true },
            { name: "contract_version_id", type: "relation", collectionId: contractVersionsCol.id, maxSelect: 1, required: true },
            { name: "provider", type: "text", required: true },
            { name: "signature_mode", type: "text", required: true },
            { name: "status", type: "text", required: true },
            { name: "provider_request_id", type: "text", required: false },
            { name: "provider_document_id", type: "text", required: false },
            { name: "signed_by", type: "text", required: false },
            { name: "signed_at", type: "date", required: false },
            { name: "signature_hash", type: "text", required: false },
            { name: "verification_status", type: "text", required: false },
            { name: "verification_notes", type: "text", required: false },
            { name: "verified_by", type: "relation", collectionId: usersCol.id, maxSelect: 1, required: false },
            { name: "verified_at", type: "date", required: false },
            { name: "signed_document_id", type: "text", required: false },
            { name: "metadata_json", type: "json", required: false }
        ]
    });
    
    const contractSigsCol = await pb.collections.getOne('contract_signatures');

    // 5. signature_evidence
    await createOrUpdateCollection('signature_evidence', {
        name: "signature_evidence",
        type: "base",
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { name: "contract_signature_id", type: "relation", collectionId: contractSigsCol.id, maxSelect: 1, required: true },
            { name: "event_type", type: "text", required: true },
            { name: "ip_address", type: "text", required: false },
            { name: "user_agent", type: "text", required: false },
            { name: "provider_payload", type: "json", required: false },
            { name: "timestamp", type: "date", required: true },
            { name: "verification_hash", type: "text", required: true }
        ]
    });

    // 6. signature_events
    await createOrUpdateCollection('signature_events', {
        name: "signature_events",
        type: "base",
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { name: "signature_id", type: "relation", collectionId: contractSigsCol.id, maxSelect: 1, required: false },
            { name: "event_type", type: "text", required: true },
            { name: "payload_json", type: "json", required: true },
            { name: "processed", type: "bool", required: false }
        ]
    });

    // 7. signature_providers
    await createOrUpdateCollection('signature_providers', {
        name: "signature_providers",
        type: "base",
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { name: "provider_name", type: "text", required: true },
            { name: "enabled", type: "bool", required: false },
            { name: "configuration_json", type: "json", required: false },
            { name: "status", type: "text", required: false },
            { name: "provider_last_check", type: "date", required: false },
            { name: "provider_last_success", type: "date", required: false },
            { name: "provider_last_error", type: "date", required: false }
        ]
    });

    // 8. contract_signature_reviews
    await createOrUpdateCollection('contract_signature_reviews', {
        name: "contract_signature_reviews",
        type: "base",
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { name: "contract_id", type: "relation", collectionId: contractsCol.id, maxSelect: 1, required: true },
            { name: "reviewed_by", type: "relation", collectionId: usersCol.id, maxSelect: 1, required: true },
            { name: "reviewed_at", type: "date", required: true },
            { name: "decision", type: "text", required: true },
            { name: "comments", type: "text", required: false },
            { name: "evidence_id", type: "text", required: false }
        ]
    });

    // 9. signature_participants
    await createOrUpdateCollection('signature_participants', {
        name: "signature_participants",
        type: "base",
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { name: "contract_id", type: "relation", collectionId: contractsCol.id, maxSelect: 1, required: true },
            { name: "name", type: "text", required: true },
            { name: "email", type: "email", required: true },
            { name: "role", type: "text", required: true },
            { name: "sign_order", type: "number", required: true },
            { name: "status", type: "select", values: ["pending", "viewed", "signed", "rejected"], maxSelect: 1, required: false },
            { name: "signed_at", type: "date", required: false }
        ]
    });

    // 10. contract_evidence
    await createOrUpdateCollection('contract_evidence', {
        name: "contract_evidence",
        type: "base",
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { name: "tenant_id", type: "relation", collectionId: tenantsCol.id, maxSelect: 1, required: true },
            { name: "contract_id", type: "relation", collectionId: contractsCol.id, maxSelect: 1, required: true },
            { name: "contract_version_id", type: "relation", collectionId: contractVersionsCol.id, maxSelect: 1, required: false },
            { name: "evidence_type", type: "select", values: ["signed_pdf", "signed_scan", "manual_signature", "docusign_certificate", "email_acceptance", "payment_receipt", "identity_document", "other"], maxSelect: 1, required: true },
            { name: "file_id", type: "text", required: false },
            { name: "hash", type: "text", required: true },
            { name: "metadata_json", type: "json", required: false },
            { name: "uploaded_by", type: "relation", collectionId: usersCol.id, maxSelect: 1, required: true },
            { name: "uploaded_at", type: "date", required: true }
        ]
    });

}

updateSchema().catch(console.error);
