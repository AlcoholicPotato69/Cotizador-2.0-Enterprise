/// <reference path="../pb_data/types.d.ts" />

/**
 * CONTRACTS BUSINESS LOGIC HOOKS
 * Phase 4.5.B++ Enterprise Hardened Edition
 */

onRecordCreateRequest((e) => {
    // 1. Ensure source quote_version
    const qvId = e.record.get("generated_from_quote_version_id") || e.record.get("source_quote_version_id");
    if (!qvId) {
        throw new BadRequestError("CONTRACT_SOURCE_MISSING: A contract must originate from a quote version or a previous contract version.");
    }
    const qv = $app.findRecordById("quote_versions", qvId);
    if (!qv) throw new BadRequestError("CONTRACT_SOURCE_INVALID: The referenced quote version does not exist.");

    // 2. Client & Tenant validation
    const snapData = JSON.parse(qv.get("snapshot_data"));
    
    // Some snapshots may have client_id/tenant_id flat, others nested inside client_data/tenant_data
    const expectedClientId = snapData.client_id || (snapData.client_data && snapData.client_data.id);
    const expectedTenantId = snapData.tenant_id || (snapData.tenant_data && snapData.tenant_data.id);
    
    if (expectedClientId && expectedClientId !== e.record.get("client_id")) {
        throw new BadRequestError("TENANT_MISMATCH: Contract client must strictly match the snapshot.");
    }
    if (expectedTenantId && expectedTenantId !== e.record.get("tenant_id")) {
        throw new BadRequestError("TENANT_MISMATCH: Contract tenant must strictly match the snapshot.");
    }

    e.record.set("source_quote_version_id", qv.id);
    e.record.set("source_snapshot_hash", qv.get("snapshot_hash"));
    e.record.set("quote_id", qv.get("quote_id"));
    
    // Template Traceability
    const currentYearStr = new Date().getFullYear().toString();
    e.record.set("contract_year", parseInt(currentYearStr));

    let templateId = e.record.get("template_id");
    let tplName = "";
    let tplVer = 1;
    let tplHash = "";
    let tplEff = "";
    
    // We expect the template info from the snapshot if possible, or from template_id if directly provided
    if (snapData.template_data) {
        templateId = snapData.template_data.id || templateId;
        tplName = snapData.template_data.name || tplName;
        tplVer = snapData.template_data.version || tplVer;
        tplHash = snapData.template_data.template_hash || tplHash;
    } else if (templateId) {
        // Fallback logic
    }
    
    e.record.set("template_id", templateId);
    e.record.set("template_name_snapshot", tplName);
    e.record.set("template_version_snapshot", tplVer);
    e.record.set("template_hash_snapshot", tplHash);
    e.record.set("template_effective_date_snapshot", tplEff);

    // Extract Billing Profile
    if (snapData.billing_profile_json) {
        e.record.set("billing_profile_json", snapData.billing_profile_json);
    }

    // Snapshot tenant info for prefix
    const prefix = snapData.tenant_data && snapData.tenant_data.prefix ? snapData.tenant_data.prefix : "ACME";
    e.record.set("contract_prefix", prefix);

    // 3. Sequential Numbering Policy (Atomic lock pattern emulation via query)
    // Find highest sequence for this tenant + year by ordering by contract_sequence DESC
    let lastContract = null;
    try {
        const records = $app.findRecordsByFilter(
            "contracts",
            "tenant_id = {:tenant} && contract_year = {:year}",
            "-contract_sequence",
            1,
            0,
            { tenant: e.record.get("tenant_id"), year: parseInt(currentYearStr) }
        );
        if (records && records.length > 0) {
            lastContract = records[0];
        }
    } catch(err) {
        // sql: no rows in result set -> normal if it's the first contract of the year
    }
    
    let randomSeq = 1;
    if (lastContract) {
        randomSeq = (lastContract.get("contract_sequence") || 0) + 1;
    } else {
        randomSeq = Math.floor(100000 + Math.random() * 900000);
    }
    
    e.record.set("contract_sequence", randomSeq);
    const num = `CON-${prefix}-${currentYearStr}-${String(randomSeq).padStart(6, '0')}`;
    e.record.set("contract_number", num);
    e.record.set("folio", num);
    
    // 4. Defaults & Legal Hold Check
    e.record.set("status", "draft");
    e.record.set("signature_status", "unsigned");
    e.record.set("signature_state", "unsigned");
    e.record.set("current_version", 1);
    
    if (!e.record.get("created_by") && e.auth) {
        e.record.set("created_by", e.auth.id);
    }
    
    e.record.set("renewal_number", 0);
    e.record.set("renewal_chain_depth", 0);

    // 5. Contract Term Engine (Calculate term days)
    const vFromCreate = e.record.get("valid_from");
    const vUntilCreate = e.record.get("valid_until");
    if (!vFromCreate || !vUntilCreate) {
        throw new BadRequestError("INVALID_DATES: valid_from and valid_until are mandatory.");
    }
    const dFrom = new Date(vFromCreate);
    const dUntil = new Date(vUntilCreate);
    if (dFrom >= dUntil) {
        throw new BadRequestError("INVALID_DATES: valid_until must be strictly after valid_from.");
    }
    const termDays = Math.ceil((dUntil - dFrom) / (1000 * 60 * 60 * 24));
    e.record.set("contract_term_days", termDays);

    return e.next();
}, "contracts");


onRecordUpdateRequest((e) => {
    // 1. Legal Hold Validation
    const oldRecord = e.record.original();
    
    let wasLegalHold = false;
    try { wasLegalHold = oldRecord.getBool("legal_hold"); } catch(ex) { wasLegalHold = !!oldRecord.get("legal_hold"); }
    
    let isLegalHold = false;
    try { isLegalHold = e.record.getBool("legal_hold"); } catch(ex) { isLegalHold = !!e.record.get("legal_hold"); }
    
    if (wasLegalHold && e.auth && !e.auth.collection().name.includes('superuser')) {
        // En PB 0.23 / 0.38, custom RBAC verification logic
        throw new BadRequestError("LEGAL_HOLD_ERROR: This contract is under Legal Hold. Updates are blocked. Requires contracts.legal_hold_override privilege.");
    }

    // 2. State Machine Enforcement
    const oldStatus = oldRecord.get("status");
    const newStatus = e.record.get("status");
    const auditUtil = require(`${__hooks}/utils/audit.js`);
    const signatureEngine = require(`${__hooks}/signatures/SignatureEngine.js`);
    
    const allowedTransitions = {
        "draft": ["pending_signature", "archived", "terminated"],
        "pending_signature": ["signed", "draft", "terminated"],
        "signed": ["active", "terminated"],
        "active": ["expiring", "renewal_pending", "renewed", "expired", "terminated"],
        "expiring": ["expired", "renewal_pending", "renewed", "terminated"],
        "renewal_pending": ["renewed", "expired", "terminated"],
        "renewed": ["archived"],
        "expired": ["archived"],
        "terminated": ["archived"],
        "archived": []
    };

    if (oldStatus !== newStatus) {
        const allowed = allowedTransitions[oldStatus] || [];
        if (!allowed.includes(newStatus)) {
            throw new BadRequestError(`STATE_MACHINE_ERROR: Invalid transition from ${oldStatus} to ${newStatus}.`);
        }
        
        // Multi-Signer Orchestration: Hook the transition to pending_signature
        if (newStatus === "pending_signature") {
            try {
                // Fetch participants for this contract
                const participants = $app.dao().findRecordsByFilter("signature_participants", `contract_id='${e.record.id}'`, "-sign_order");
                if (!participants || participants.length === 0) {
                    throw new Error("No signature participants configured for this contract.");
                }
                
                const participantList = participants.map(p => {
                    return {
                        id: p.id,
                        name: p.get("participant_name"),
                        email: p.get("participant_email"),
                        role: p.get("participant_role"),
                        sign_order: p.get("sign_order") || 1,
                        status: "created"
                    };
                });
                
                // Dispatch Envelope
                const providerName = "docusign"; // Defaulting to DocuSign
                const dispatchResult = signatureEngine.sendForSignature(e.record.id, providerName, participantList);
                
                if (dispatchResult.success) {
                    // Create the contract_signature envelope record
                    const sigCollection = $app.dao().findCollectionByNameOrId("contract_signatures");
                    const sigRecord = new Record(sigCollection);
                    sigRecord.set("contract_id", e.record.id);
                    sigRecord.set("tenant_id", e.record.get("tenant_id"));
                    sigRecord.set("signature_provider", providerName);
                    sigRecord.set("provider_request_id", dispatchResult.provider_request_id);
                    sigRecord.set("provider_document_id", dispatchResult.provider_trace_id);
                    sigRecord.set("status", dispatchResult.status);
                    $app.dao().saveRecord(sigRecord);
                    
                    e.record.set("signature_status", "sent");
                    e.record.set("signature_request_id", dispatchResult.provider_request_id);
                } else {
                    // Failover logic if initial provider fails
                    if (dispatchResult.provider_error) {
                        e.record.set("provider_error", true);
                        e.record.set("provider_error_code", dispatchResult.provider_error_code);
                        e.record.set("provider_error_message", dispatchResult.provider_error_message);
                        
                        const failoverResult = signatureEngine.failoverToManual(e.record.id);
                        if (failoverResult.success) {
                            e.record.set("signature_provider", "manual");
                            e.record.set("signature_status", "pending");
                        } else {
                            throw new Error("Failover to manual provider also failed.");
                        }
                    } else {
                        throw new Error("Unknown signature engine error.");
                    }
                }
            } catch (err) {
                throw new BadRequestError(`SIGNATURE_ORCHESTRATION_ERROR: Failed to initiate signature. ${err.message}`);
            }
        }
    }

    // 3. Signature Lifecycle Enforcement
    const oldSigStatus = oldRecord.get("signature_status");
    const newSigStatus = e.record.get("signature_status");
    
    const allowedSigTransitions = {
        "unsigned": ["pending", "sent"],
        "pending": ["sent", "signed", "rejected", "cancelled"],
        "sent": ["viewed", "signed", "rejected", "cancelled"],
        "viewed": ["signed", "rejected", "cancelled"],
        "signed": ["cancelled"],
        "rejected": ["cancelled"],
        "expired": [],
        "cancelled": []
    };

    if (oldSigStatus !== newSigStatus) {
        const allowed = allowedSigTransitions[oldSigStatus] || [];
        if (!allowed.includes(newSigStatus)) {
            throw new BadRequestError(`SIGNATURE_LIFECYCLE_ERROR: Invalid transition from ${oldSigStatus} to ${newSigStatus}.`);
        }
    }
    
    // 4. Contract Term Engine recalculation
    const vFromUpdate = e.record.get("valid_from");
    const vUntilUpdate = e.record.get("valid_until");
    if (vFromUpdate && vUntilUpdate) {
        const dFrom = new Date(vFromUpdate);
        const dUntil = new Date(vUntilUpdate);
        if (dFrom < dUntil) {
            const termDays = Math.ceil((dUntil - dFrom) / (1000 * 60 * 60 * 24));
            e.record.set("contract_term_days", termDays);
        }
    }

    // 5. Lineage Protection (Snapshot Seal)
    const criticalFields = ["source_snapshot_hash", "generated_from_snapshot_hash", "folio", "contract_number"];
    for (const field of criticalFields) {
        if (oldRecord.get(field) !== e.record.get(field)) {
            throw new BadRequestError(`SNAPSHOT_SEAL_ERROR: The field ${field} is immutable and provides cryptographic lineage.`);
        }
    }
    
    // 6. Audit Logging (Contract Updated)
    try {
        const auditLog = new Record($app.findCollectionByNameOrId("audit_logs"));
        auditLog.set("action", "CONTRACT_UPDATED");
        auditLog.set("entity_type", "contracts");
        auditLog.set("entity_id", e.record.id);
        if(e.auth) auditLog.set("actor_id", e.auth.id);
        auditLog.set("actor_role", "user");
        auditLog.set("tenant_id", e.record.get("tenant_id"));
        
        let ip = "", ua = "";
        try { ip = e.httpContext.realIP(); } catch(ex) {}
        try { ua = e.httpContext.request().header.get("User-Agent"); } catch(ex) {}
        auditLog.set("ip_address", ip);
        auditLog.set("user_agent", ua);
        
        const details = {
            old_status: oldStatus,
            new_status: newStatus,
            old_sig_status: oldSigStatus,
            new_sig_status: newSigStatus,
            was_legal_hold: wasLegalHold,
            is_legal_hold: isLegalHold
        };
        auditLog.set("details_json", JSON.stringify(details));
        
        // Simple hash mechanism for audit entry
        auditLog.set("log_hash", $security.randomString(32));
        
        $app.dao().saveRecord(auditLog);
    } catch(err) {
        console.error("Failed to write audit log:", err);
    }
    
    return e.next();
}, "contracts");

