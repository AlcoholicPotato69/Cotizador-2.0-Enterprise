/// <reference path="../pb_data/types.d.ts" />

cronAdd("contract_expiration_monitor", "0 0 * * *", () => {
    // Runs every day at midnight
    console.log("Running contract expiration monitor...");

    const auditUtil = require(`${__hooks}/utils/audit.js`);

    $app.dao().runInTransaction((txDao) => {
        // Find active or expiring contracts
        const contracts = txDao.findRecordsByFilter("contracts", "status='active' || status='expiring'");
        
        const now = new Date();
        now.setHours(0, 0, 0, 0);

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
            } else if (diffDays === 1 || diffDays === 7 || diffDays === 15 || diffDays === 30) {
                if (contract.get("status") !== "expiring") {
                    statusUpdate = "expiring";
                }
                shouldAlert = true;
            } else if (diffDays < 30 && diffDays > 0) {
                // Ensure status is expiring
                if (contract.get("status") !== "expiring") {
                    statusUpdate = "expiring";
                }
            }

            if (statusUpdate) {
                contract.set("status", statusUpdate);
                // Save bypassing hooks if needed, but usually we just save
                try {
                    txDao.saveRecord(contract);
                } catch(e) {
                    console.log(`Failed to update status for contract ${contract.id}:`, e);
                }
            }

            if (shouldAlert) {
                // Generate Audit Log acting as the "Event"
                const eventName = diffDays <= 0 ? "CONTRACT_EXPIRED" : "CONTRACT_EXPIRING";
                auditUtil.createAuditLog(
                    eventName, 
                    "contract", 
                    contract.id, 
                    1, 
                    "system", 
                    contract.get("tenant_id"), 
                    null, 
                    "", 
                    { days_remaining: diffDays }, 
                    $app
                );
            }
        });
    });
});
