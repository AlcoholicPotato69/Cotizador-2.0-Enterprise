import { http } from '../api/http';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export const roleService = {
    async getRoles(): Promise<Role[]> {
        const response = await http.get('/roles');
        return response.data.data || response.data;
    },
    
    async createRole(payload: Partial<Role>): Promise<Role> {
        const response = await http.post('/roles', payload);
        return response.data.data || response.data;
    }
};
