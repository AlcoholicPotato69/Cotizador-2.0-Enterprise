import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

interface TenantAwareRequestUser {
  tenantId?: string;
  permissions?: string[];
}

const hasPermission = (
  user: TenantAwareRequestUser,
  permission: string,
): boolean => {
  if (!Array.isArray(user.permissions)) {
    return false;
  }

  const dotNotation = permission.replace(/:/g, '.');
  const colonNotation = permission.replace(/\./g, ':');
  return user.permissions.includes(permission)
    || user.permissions.includes(dotNotation)
    || user.permissions.includes(colonNotation);
};

@Injectable()
export class TenantIsolationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as Request & { user?: TenantAwareRequestUser }).user;

    if (!user) {
      throw new ForbiddenException('User context is missing');
    }

    if (hasPermission(user, 'tenants.global_access')) {
      return true;
    }

    if (!user.tenantId) {
      throw new ForbiddenException(
        'Tenant isolation violation: Missing tenantId',
      );
    }

    return true;
  }
}
