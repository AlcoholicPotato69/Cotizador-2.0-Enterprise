# INVOICE PROVIDER ARCHITECTURE

## 1. Misión Arquitectónica
La facturación debe fluir, pero el sistema debe aislarse de la tecnología específica de terceros (Intelisis, Facturama, SW Sapien). Si Intelisis falla o la empresa cambia de ERP, Cotizador 2.0 no debe requerir una reescritura de su núcleo.

## 2. Abstracción del PAC (`InvoiceProvider Interface`)
Toda comunicación de timbrado o cancelación pasará por una interfaz estándar en el Backend:

```typescript
interface InvoiceProvider {
  checkHealth(): Promise<boolean>;
  
  /** Solicita el timbrado enviando el JSON normalizado de la plataforma */
  stampInvoice(payload: StandardInvoicePayload): Promise<ProviderResponse>;
  
  /** Cancela un CFDI existente */
  cancelInvoice(uuid: string, reason: string): Promise<boolean>;
}
```


## 3. CFDI Validation Engine (Modo Manual)
Si un administrativo sube un XML y un PDF de forma manual, el `CFDI Validation Engine` ejecutará un análisis profundo antes de guardar:
1. **Match Documental**: Lee el XML e inspecciona el nodo `<cfdi:Comprobante>`.
2. **Validación de Integridad**: Confirma que el UUID existe en el nodo de TimbreFiscalDigital.
3. **Cross-Check de Sujetos**: Verifica que `RFC Emisor` == `tenant_snapshot.rfc_emisor` y `RFC Receptor` == `client_snapshot.rfc`.
4. **Cross-Check de Montos**: Exige que `<cfdi:Impuestos>` y el subtotal cuadren matemáticamente con los recibos/contratos a los que se asocia la factura.
5. **Auditoría**: Registra nombre del empleado, fecha y el UUID verificado.

## 4. Gestión desde el Tenant Administration Center
El "Provider" y las "Credenciales del ERP" se configurarán directamente desde el panel administrativo.
No habrá *tokens* hardcodeados en el código fuente. Se almacenarán en campos encriptados dentro de `tenant_settings.invoicing_config`.
