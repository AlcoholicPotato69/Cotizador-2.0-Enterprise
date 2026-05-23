import type { AuthProvider, AuthResponse, AuthUser } from './AuthProvider';

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

    async login(email: string, _password?: string): Promise<AuthResponse> {
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
}