export interface AuthUser {
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
}