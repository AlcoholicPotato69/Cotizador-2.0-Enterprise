const fs = require('fs');
const path = require('path');

const authDir = path.join(__dirname, 'frontend', 'src', 'services', 'auth');

if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
}

const files = {
    'AuthProvider.ts': `export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
}

export interface AuthProvider {
    login(email: string, password?: string): Promise<AuthResponse>;
    logout(): Promise<void>;
    getCurrentUser(): AuthUser | null;
    validateSession(): Promise<boolean>;
}`,

    'PocketBaseAuthProvider.ts': `import type { AuthProvider, AuthResponse, AuthUser } from './AuthProvider';
// import pb from '../../lib/pocketbase'; // Hypothetical pocketbase instance

export class PocketBaseAuthProvider implements AuthProvider {
    async login(email: string, password?: string): Promise<AuthResponse> {
        if (!password) throw new Error('Password required for PocketBase Auth');
        // const authData = await pb.collection('users').authWithPassword(email, password);
        // Map PB authData to AuthUser...
        console.log('Connecting to', import.meta.env.VITE_PB_URL);
        throw new Error('Not fully implemented yet');
    }

    async logout(): Promise<void> {
        // pb.authStore.clear();
    }

    getCurrentUser(): AuthUser | null {
        // return pb.authStore.isValid ? mapPBUser(pb.authStore.model) : null;
        return null;
    }

    async validateSession(): Promise<boolean> {
        // try { await pb.collection('users').authRefresh(); return true; } catch { return false; }
        return false;
    }
}`,

    'DevAuthProvider.ts': `import type { AuthProvider, AuthResponse, AuthUser } from './AuthProvider';

const MOCK_USERS: Record<string, AuthUser> = {
    'superadmin': { id: 'dev_1', email: 'admin@dev.com', name: 'SuperAdmin', role: 'admin' },
    'comercial_pm': { id: 'dev_2', email: 'comercial@pm.com', name: 'Comercial PM', role: 'comercial' },
    'finanzas_pm': { id: 'dev_3', email: 'finanzas@pm.com', name: 'Finanzas PM', role: 'finanzas' },
    'operaciones_pm': { id: 'dev_4', email: 'operaciones@pm.com', name: 'Operaciones PM', role: 'operaciones' },
    'comercial_cp': { id: 'dev_5', email: 'comercial@cp.com', name: 'Comercial CP', role: 'comercial' },
    'finanzas_cp': { id: 'dev_6', email: 'finanzas@cp.com', name: 'Finanzas CP', role: 'finanzas' },
    'operaciones_cp': { id: 'dev_7', email: 'operaciones@cp.com', name: 'Operaciones CP', role: 'operaciones' },
};

export class DevAuthProvider implements AuthProvider {
    private currentUser: AuthUser | null = null;

    async login(email: string, password?: string): Promise<AuthResponse> {
        // In dev, we can just use the key (e.g. 'comercial_pm') as the email to mock login
        const user = MOCK_USERS[email];
        if (!user) throw new Error('Simulated Dev User not found');
        
        this.currentUser = user;
        localStorage.setItem('dev_mock_user', JSON.stringify(user));
        
        return { token: 'mock_jwt_token_123', user };
    }

    async logout(): Promise<void> {
        this.currentUser = null;
        localStorage.removeItem('dev_mock_user');
    }

    getCurrentUser(): AuthUser | null {
        if (!this.currentUser) {
            const stored = localStorage.getItem('dev_mock_user');
            if (stored) this.currentUser = JSON.parse(stored);
        }
        return this.currentUser;
    }

    async validateSession(): Promise<boolean> {
        return this.getCurrentUser() !== null;
    }
}`,

    'index.ts': `import type { AuthProvider } from './AuthProvider';
import { PocketBaseAuthProvider } from './PocketBaseAuthProvider';
import { DevAuthProvider } from './DevAuthProvider';

// Patrón Provider de Autenticación: Resuelve automáticamente según el entorno
export const authProvider: AuthProvider = 
    import.meta.env.VITE_APP_ENV === 'development' 
        ? new DevAuthProvider() 
        : new PocketBaseAuthProvider();
`
};

for (const [filename, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(authDir, filename), content, 'utf8');
    console.log('Creado: ' + filename);
}

console.log('Auth Provider Architecture setup complete.');
