# PHASE 0 BUILD PLAN
**Author:** Backend Lead

## Regla de Oro
- **Unit Tests, Integration Tests, E2E Tests obligatorios.**
- Toda entidad incluirá campos de auditoría y `tenant_id`.

## Secuencia de Módulos (NestJS)

### 1. AuthModule
- Prisma Models: `User`, `UserTokens`
- NestJS: `AuthService`, `AuthController`, `JwtStrategy`, `LocalStrategy`
- DTOs: `LoginDto`, `RegisterDto`, `TokenRefreshDto`

### 2. TenantModule
- Prisma Models: `Tenant`
- NestJS: `TenantMiddleware` (inyecta `tenantId` al context request), `TenantService`, `TenantController`

### 3. RbacModule
- Prisma Models: `Role`, `Permission`, `RolePermission`, `UserRole`
- NestJS: `RolesGuard`, `PermissionsGuard`, `RbacService`

### 4. SettingsModule
- Prisma Models: `TenantSettings`, `BillingSettings`
- NestJS: `SettingsService` (Cacheado en memoria para performance)

### 5. AuditModule
- Prisma Models: `AuditLog`
- NestJS: `AuditInterceptor` (Intercepta peticiones de modificación), `HashChainService` (Firma el payload)

### 6. SnapshotsModule
- NestJS: `SnapshotService` (Expone métodos para congelar `Quotes`, `Invoices`)

### 7. ApprovalModule
- NestJS: `ApprovalEngineService` (Máquina de estados finita)
