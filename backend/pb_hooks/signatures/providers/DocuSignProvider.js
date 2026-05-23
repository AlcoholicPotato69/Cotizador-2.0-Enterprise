/**
 * DocuSignProvider Stub
 * Implements the architecture for DocuSign readiness without real credentials.
 */

module.exports = {
    createEnvelope: function(contractId, participants) {
        console.log(`[DocuSignProvider] Creating Envelope for contract ${contractId}`);
        // Map participants to DocuSign Recipients
        const recipients = participants.map(p => ({
            name: p.name,
            email: p.email,
            roleName: p.role,
            routingOrder: p.sign_order
        }));
        
        return {
            success: true,
            provider_request_id: "ds_env_" + Date.now(),
            provider_document_id: "ds_doc_" + Date.now(),
            mapped_recipients: recipients
        };
    },
    
    sendForSignature: function(envelopeId) {
        console.log(`[DocuSignProvider] Sending Envelope ${envelopeId}`);
        return { success: true, status: "sent", sent_at: new Date() };
    },
    
    getStatus: function(envelopeId) {
        console.log(`[DocuSignProvider] Checking status for Envelope ${envelopeId}`);
        return { status: "pending", raw: {} };
    },
    
    cancelEnvelope: function(envelopeId, reason) {
        console.log(`[DocuSignProvider] Cancelling Envelope ${envelopeId}. Reason: ${reason}`);
        return { success: true, status: "voided" };
    },
    
    downloadSignedDocument: function(envelopeId) {
        console.log(`[DocuSignProvider] Downloading signed PDF for Envelope ${envelopeId}`);
        return { success: true, file_blob: "mock_pdf_blob" };
    },
    
    validateWebhook: function(payload, signatureHeader) {
        console.log(`[DocuSignProvider] Validating webhook HMAC signature`);
        // We assume valid for stub
        return { valid: true };
    },
    
    healthCheck: function() {
        return { status: "healthy", provider: "docusign", check_time: new Date() };
    }
};
