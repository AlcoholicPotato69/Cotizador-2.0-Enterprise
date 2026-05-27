export type SettingType = 'string' | 'number' | 'boolean' | 'json';

export interface Setting {
  id?: string;
  tenant_id?: string;
  category: string;
  key: string;
  value: any;
  type: SettingType;
  version?: number;
  description?: string;
}
