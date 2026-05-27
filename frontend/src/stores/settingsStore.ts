import { defineStore } from 'pinia';
import { ref } from 'vue';
import { settingsService } from '../services/settingsService';
import type { Setting } from '../types/settings';

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Setting[]>([]);
  const loading = ref(false);

  async function loadSettings(category?: string) {
    loading.value = true;
    try {
      const data = await settingsService.getSettings(category);
      if (category) {
        // Merge the newly loaded category settings into the global store
        const otherSettings = settings.value.filter(s => s.category !== category);
        settings.value = [...otherSettings, ...data];
      } else {
        settings.value = data;
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function getSettingValue(category: string, key: string, defaultValue: any = null) {
    const found = settings.value.find(s => s.category === category && s.key === key);
    return found ? found.value : defaultValue;
  }

  async function updateSetting(setting: Setting) {
    try {
      const saved = await settingsService.saveSetting(setting);
      const index = settings.value.findIndex(s => s.category === saved.category && s.key === saved.key);
      if (index >= 0) {
        settings.value[index] = saved;
      } else {
        settings.value.push(saved);
      }
      return saved;
    } catch (err) {
      console.error('Failed to save setting:', err);
      throw err;
    }
  }

  async function bulkSave(newSettings: Setting[]) {
    try {
      await settingsService.bulkUpdate(newSettings);
      // Reload everything to ensure consistency
      await loadSettings();
    } catch (err) {
      console.error('Failed to bulk save settings:', err);
      throw err;
    }
  }

  return {
    settings,
    loading,
    loadSettings,
    getSettingValue,
    updateSetting,
    bulkSave
  };
});
