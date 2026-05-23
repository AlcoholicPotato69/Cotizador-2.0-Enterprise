# LEGAL HOLD IMPLEMENTATION (Fase 2.2)

## 1. Definición del Motor
Si una auditoría, litigio o requerimiento del SAT ocurre, un usuario con permisos `legal.manage` puede activar `legal_hold = true` sobre un `contract_id` en PocketBase.

## 2. Bloqueos Arquitectónicos
Una vez activo el Flag, los `pb_hooks` interceptan y bloquean con HTTP 403 (Legal Hold Active) cualquier intento de:
- Ejecutar DELETE sobre los registros de Base de Datos.
- Editar el `financial_snapshot`.
- Depurar documentos (Pausa el pase a Glacier o la limpieza automatizada de Tipo C).
- **Resultado**: El expediente se congela legalmente en Base de Datos y en el Bucket S3 hasta que la orden se revoque.