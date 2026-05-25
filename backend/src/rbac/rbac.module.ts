import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { RbacController } from './rbac.controller';
import { RbacGuard } from '../security/rbac.guard';

@Module({
  controllers: [RbacController],
  providers: [RbacService, RbacGuard],
  exports: [RbacGuard],
})
export class RbacModule {}
