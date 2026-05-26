import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tenantContext } from '../../prisma/tenant-context';

const hasPermission = (
  permissions: string[] | undefined,
  permission: string,
): boolean => {
  if (!permissions?.length) {
    return false;
  }

  const dotNotation = permission.replace(/:/g, '.');
  const colonNotation = permission.replace(/\./g, ':');
  return permissions.includes(permission)
    || permissions.includes(dotNotation)
    || permissions.includes(colonNotation);
};

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // El usuario se asume que ha sido insertado en el request por el JwtAuthGuard
    const user = request.user || {};
    const userPermissions = Array.isArray(user.permissions)
      ? user.permissions
      : [];

    // Obtenemos tenantId desde header solo para usuarios con permiso explícito.
    let tenantId = user.tenantId || '';
    if (hasPermission(userPermissions, 'tenants.override_context')
      && request.headers['x-tenant-id']) {
      tenantId = request.headers['x-tenant-id'];
    }

    const userId = user.id || '';
    const role = user.role || '';

    // Ejecutamos la solicitud dentro del contexto del AsyncLocalStorage
    return tenantContext.run({ tenantId, userId, role }, () => {
      return next.handle();
    });
  }
}
