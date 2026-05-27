import { http } from '../api/http';

export interface AuditLog {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  action: string;
  resource: string;
  user: string;
  details: string;
}

const fallbackAuditLogs = (): AuditLog[] => {
  const now = Date.now();
  return [
    {
      id: 'fallback-1',
      collectionId: 'audit',
      collectionName: 'audit_logs',
      created: new Date(now).toISOString(),
      updated: new Date(now).toISOString(),
      action: 'ACCESS',
      resource: 'Audit',
      user: 'system',
      details: 'Audit endpoint unavailable',
    },
  ];
};

export const auditService = {
  async getLogs(page = 1, perPage = 50): Promise<{ items: AuditLog[]; totalItems: number }> {
    try {
      const response = await http.get('/audit', {
        params: {
          page,
          limit: perPage,
        },
      });

      const payload = response.data;
      const items = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.items)
          ? payload.items
          : [];

      const totalItems = typeof payload?.meta?.totalItems === 'number'
        ? payload.meta.totalItems
        : items.length;

      return { items, totalItems };
    } catch (error: any) {
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        const items = fallbackAuditLogs();
        return { items, totalItems: items.length };
      }

      throw error;
    }
  },
};
