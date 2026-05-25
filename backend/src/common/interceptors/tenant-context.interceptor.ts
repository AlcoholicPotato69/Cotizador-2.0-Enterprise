import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tenantContext } from '../../prisma/tenant-context';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // El usuario se asume que ha sido insertado en el request por el JwtAuthGuard
    const user = request.user || {};
    const role = user.role || '';

    // Obtenemos el tenantId ya sea de los headers (solo para SUPER_ADMIN o SYSTEM) o del JWT directamente
    let tenantId = user.tenantId || '';
    if (
      (role === 'SUPER_ADMIN' || role === 'SYSTEM') &&
      request.headers['x-tenant-id']
    ) {
      tenantId = request.headers['x-tenant-id'];
    }

    const userId = user.id || '';

    // Ejecutamos la solicitud dentro del contexto del AsyncLocalStorage
    return tenantContext.run({ tenantId, userId, role }, () => {
      return next.handle();
    });
  }
}
