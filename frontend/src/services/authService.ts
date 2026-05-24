import { http } from '../api/http';

export const authService = {
    async login(email: string, pass: string) {
        const response = await http.post('/auth/login', { email, password: pass });
        // Assume NestJS returns { token, user: { id, email, tenant_id, ... } }
        return {
            token: response.data.token,
            record: response.data.user
        };
    },
    logout() {
        // Handled in store by clearing token
    },
    async refreshSession() {
        try {
            const response = await http.post('/auth/refresh');
            return {
                token: response.data.token,
                record: response.data.user
            };
        } catch (err) {
            throw err;
        }
    },
    getCurrentUser() {
        // This is now managed by Pinia, so services shouldn't hold state.
        return null; 
    },
    isValid() {
        // The store handles the token presence validation
        return true; 
    }
};
