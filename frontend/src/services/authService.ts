import { pb } from './pb';

export const authService = {
    async login(email: string, pass: string) {
        return await pb.collection('users').authWithPassword(email, pass);
    },
    logout() {
        pb.authStore.clear();
    },
    async refreshSession() {
        if (pb.authStore.isValid) {
            try {
                return await pb.collection('users').authRefresh();
            } catch (err) {
                pb.authStore.clear();
                throw err;
            }
        }
        return null;
    },
    getCurrentUser() {
        return pb.authStore.model;
    },
    isValid() {
        return pb.authStore.isValid;
    }
};
