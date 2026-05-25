import { http } from '../api/http';
import { secureStorage } from '../utils/secureStorage';

export const authService = {
    async login(email: string, pass: string) {
        const response = await http.post('/auth/login', { email, password: pass });
        
        // Handle NestJS response wrapper
        const responseData = response.data.data || response.data;
        const token = responseData.token;
        const user = responseData.user;
        
        return {
            token: token,
            record: user
        };
    },
    logout() {
        // Handled in store by clearing token
    },
    async refreshSession() {
        try {
            const token = secureStorage.get('auth_token');
            if (!token) throw new Error('No token');
            const profileResponse = await http.get('/auth/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Handle NestJS response wrapper
            const user = profileResponse.data.data || profileResponse.data;
            return {
                token: token,
                record: user
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
        return !!secureStorage.get('auth_token'); 
    }
};
