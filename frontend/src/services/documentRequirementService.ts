import { http } from '../api/http';

export interface DocumentRequirement {
  id?: string;
  tenant_id?: string;
  name: string;
  description: string;
  person_type: 'Fisica' | 'Moral' | 'Ambas';
  is_required: boolean;
  is_blocking: boolean;
  validity_days: number;
}

export const documentRequirementService = {
  async getRequirements(): Promise<DocumentRequirement[]> {
    const response = await http.get('/document-requirements');
    return response.data.data || response.data;
  },

  async createRequirement(req: Partial<DocumentRequirement>): Promise<DocumentRequirement> {
    const response = await http.post('/document-requirements', req);
    return response.data.data || response.data;
  },

  async updateRequirement(id: string, req: Partial<DocumentRequirement>): Promise<DocumentRequirement> {
    const response = await http.put(`/document-requirements/${id}`, req);
    return response.data.data || response.data;
  },

  async deleteRequirement(id: string): Promise<void> {
    await http.delete(`/document-requirements/${id}`);
  }
};
