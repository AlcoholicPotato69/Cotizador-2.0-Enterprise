import SecureLS from 'secure-ls';

// Initialize SecureLS with AES encryption to protect sensitive data like JWT tokens
export const secureStorage = new SecureLS({
  encodingType: 'aes',
  isCompression: true,
  encryptionSecret: 'cotizador-secure-storage-key' // A static key for client-side obfuscation
});
