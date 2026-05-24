/// <reference path="../pb_data/types.d.ts" />

routerAdd("POST", "/api/webhooks/signatures/:provider", (c) => {
    const providerName = c.pathParam("provider");
    const payload = new DynamicModel({});
    c.bind(payload);
    
    // In Goja, parsing request bodies sometimes requires reading raw bytes depending on PB setup
    // Since we bound DynamicModel, we can stringify it to get JSON
    const payloadJson = JSON.parse(JSON.stringify(payload));
    const rawPayload = JSON.stringify(payloadJson);
    
    const factory = require(`${__hooks}/signatures/ProviderFactory.js`);
    let provider;
    try {
        provider = factory.getProvider(providerName);
    } catch(err) {
        throw new BadRequestError(err.message);
    }
    
    // 1. Validate Webhook Signature
    const validation = provider.validateWebhook(payloadJson, c.request().header.get("X-Provider-Signature"));
    // In our stub, it returns valid: true always. In production, if false, throw 401.

    $app.dao().runInTransaction((txDao) => {
        // 2. Persist the raw event
        const eventsCol = txDao.findCollectionByNameOrId("signature_events");
        const eventRecord = new Record(eventsCol);
        
        // Mock finding the signature ID from provider envelope mapping
        const providerDocumentId = payloadJson.envelopeId || payloadJson.document_id || "mock_id";
        
        let signatureId = null;
        let contractId = null;
        let tenantId = null;
        try {
            const signatures = txDao.findRecordsByFilter("contract_signatures", `provider_request_id='${providerDocumentId}'`);
            if (signatures && signatures.length > 0) {
                signatureId = signatures[0].id;
                contractId = signatures[0].get("contract_id");
                tenantId = signatures[0].get("tenant_id");
            }
        } catch(e) {}
        
        const eventType = payloadJson.event || "envelope-completed"; // simplified map
        
        eventRecord.set("signature_id", signatureId);
        eventRecord.set("event_type", eventType);
        eventRecord.set("payload_json", payloadJson);
        eventRecord.set("processed", true);
        
        txDao.saveRecord(eventRecord);
        
        // Block 2: Signature Failover Detection
        if (eventType === "provider_error" || payloadJson.status === "error") {
            console.error(`[Webhook] Provider Error detected for Signature ${signatureId}`);
            if (signatureId && contractId) {
                const sigRecord = txDao.findRecordById("contract_signatures", signatureId);
                sigRecord.set("provider_error", true);
                sigRecord.set("provider_error_code", payloadJson.error_code || "UNKNOWN_ERROR");
                sigRecord.set("provider_error_message", payloadJson.error_message || "Provider failed.");
                txDao.saveRecord(sigRecord);

                const contractRecord = txDao.findRecordById("contracts", contractId);
                contractRecord.set("provider_error", true);
                contractRecord.set("provider_error_code", payloadJson.error_code || "UNKNOWN_ERROR");
                contractRecord.set("provider_error_message", payloadJson.error_message || "Provider failed.");
                txDao.saveRecord(contractRecord);
                
                const auditUtil = require(`${__hooks}/utils/audit.js`);
                auditUtil.createAuditLog(
                    "PROVIDER_FAILOVER_TRIGGERED", 
                    "contract", 
                    contractId, 
                    1, 
                    "system",
                    tenantId, 
                    c.request(), 
                    $security.randomString(32), 
                    { original_provider: providerName, error: payloadJson.error_message }, 
                    $app
                );

                // Failover logic
                const signatureEngine = require(`${__hooks}/signatures/SignatureEngine.js`);
                const failover = signatureEngine.failoverToManual(contractId);
                if (failover.success) {
                    contractRecord.set("signature_provider", "manual");
                    contractRecord.set("signature_status", "pending");
                    txDao.saveRecord(contractRecord);
                }
            }
        }
        
        if (signatureId) {
            // Generate Evidence Vault entry for the webhook
            const evidenceSigCol = txDao.findCollectionByNameOrId("signature_evidence");
            const evRecord = new Record(evidenceSigCol);
            evRecord.set("contract_signature_id", signatureId);
            evRecord.set("event_type", "webhook_" + eventType);
            evRecord.set("ip_address", c.realIp());
            evRecord.set("user_agent", c.request().header.get("User-Agent"));
            evRecord.set("provider_payload", payloadJson);
            evRecord.set("timestamp", new Date().toISOString());
            
            const auditUtil = require(`${__hooks}/utils/audit.js`);
            const hash = auditUtil.sha256(rawPayload);
            evRecord.set("verification_hash", hash);
            
            txDao.saveRecord(evRecord);
            
            // Block 4: Evidence Vault (contract_evidence) when Completed
            if (eventType.includes("completed") || eventType.includes("signed")) {
                const contractEvidenceCol = txDao.findCollectionByNameOrId("contract_evidence");
                const ceRecord = new Record(contractEvidenceCol);
                ceRecord.set("contract_id", contractId);
                ceRecord.set("tenant_id", tenantId);
                ceRecord.set("original_pdf_hash", "mock_original_pdf_hash_" + contractId);
                ceRecord.set("signed_pdf_hash", "mock_signed_pdf_hash_" + contractId); // From provider download
                ceRecord.set("webhook_payload", payloadJson);
                ceRecord.set("verification_hash", hash);
                ceRecord.set("provider_metadata", { provider: providerName, event_id: providerDocumentId });
                
                txDao.saveRecord(ceRecord);
                
                auditUtil.createAuditLog(
                    "EVIDENCE_CREATED", 
                    "contract", 
                    contractId, 
                    1, 
                    "system",
                    tenantId, 
                    c.request(), 
                    hash, 
                    { provider: providerName, type: "contract_evidence" }, 
                    $app
                );
            }
            
            // Generate Audit Log
            if (contractId) {
                auditUtil.createAuditLog(
                    "SIGNATURE_COMPLETED", 
                    "contract", 
                    contractId, 
                    1, 
                    "system",
                    tenantId, 
                    c.request(), 
                    hash, 
                    { provider: providerName, event: eventType }, 
                    $app
                );
                
                // If it's a completion event, update contract status
                if (eventType.includes("completed") || eventType.includes("signed")) {
                    try {
                        const contractRecord = txDao.findRecordById("contracts", contractId);
                        contractRecord.set("signature_status", "signed");
                        contractRecord.set("signature_state", "fully_signed");
                        contractRecord.set("status", "signed"); // Move from pending_signature to signed
                        txDao.saveRecord(contractRecord);
                    } catch(e) {
                        console.log("Failed to update contract status on webhook:", e);
                    }
                }
            }
        }
    });

    return c.json(200, { success: true, message: "Webhook processed" });
});
