# Client Eligibility Engine

## 1. Visión General
El **Client Eligibility Engine** es el motor centralizado que determina si un Cliente está habilitado para avanzar en los procesos de negocio (Cotizar, Contratar, Facturar). Elimina la dependencia de validaciones dispersas (ej. `if (cliente.perfil_validado)`) y se basa estrictamente en el **Universal Rule Engine**.

## 2. Objetivo Principal
Devolver siempre un resultado estructurado que bloquee o permita flujos, sin que los componentes visuales o backend tengan que recalcular estados.

### Respuesta Estructurada Estándar
```json
{
  "eligible": false,
  "canQuote": true,
  "canContract": false,
  "canInvoice": false,
  "status": "DOCUMENTATION_PENDING",
  "reasons": [
    "Constancia Fiscal (Rechazada)",
    "Contrato Maestro (Vencido)"
  ]
}
```

## 3. Fuentes de Validación (Contexto)
El motor evalúa el expediente completo del cliente, inyectando al Rule Engine:
1. **Documentación**: Lista de documentos (Aprobados, Rechazados, Vencidos).
2. **Finanzas**: Balance del cliente (Adeudos, Bloqueos comerciales).
3. **Restricciones del Tenant**: Reglas propias de Plaza Mayor vs Casa de Piedra.

## 4. Estados de Elegibilidad (`Eligibility Status`)
- `ELIGIBLE`: Todo en regla. Vía libre.
- `DOCUMENTATION_PENDING`: Faltan documentos requeridos (Permite crear Perfil, bloquea Contrato).
- `DOCUMENTATION_REJECTED`: El verificador rechazó un documento clave.
- `DOCUMENTATION_EXPIRED`: El Document Expiration Engine marcó documentos vencidos.
- `FINANCIAL_RESTRICTION`: El cliente tiene deuda activa.
- `BLOCKED`: Bloqueo manual por el Tenant Administrator.

## 5. Integraciones y Puntos de Bloqueo
El motor se ejecuta y detiene el flujo en:
- **Quote Engine**: Si `canQuote == false`, el Wizard no permite avanzar.
- **Contract Engine**: Aunque haya una cotización previa aprobada, al momento de querer presionar "Generar Contrato", el sistema vuelve a llamar al Eligibility Engine. Si un documento expiró *después* de la cotización, `canContract` será falso y se bloquea el flujo legal.

## 6. Configuración en el Tenant Administration Center
Los administradores pueden definir excepciones mediante el Constructor Visual.
Ejemplo: 
*Condición:* `cliente.tipo == "Gobierno"` 
*Acción:* `Omitir validación de INE.`
