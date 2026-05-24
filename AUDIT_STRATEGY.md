# Audit Strategy

## Overview
Governed by the **Audit Everything** principle. Every state change, access, and administrative action is recorded, traceable, and tamper-evident.

## Traceability
- **Correlation IDs**: Injected at the API Gateway and propagated through all microservices and external system calls.
- **Causality Tracking**: Each event references the `causation_id` and `correlation_id` to build a complete request tree.

## Audit Logs Design
- **Immutable Log Storage**: Logs are written to an append-only datastore.
- **Payload Data**:
  - `timestamp`: ISO 8601 UTC
  - `actor_id`: User or Service performing the action
  - `tenant_id`: Context of the action
  - `action`: CRUD or specific business operation
  - `resource`: Affected entity
  - `diff`: Before and after state
  - `ip_address` & `user_agent`: Client details
  
## Monitoring & Alerts
- Real-time SIEM integration.
- Anomalous behavior detection (e.g., unusual bulk exports, login from new geolocations, multiple failed RBAC escalation attempts).
