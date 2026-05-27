import { http } from '../api/http';
import type { Setting } from '../types/settings';

const fallbackSettings: Setting[] = [
  { category: 'general', key: 'siteName', value: 'Cotizador 2.0', type: 'string' },
];

export const settingsService = {
  /**
   * Retrieves all settings, optionally filtered by category
   */
  async getSettings(category?: string): Promise<Setting[]> {
    try {
      const response = await http.get('/settings', {
        params: category ? { category } : undefined,
      });

      const payload = response.data;
      const settings = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.items)
          ? payload.items
          : [];

      return settings;
    } catch (error: any) {
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        return category
          ? fallbackSettings.filter((setting) => setting.category === category)
          : fallbackSettings;
      }
      throw error;
    }
  },

  /**
   * Saves a single setting or updates it if it exists
   */
  async saveSetting(setting: Setting): Promise<Setting> {
    const response = await http.post('/settings', setting);
    return response.data;
  },

  /**
   * Bulk updates settings
   */
  async bulkUpdate(settings: Setting[]): Promise<void> {
    await http.patch('/settings', { settings });
  }
};
