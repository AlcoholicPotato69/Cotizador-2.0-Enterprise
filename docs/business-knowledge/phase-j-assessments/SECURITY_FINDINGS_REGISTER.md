# SECURITY FINDINGS REGISTER (J.3)

| ID | Componente | Vector | Severidad | Descripción |
|----|------------|--------|-----------|-------------|
| ZT-01 | Tenant Isolation | Tenant Escape | LOW | Intentos de inyectar `?tenant_id=B` en peticiones del Tenant A. Bloqueado por PB API Rules. |
| ZT-02 | Financial Engine | Tampering | CRITICAL | Intentos de modificar `subtotal` en el payload POST. Bloqueado (El hook descarta el valor y lo recalcula). |
| ZT-03 | Auth | Session Hijacking | HIGH | Si un token no expira rápidamente, un atacante que robe el `pb_auth` puede evadir el FLS. Requiere mitigación inmediata. |
| ZT-04 | Snapshots | Manipulation | MEDIUM | Alterar la firma del Snapshot generaba un 500 error en vez de un 400 Bad Request estructurado. |