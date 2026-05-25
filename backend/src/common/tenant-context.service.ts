import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  private tenantId: string | null = null;
  private userId: string | null = null;

  setTenantId(tenantId: string) {
    this.tenantId = tenantId;
  }

  getTenantId(): string {
    if (!this.tenantId) {
      throw new Error(
        'TenantContext: tenant_id no ha sido establecido en la petición actual.',
      );
    }
    return this.tenantId;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  getUserId(): string {
    if (!this.userId) {
      throw new Error(
        'TenantContext: user_id no ha sido establecido en la petición actual.',
      );
    }
    return this.userId;
  }
}
