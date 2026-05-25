export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenant_id: string;
  effective_permissions?: string[];
}
