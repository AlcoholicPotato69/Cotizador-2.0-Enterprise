/// <reference path="../pb_data/types.d.ts" />

/**
 * CONTRACTS BUSINESS LOGIC HOOKS
 * Phase 4.5.1 Hardened Core Engine
 */

onRecordCreateRequest((e) => {
    // 1. Enforce Source Purity - Strip external IDs to prevent manual injection
    e.record.set("tenant_id", "");
    e.record.set("client_id", "");

    const quoteVersionId = e.record.get("source_quote_version_id");
    const contractVersionId = e.record.get("source_contract_version_id");
    
    if (!quoteVersionId && !contractVersionId) {
        throw new BadRequestError("CONTRACT_SOURCE_MISSING: A contract must originate from a quote version or a previous contract version.");
    }
    
    let sourceSnapshotRaw = null;
    let changeNotes = "";
    let sourceQuoteId = "";
    let sourceHash = "";

    if (quoteVersionId) {
        const quoteVersion = $app.findRecordById("quote_versions", quoteVersionId);
        if (!quoteVersion) throw new BadRequestError("CONTRACT_SOURCE_INVALID: The referenced quote version does not exist.");
        changeNotes = quoteVersion.get("change_notes");
        sourceSnapshotRaw = quoteVersion.get("snapshot_data");
        sourceQuoteId = quoteVersion.get("quote_id");
        sourceHash = quoteVersion.get("snapshot_hash");
        
        if (changeNotes !== "FINAL_APPROVED_SNAPSHOT") {
            throw new BadRequestError("NOT_FINAL_SNAPSHOT: Contracts originating from quotes must use the FINAL_APPROVED_SNAPSHOT.");
        }
    } else {
        const contractVersion = $app.findRecordById("contract_versions", contractVersionId);
        if (!contractVersion) throw new BadRequestError("CONTRACT_SOURCE_INVALID: The referenced contract version does not exist.");
        sourceSnapshotRaw = contractVersion.get("snapshot_data");
        sourceQuoteId = contractVersion.get("quote_id") || e.record.get("quote_id");
        sourceHash = contractVersion.get("snapshot_hash");
    }
    
    // 2. Extract Data Exclusively from Snapshot (Source Purity Rule)
    let snapshotData = null;
    if (typeof sourceSnapshotRaw === "string") {
        try { snapshotData = JSON.parse(sourceSnapshotRaw); } catch (ex) {}
    } else if (sourceSnapshotRaw) {
        try { snapshotData = JSON.parse(JSON.stringify(sourceSnapshotRaw)); } catch (ex) {}
    }
    if (Array.isArray(snapshotData) && snapshotData.length > 0 && typeof snapshotData[0] === 'number') {
        try { snapshotData = JSON.parse(String.fromCharCode.apply(null, snapshotData)); } catch(e) {}
    }
    
    if (!snapshotData) {
        throw new BadRequestError("SNAPSHOT_CORRUPTED: The snapshot data could not be parsed.");
    }
    
    // Inject operational references directly from snapshot
    if (snapshotData.tenant_data && snapshotData.tenant_data.id) e.record.set("tenant_id", snapshotData.tenant_data.id);
    if (snapshotData.client_data && snapshotData.client_data.id) e.record.set("client_id", snapshotData.client_data.id);
    
    // Template Traceability
    if (snapshotData.template_data && snapshotData.template_data.id) {
        e.record.set("template_id", snapshotData.template_data.id);
        e.record.set("template_name", snapshotData.template_data.name);
        e.record.set("template_version", snapshotData.template_data.version);
        e.record.set("template_hash", snapshotData.template_data.template_hash || "");
    }
    
    e.record.set("quote_id", sourceQuoteId);
    e.record.set("source_snapshot_hash", sourceHash);
    
    // 3. Folio Generation (Unconditional override to enforce backend purity)
    if (!e.record.get("folio") || e.record.get("folio") === "mock") {
        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(1000 + Math.random() * 9000);
        e.record.set("folio", `CON-${yyyy}${mm}${dd}-${random}`);
    }
    
    // 4. Defaults & Legal Hold Check
    e.record.set("status", "draft");
    e.record.set("signature_status", "unsigned");
    e.record.set("signature_state", "unsigned");
    e.record.set("current_version", 1);
    e.record.set("legal_hold", false);
    
    if (!e.record.get("created_by") && e.auth) {
        e.record.set("created_by", e.auth.id);
    }

    if (!e.record.get("parent_contract_id")) {
        e.record.set("renewal_number", 0);
    }

    // Date Validation
    const vFromCreate = e.record.get("valid_from");
    const vUntilCreate = e.record.get("valid_until");
    if (vFromCreate && vUntilCreate && String(vFromCreate) > String(vUntilCreate)) {
        throw new BadRequestError("DATE_VALIDATION_FAILED: valid_from must be before valid_until.");
    }
    
    // Execute Save
    const result = e.next();
    
    // AFTER SUCCESS LOGIC
    try {
        // Create initial Contract Version snapshot
        const versionCollection = $app.findCollectionByNameOrId("contract_versions");
        const vRecord = new Record(versionCollection);
        
        vRecord.set("contract_id", e.record.id);
        vRecord.set("version_number", 1);
        vRecord.set("created_by", e.record.get("created_by"));
        vRecord.set("source_quote_hash", e.record.get("source_snapshot_hash"));
        
        // Contract specific snapshot injection
        snapshotData.contract_folio = e.record.get("folio");
        
        const payloadString = JSON.stringify(snapshotData);
        const auditUtil = require(`${__hooks}/utils/audit.js`);
        const hash = auditUtil.sha256(payloadString);
        
        vRecord.set("snapshot_data", snapshotData);
        vRecord.set("snapshot_hash", hash);
        
        $app.save(vRecord);
        
        // Register History
        const historyCollection = $app.findCollectionByNameOrId("contract_status_history");
        const historyRecord = new Record(historyCollection);
        historyRecord.set("contract_id", e.record.id);
        historyRecord.set("old_status", "none");
        historyRecord.set("new_status", "draft");
        // Use the original creator unconditionally to avoid Goja relation mapping errors with Superusers
        let changedById = e.record.get("created_by");
        historyRecord.set("changed_by", changedById);
        historyRecord.set("reason", "Contract Creation");
        $app.save(historyRecord);
        
        // Audit Log
        auditUtil.createAuditLog(
            e.record.get("parent_contract_id") ? "CONTRACT_RENEWED" : "CONTRACT_CREATED", 
            "contract", 
            e.record.id, 
            1, 
            e.auth ? e.auth.id : "system",
            e.record.get("tenant_id"),
            e.httpContext ? e.httpContext.request() : null,
            hash,
            { folio: e.record.get("folio"), source_quote_hash: e.record.get("source_snapshot_hash") },
            $app
        );
        
        // Update removed to enforce Source Purity: No querying or modifying `quotes` directly during contract creation.
    } catch(err) {
        console.error("Error creating initial contract version:", err);
    }
    
    return result;
}, "contracts");


// Freeze Contract Versions (Snapshot Seal)
onRecordUpdateRequest((e) => {
    throw new BadRequestError("SNAPSHOT_SEAL_ACTIVE: contract_versions cannot be modified via API.");
}, "contract_versions");

onRecordDeleteRequest((e) => {
    throw new BadRequestError("SNAPSHOT_SEAL_ACTIVE: contract_versions cannot be deleted via API.");
}, "contract_versions");


// Contract Updates (Lifecycle Engine, Seal Verification, Date Validation, Legal Hold)
onRecordUpdateRequest((e) => {
    const originalRecords = $app.findRecordsByFilter("contracts", "id='" + e.record.id + "'");
    const originalRecord = originalRecords[0];
    
    // LEGAL HOLD ENFORCEMENT
    const rawOriginal = originalRecord.get("legal_hold");
    const rawNew = e.record.get("legal_hold");
    const originalHold = (rawOriginal === true || rawOriginal === "true" || rawOriginal === 1);
    const newHold = (rawNew === true || rawNew === "true" || rawNew === 1);
    
    if (originalHold && newHold) {
        throw new BadRequestError("LEGAL_HOLD_ACTIVE: This contract is under a Legal Hold. Modifications are strictly prohibited until the hold is released.");
    }
    if (!originalHold && newHold) {
        // We are placing it under legal hold. Audit it.
        const auditUtil = require(`${__hooks}/utils/audit.js`);
        auditUtil.createAuditLog("LEGAL_HOLD_ENABLED", "contract", e.record.id, 1, e.auth ? e.auth.id : "system", e.record.get("tenant_id"), null, "", { reason: e.record.get("legal_hold_reason") }, $app);
    }
    if (originalHold && !newHold) {
        const auditUtil = require(`${__hooks}/utils/audit.js`);
        auditUtil.createAuditLog("LEGAL_HOLD_DISABLED", "contract", e.record.id, 1, e.auth ? e.auth.id : "system", e.record.get("tenant_id"), null, "", {}, $app);
    }
    
    console.log("SEAL DEBUG -> Old Folio:", originalRecord.get("folio"), "New Folio:", e.record.get("folio"));
    // SEAL VERIFICATION: Block modifications to source hashes
    if (e.record.get("source_quote_version_id") !== originalRecord.get("source_quote_version_id") ||
        e.record.get("source_snapshot_hash") !== originalRecord.get("source_snapshot_hash") ||
        e.record.get("folio") !== originalRecord.get("folio")) {
        throw new BadRequestError("SNAPSHOT_SEAL_ACTIVE: Contract source definitions and folio cannot be modified.");
    }

    const oldStatus = originalRecord.get("status");
    const newStatus = e.record.get("status");
    
    const oldSignature = originalRecord.get("signature_status");
    const newSignature = e.record.get("signature_status");

    // LIFECYCLE ENGINE: Strict State Machine Validation
    if (oldStatus !== newStatus) {
        const allowedStatusTransitions = {
            "draft": ["pending_signature", "active", "terminated"], 
            "pending_signature": ["signed", "terminated", "expired"],
            "signed": ["active", "terminated"],
            "active": ["expiring", "renewal_pending", "suspended", "terminated", "expired", "archived"],
            "expiring": ["active", "renewal_pending", "expired", "terminated"],
            "renewal_pending": ["renewed", "active", "expired", "terminated"],
            "renewed": [], // Terminal state for historical contract
            "suspended": ["active", "terminated"],
            "terminated": ["archived"],
            "expired": ["archived"],
            "archived": []
        };
        
        if (!allowedStatusTransitions[oldStatus] || !allowedStatusTransitions[oldStatus].includes(newStatus)) {
            throw new BadRequestError(`LIFECYCLE_ERROR: Invalid transition from ${oldStatus} to ${newStatus}`);
        }
    }

    if (oldSignature !== newSignature) {
        const allowedSigTransitions = {
            "unsigned": ["pending", "sent"],
            "pending": ["sent", "signed", "rejected", "cancelled"],
            "sent": ["viewed", "signed", "rejected", "expired", "cancelled"],
            "viewed": ["signed", "rejected", "expired", "cancelled"],
            "signed": [],
            "rejected": ["pending", "sent"], // Can restart workflow
            "expired": ["pending", "sent"], // Can restart workflow
            "cancelled": ["pending"]
        };

        if (!allowedSigTransitions[oldSignature] || !allowedSigTransitions[oldSignature].includes(newSignature)) {
            throw new BadRequestError(`SIGNATURE_LIFECYCLE_ERROR: Invalid transition from ${oldSignature} to ${newSignature}`);
        }
        
        // MANUAL REVIEW ENGINE ENFORCEMENT
        if (newSignature === "signed" && e.record.get("signature_mode") === "manual") {
            const reviews = $app.findRecordsByFilter("contract_signature_reviews", `contract_id='${e.record.id}' && decision='approved'`);
            if (!reviews || reviews.length === 0) {
                throw new BadRequestError("MANUAL_SIGNATURE_UNREVIEWED: Manual signatures cannot transition to signed without an approved review in contract_signature_reviews.");
            }
        }
    }

    // DATE VALIDATION ENGINE
    const vFromUpdate = e.record.get("valid_from");
    const vUntilUpdate = e.record.get("valid_until");
    if (vFromUpdate && vUntilUpdate && String(vFromUpdate) > String(vUntilUpdate)) {
        throw new BadRequestError("DATE_VALIDATION_FAILED: valid_from must be before valid_until.");
    }

    // Determine event type for Audit Trail
    let eventType = "CONTRACT_UPDATED";
    if (newSignature === "signed" && oldSignature !== "signed") eventType = "CONTRACT_SIGNED";
    if (newStatus === "terminated" && oldStatus !== "terminated") eventType = "CONTRACT_TERMINATED";
    if (newStatus === "expired" && oldStatus !== "expired") eventType = "CONTRACT_EXPIRED";

    // Execute Save
    const result = e.next();
    
    // Status Transitions History Logging
    if (oldStatus !== newStatus || oldSignature !== newSignature) {
        const historyCollection = $app.findCollectionByNameOrId("contract_status_history");
        const historyRecord = new Record(historyCollection);
        historyRecord.set("contract_id", e.record.id);
        historyRecord.set("old_status", oldStatus !== newStatus ? oldStatus : oldSignature);
        historyRecord.set("new_status", oldStatus !== newStatus ? newStatus : newSignature);
        let changedById = e.record.get("created_by");
        historyRecord.set("changed_by", changedById);
        
        let reason = "State transition";
        if (e.httpContext) {
            try { reason = e.httpContext.queryParam("reason") || reason; } catch(ex) {}
        }
        historyRecord.set("reason", reason);
        $app.save(historyRecord);
    }
    
    // Audit Log
    try {
        const auditUtil = require(`${__hooks}/utils/audit.js`);
        auditUtil.createAuditLog(
            eventType, 
            "contract", 
            e.record.id, 
            e.record.get("current_version"), 
            e.auth ? e.auth.id : "system",
            e.record.get("tenant_id"),
            e.httpContext ? e.httpContext.request() : null,
            "", // no new hash generated just for state update
            { old_status: oldStatus, new_status: newStatus, signature: newSignature },
            $app
        );
    } catch(err) {
        console.error("Audit log error on contract update:", err);
    }
    
    return result;
}, "contracts");
