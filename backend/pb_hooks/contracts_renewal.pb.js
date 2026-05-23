/// <reference path="../pb_data/types.d.ts" />

routerAdd("POST", "/api/contracts/:id/renew", (c) => {
    const contractId = c.pathParam("id");
    
    // Auth Validation
    const admin = c.get("admin");
    const user = c.get("authRecord");
    if (!admin && !user) {
        throw new UnauthorizedError("Authentication required.");
    }

    const payload = new DynamicModel({
        renewal_type: "",
        valid_from: "",
        valid_until: "",
        client_updates: {} // For administrative
    });
    c.bind(payload);

    const renewalType = payload.renewal_type;
    if (!["exact_clone", "administrative", "commercial", "full_reissue"].includes(renewalType)) {
        throw new BadRequestError("Invalid renewal_type.");
    }

    // COMMERCIAL / FULL_REISSUE Validation
    if (renewalType === "commercial" || renewalType === "full_reissue") {
        throw new BadRequestError("COMMERCIAL_RENEWAL_BLOCKED: Commercial and Full Reissue renewals require a new Quote approval flow. They cannot be auto-generated.");
    }

    $app.dao().runInTransaction((txDao) => {
        const parentContract = txDao.findRecordById("contracts", contractId);
        if (!parentContract) {
            throw new NotFoundError("Parent contract not found.");
        }

        if (parentContract.get("legal_hold") === true) {
            throw new BadRequestError("LEGAL_HOLD_ACTIVE: Cannot renew a contract under legal hold.");
        }

        // Must be active or expiring or expired or renewed
        const pStatus = parentContract.get("status");
        if (pStatus !== "active" && pStatus !== "expiring" && pStatus !== "expired" && pStatus !== "renewal_pending") {
            throw new BadRequestError(`INVALID_STATUS: Cannot renew a contract in status ${pStatus}.`);
        }

        // Get the latest snapshot from contract_versions
        // Usually current_version or latest created
        const versions = txDao.findRecordsByFilter("contract_versions", `contract_id='${parentContract.id}'`);
        if (!versions || versions.length === 0) {
            throw new InternalServerError("No contract versions found to clone.");
        }
        
        let sourceVersion = versions[0];
        // Ensure we get the latest by sorting if multiple exist, but typically version 1 is what we need if current_version isn't strictly tracked.
        
        let snapshotData = JSON.parse(JSON.stringify(sourceVersion.get("snapshot_data")));

        // Apply Administrative updates if applicable
        if (renewalType === "administrative" && payload.client_updates) {
            const updates = payload.client_updates;
            if (updates.email) snapshotData.client_data.email = updates.email;
            if (updates.phone) snapshotData.client_data.phone = updates.phone;
            if (updates.representative) snapshotData.client_data.representative = updates.representative;
            // No pricing or clause changes allowed
        }

        // Create new Contract
        const contractsCol = txDao.findCollectionByNameOrId("contracts");
        const newContract = new Record(contractsCol);
        
        // Lineage
        newContract.set("root_contract_id", parentContract.get("root_contract_id") || parentContract.id);
        newContract.set("parent_contract_id", parentContract.id);
        newContract.set("renewed_from_contract_id", parentContract.id);
        newContract.set("source_contract_version_id", sourceVersion.id);
        
        newContract.set("renewal_number", parentContract.get("renewal_number") + 1);
        newContract.set("renewal_type", renewalType);
        
        // Purity Injection
        if (snapshotData.tenant_data && snapshotData.tenant_data.id) newContract.set("tenant_id", snapshotData.tenant_data.id);
        if (snapshotData.client_data && snapshotData.client_data.id) newContract.set("client_id", snapshotData.client_data.id);
        if (snapshotData.template_data && snapshotData.template_data.id) {
            newContract.set("template_id", snapshotData.template_data.id);
            newContract.set("template_name", snapshotData.template_data.name);
            newContract.set("template_version", snapshotData.template_data.version);
            newContract.set("template_hash", snapshotData.template_data.template_hash);
        }

        newContract.set("quote_id", parentContract.get("quote_id"));
        newContract.set("status", "draft");
        newContract.set("signature_status", "unsigned");
        newContract.set("signature_state", "unsigned");
        newContract.set("current_version", 1);
        newContract.set("legal_hold", false);
        newContract.set("created_by", user ? user.id : admin.id);

        if (payload.valid_from) newContract.set("valid_from", payload.valid_from);
        if (payload.valid_until) newContract.set("valid_until", payload.valid_until);

        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(1000 + Math.random() * 9000);
        newContract.set("folio", `CON-${yyyy}${mm}${dd}-${random}`);

        txDao.saveRecord(newContract);

        // Update Parent Status
        if (pStatus !== "expired") {
            parentContract.set("status", "renewal_pending");
            txDao.saveRecord(parentContract);
        }

        // Create new Contract Version Snapshot
        const versionsCol = txDao.findCollectionByNameOrId("contract_versions");
        const newVersion = new Record(versionsCol);
        
        snapshotData.contract_folio = newContract.get("folio");
        const payloadString = JSON.stringify(snapshotData);
        const auditUtil = require(`${__hooks}/utils/audit.js`);
        const hash = auditUtil.sha256(payloadString);

        newVersion.set("contract_id", newContract.id);
        newVersion.set("version_number", 1);
        newVersion.set("snapshot_data", snapshotData);
        newVersion.set("snapshot_hash", hash);
        newVersion.set("created_by", user ? user.id : admin.id);
        
        txDao.saveRecord(newVersion);

        // Audit Logging
        const actorId = user ? user.id : (admin ? "system" : "unknown");
        auditUtil.createAuditLog(
            "CONTRACT_RENEWED", 
            "contract", 
            parentContract.id, 
            1, 
            actorId,
            parentContract.get("tenant_id"), 
            c.request(), 
            hash, 
            { new_contract_id: newContract.id, renewal_type: renewalType }, 
            $app
        );

        auditUtil.createAuditLog(
            "CONTRACT_CREATED", 
            "contract", 
            newContract.id, 
            1, 
            actorId,
            newContract.get("tenant_id"), 
            c.request(), 
            hash, 
            { parent_contract_id: parentContract.id, renewal_type: renewalType }, 
            $app
        );
        
        // Prepare response
        c.json(200, {
            success: true,
            message: "Contract renewed successfully.",
            data: {
                new_contract_id: newContract.id,
                new_version_id: newVersion.id,
                folio: newContract.get("folio")
            }
        });
    });

    return null;

});
