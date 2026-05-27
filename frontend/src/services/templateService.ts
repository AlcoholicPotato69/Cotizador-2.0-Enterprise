import { http } from '../api/http';

export interface DocumentTemplate {
  id?: string;
  tenant_id?: string;
  name: string;
  type: 'contract' | 'quote' | string;
  version: number;
  html_content: string;
}

export const templateService = {
  async getTemplates(): Promise<DocumentTemplate[]> {
    const response = await http.get('/document-templates');
    return response.data.data || response.data;
  },

  async createTemplate(template: Partial<DocumentTemplate>): Promise<DocumentTemplate> {
    const response = await http.post('/document-templates', template);
    return response.data.data || response.data;
  },

  async updateTemplate(id: string, template: Partial<DocumentTemplate>): Promise<DocumentTemplate> {
    const response = await http.put(`/document-templates/${id}`, template);
    return response.data.data || response.data;
  },

  async deleteTemplate(id: string): Promise<void> {
    await http.delete(`/document-templates/${id}`);
  }
};
