export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenant_id: string;
  firstName?: string;
  lastName?: string;
  permissions?: string[];
  effective_permissions?: string[];
}
