
export interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  config: Record<string, any>;
  lastSync?: string;
}

export const integrationService = {
  async getIntegrations(): Promise<Integration[]> {
      await new Promise(r => setTimeout(r, 200));
      return [
        { id: '1', name: 'ERP System', type: 'ERP', status: 'active', config: { url: 'https://api.erp.local' }, lastSync: new Date().toISOString() },
        { id: '2', name: 'CRM Webhook', type: 'Webhook', status: 'error', config: { endpoint: 'https://crm.local/webhook' }, lastSync: new Date(Date.now() - 86400000).toISOString() },
        { id: '3', name: 'Email Gateway', type: 'SMTP', status: 'inactive', config: { host: 'smtp.mail.local' } },
      ];
  },

  async toggleIntegration(id: string, active: boolean): Promise<Integration> {
      await new Promise(r => setTimeout(r, 200));
      return { id, name: 'Mock Integration', type: 'Mock', status: active ? 'active' : 'inactive', config: {} };
  }
};
