# Tenant Isolation Strategy

## Overview
Defines the architectural isolation of tenants (e.g., Plaza Mayor, Casa de Piedra) within the multi-tenant SaaS environment.

## Data Isolation
- **Row-Level Security (RLS)**: Enforced at the database level. Every query automatically appends a `tenant_id` filter based on the authenticated context.
- **Dedicated Schemas**: For highly sensitive tenants or strict compliance requirements, data can be isolated into separate database schemas.
- **Tenant Context**: All incoming requests must resolve a valid `tenant_id` from the JWT token. Cross-tenant queries are blocked at the ORM/Database layer.

## Compute & Resource Isolation
- **Rate Limiting per Tenant**: Prevents "noisy neighbor" problems.
- **Queue Segregation**: Separate topic partitions or dedicated queues for high-priority tenants to ensure SLA compliance.

## Network Isolation
- In a fully shared environment, logical isolation is enforced via RLS and API Gateway policies.
- For dedicated tenant tiers, network segments (VPCs/Subnets) can be physically isolated.

## Backup & Recovery
- Point-in-time recovery (PITR) is supported.
- Backups are encrypted using tenant-specific KMS keys.
