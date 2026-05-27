import { http } from '../api/http';
import type { User } from '../types/user';

export interface UserInviteDto {
  name: string;
  email: string;
  role: string;
}

export const userService = {
    async getUsers(): Promise<User[]> {
        const response = await http.get('/users');
        return response.data.data || response.data;
    },
    
    async inviteUser(payload: UserInviteDto): Promise<void> {
        await http.post('/users/invite', payload);
    },
    
    async getRoles(): Promise<any[]> {
        const response = await http.get('/roles');
        return response.data.data || response.data;
    }
};
