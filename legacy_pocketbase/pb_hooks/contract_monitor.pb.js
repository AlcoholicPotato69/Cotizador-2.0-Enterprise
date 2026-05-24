/// <reference path="../pb_data/types.d.ts" />

$app.cron().add("expiration_and_retention_engine", "0 0 * * *", () => {
    // Runs every day at midnight
    console.log("[Cron] Running Expiration & Retention Engine...");

    const auditUtil = require(`${__hooks}/utils/audit.js`);

    $app.dao().runInTransaction((txDao) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // 1. EXPIRATION ENGINE
        const contracts = txDao.findRecordsByFilter("contracts", "status='active' || status='expiring'");
        
        contracts.forEach(contract => {
            const validUntilStr = contract.get("valid_until");
            if (!validUntilStr) return;

            const validUntil = new Date(validUntilStr);
            const diffTime = validUntil - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let shouldAlert = false;
            let statusUpdate = null;

            if (diffDays <= 0) {
                statusUpdate = "expired";
                shouldAlert = true;
            } else if ([90, 60, 30, 15, 7, 1].includes(diffDays)) {
                if (contract.get("status") !== "expiring") {
                    statusUpdate = "expiring";
                }
                shouldAlert = true;
            } else if (diffDays < 90 && diffDays > 0) {
                if (contract.get("status") !== "expiring") {
                    statusUpdate = "expiring";
                }
            }

            if (statusUpdate) {
                contract.set("status", statusUpdate);
                try {
                    txDao.saveRecord(contract);
                    
                    // contract_status_history
                    const cshCol = txDao.findCollectionByNameOrId("contract_status_history");
                    const cshRec = new Record(cshCol);
                    cshRec.set("contract_id", contract.id);
                    cshRec.set("status", statusUpdate);
                    cshRec.set("changed_by", "system");
                    cshRec.set("tenant_id", contract.get("tenant_id"));
                    txDao.saveRecord(cshRec);
                } catch(e) {
                    console.log(`Failed to update status for contract ${contract.id}:`, e);
                }
            }

            if (shouldAlert) {
                let eventName = "CONTRACT_EXPIRING_" + diffDays;
                if (diffDays <= 0) {
                    eventName = "CONTRACT_EXPIRED";
                }
                
                const auditLog = new Record(txDao.findCollectionByNameOrId("audit_logs"));
                auditLog.set("action", eventName);
                auditLog.set("entity_type", "contracts");
                auditLog.set("entity_id", contract.id);
                auditLog.set("actor_id", "system");
                auditLog.set("actor_role", "system");
                auditLog.set("tenant_id", contract.get("tenant_id"));
                auditLog.set("details_json", JSON.stringify({ days_remaining: diffDays }));
                auditLog.set("log_hash", $security.randomString(32));
                txDao.saveRecord(auditLog);
            }
        });

        // 2. RETENTION ENGINE
        // Find documents that have exceeded retention_until and are NOT under legal hold
        const docs = txDao.findRecordsByFilter("documents", "legal_hold = false && status != 'purged'");
        
        docs.forEach(doc => {
            const retUntilStr = doc.get("retention_until");
            if (!retUntilStr) return;
            
            const retUntil = new Date(retUntilStr);
            if (now > retUntil) {
                // Purge Document
                doc.set("status", "purged");
                doc.set("purged_at", new Date().toISOString());
                // In a real physical implementation, we would call $app.dao().deleteFile(...)
                txDao.saveRecord(doc);
                
                // Audit Purge
                const auditLog = new Record(txDao.findCollectionByNameOrId("audit_logs"));
                auditLog.set("action", "DOCUMENT_PURGED");
                auditLog.set("entity_type", "documents");
                auditLog.set("entity_id", doc.id);
                auditLog.set("actor_id", "system");
                auditLog.set("actor_role", "system");
                auditLog.set("tenant_id", doc.get("tenant_id"));
                auditLog.set("details_json", JSON.stringify({ policy: doc.get("retention_policy") }));
                auditLog.set("log_hash", $security.randomString(32));
                txDao.saveRecord(auditLog);
            }
        });
    });
});
