# SECURITY REGRESSION TEST PLAN (J.4)

## 1. Suite de Seguridad Automatizada
La batería de regresión se compone de scripts que intentan deliberadamente fallar las reglas de seguridad cada vez que haya un commit en el repositorio.

## 2. Escenarios Testeados
- **Tenant Isolation**: Un token del Tenant A intenta hacer un `GET /api/collections/cotizaciones/records?tenant_id=B`. (Espera HTTP 403 o 404).
- **Effective Permissions**: Un usuario sin el permiso `billing.create` lanza un payload POST de pago válido. (Espera HTTP 403).
- **Financial Validation**: Se lanza un `PATCH /contracts/id` modificando `subtotal` con firma inválida. (Espera HTTP 400 Tampered).