import PocketBase from 'pocketbase';

export const pb = new PocketBase(import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090');

// Ensure authentication state changes are synced to Vue reactively if needed
export function getActiveUser() {
    return pb.authStore.model;
}
