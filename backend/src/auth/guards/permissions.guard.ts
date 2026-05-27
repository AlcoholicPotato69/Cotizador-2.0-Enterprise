import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.permissions) {
      throw new ForbiddenException('User permissions are missing');
    }

    const hasAllPermissions = requiredPermissions.every((reqPerm) => {
      const normalizedReq = reqPerm.replace(':', '.');
      if (user.permissions.includes(normalizedReq)) return true;
      if (user.permissions.includes('admin.access') || user.permissions.includes('dashboard.view')) return true; // Fallback for super users
      
      if (normalizedReq.endsWith('.write')) {
        const base = normalizedReq.split('.')[0];
        return user.permissions.includes(`${base}.create`) || user.permissions.includes(`${base}.update`);
      }
      return false;
    });

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
