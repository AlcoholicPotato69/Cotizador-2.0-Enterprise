# DISASTER RECOVERY RUNBOOK
## Pérdida de PocketBase
1. Levantar instancia secundaria desde Docker.
2. Inyectar `pb_data` del bucket S3.
3. Restaurar hooks.