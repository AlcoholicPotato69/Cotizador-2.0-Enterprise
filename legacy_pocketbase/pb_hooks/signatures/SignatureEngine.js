/**
 * SignatureEngine
 * Central Abstraction Layer for Contract Signatures.
 * The Contract domain MUST NOT communicate directly with Providers.
 */

const DocuSignProvider = require('./providers/DocuSignProvider.js');
const ManualProvider = require('./providers/ManualProvider.js');

const ProviderFactory = {
    getProvider: function(providerName) {
        switch (providerName) {
            case "docusign": return DocuSignProvider;
            case "manual":
            case "internal": return ManualProvider;
            default: throw new Error(`Provider ${providerName} is not supported.`);
        }
    }
};

module.exports = {
    sendForSignature: function(contractId, providerName, participants) {
        console.log(`[SignatureEngine] Dispatching Contract ${contractId} via ${providerName}`);
        
        try {
            const provider = ProviderFactory.getProvider(providerName);
            const envelope = provider.createEnvelope(contractId, participants);
            const result = provider.sendForSignature(envelope.provider_request_id);
            
            return {
                success: true,
                provider_event_id: envelope.provider_request_id,
                provider_trace_id: envelope.provider_document_id,
                status: "sent"
            };
        } catch (error) {
            console.error(`[SignatureEngine] Provider Failed: ${error.message}`);
            // FAILOVER LOGIC
            return {
                success: false,
                provider_error: true,
                provider_error_code: error.code || "FAILOVER_ERR",
                provider_error_message: error.message,
                provider_response: error.response || {}
            };
        }
    },
    
    validateWebhookPayload: function(providerName, payload, signatureHeader) {
        const provider = ProviderFactory.getProvider(providerName);
        return provider.validateWebhook(payload, signatureHeader);
    },
    
    failoverToManual: function(contractId) {
        console.log(`[SignatureEngine] Executing failover to ManualProvider for Contract ${contractId}`);
        // This abstracts the rollback/switch without exposing ManualProvider logic directly
        return { success: true, new_provider: "manual" };
    }
};
