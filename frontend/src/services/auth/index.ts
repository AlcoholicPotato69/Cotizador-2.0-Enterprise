import type { AuthProvider } from './AuthProvider';
import { PocketBaseAuthProvider } from './PocketBaseAuthProvider';
import { DevAuthProvider } from './DevAuthProvider';

// Patrón Provider de Autenticación: Resuelve automáticamente según el entorno
export const authProvider: AuthProvider = 
    import.meta.env.VITE_APP_ENV === 'development' 
        ? new DevAuthProvider() 
        : new PocketBaseAuthProvider();
