import SecureLSModule from 'secure-ls';

// Handle CJS/ESM interop: secure-ls exports as CommonJS
const SecureLS = (SecureLSModule as any).default || SecureLSModule;

// Initialize SecureLS with AES encryption to protect sensitive data like JWT tokens
export const secureStorage = new SecureLS({
  encodingType: 'aes',
  isCompression: true,
  encryptionSecret: import.meta.env.VITE_STORAGE_SECRET || 'cotizador-secure-storage-key' // fallback for backwards compat
});
