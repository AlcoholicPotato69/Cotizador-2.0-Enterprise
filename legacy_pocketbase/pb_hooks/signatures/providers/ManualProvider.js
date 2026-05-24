/**
 * ManualProvider
 * Handles the logic for physical signatures.
 */

module.exports = {
    createEnvelope: function(contractId, participants) {
        console.log(`[ManualProvider] Preparing contract ${contractId} for physical signing.`);
        return {
            success: true,
            provider_request_id: "manual_" + contractId + "_" + Date.now(),
            provider_document_id: null,
            mapped_recipients: participants
        };
    },
    
    sendForSignature: function(envelopeId) {
        // In manual mode, "sending" means notifying the user to download the PDF
        console.log(`[ManualProvider] Contract is ready for manual download and signature.`);
        return { success: true, status: "pending", sent_at: new Date() };
    },
    
    getStatus: function(envelopeId) {
        // Status is handled explicitly by the /api/signatures/manual-upload endpoint
        return { status: "pending", raw: {} };
    },
    
    cancelEnvelope: function(envelopeId, reason) {
        return { success: true, status: "voided" };
    },
    
    downloadSignedDocument: function(envelopeId) {
        throw new Error("Manual provider relies on user upload, not download.");
    },
    
    validateWebhook: function(payload, signatureHeader) {
        return { valid: false, error: "Manual provider does not use webhooks." };
    },
    
    healthCheck: function() {
        return { status: "healthy", provider: "manual", check_time: new Date() };
    }
};
