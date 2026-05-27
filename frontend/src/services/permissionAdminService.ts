import { http } from '../api/http';

export interface Permission {
  id: string;
  code: string;
  description: string;
  module: string;
}

export const permissionAdminService = {
    async getAllPermissions(): Promise<Permission[]> {
        const response = await http.get('/permissions');
        return response.data.data || response.data;
    }
};
