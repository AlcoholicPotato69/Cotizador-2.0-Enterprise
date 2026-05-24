/**
 * ProviderFactory
 * Resolves the correct signature provider.
 */

const DocuSignProvider = require('./providers/DocuSignProvider.js');
const ManualProvider = require('./providers/ManualProvider.js');

module.exports = {
    getProvider: function(providerName) {
        switch (providerName) {
            case "docusign":
                return DocuSignProvider;
            case "manual":
            case "internal":
                return ManualProvider;
            default:
                throw new Error(`Provider ${providerName} is not supported.`);
        }
    }
};
