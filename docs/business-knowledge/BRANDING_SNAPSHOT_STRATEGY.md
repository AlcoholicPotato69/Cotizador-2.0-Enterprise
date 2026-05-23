# BRANDING SNAPSHOT STRATEGY

## 1. Justificación Arquitectónica
Las empresas evolucionan. "Plaza Mayor" puede cambiar su logotipo, sus colores institucionales, o incluso su razón social o domicilio fiscal. 
Si los documentos transaccionales históricos consumieran el branding en tiempo real de la tabla `tenant_settings`, un contrato firmado hace 5 años aparecería con el logotipo y la dirección actual, lo cual invalida legalmente la representación visual del acuerdo en aquel momento.

## 2. Inmutabilidad Exigida
Toda cotización, contrato, recibo y factura debe contener un clon profundo del `branding` exactamente como estaba configurado el día de su emisión.

## 3. Composición del Branding Snapshot
El campo `branding_snapshot` (JSON) debe congelar obligatoriamente las siguientes propiedades provenientes del Tenant Administration Center:

```json
{
  "tenant_id": "plaza_mayor_00",
  "nombre_comercial": "Plaza Mayor",
  "razon_social": "Administradora de Recintos SA de CV",
  "rfc_emisor": "ARE990101XYZ",
  "domicilio_fiscal": "Blvd. Adolfo López Mateos, León, Gto.",
  "logo_url": "https://storage.empresa.com/v1/logo_2023.png",
  "colores_institucionales": {
    "primary": "#1E3A8A",
    "secondary": "#D97706"
  },
  "membretes_oficiales": {
    "header": "https://storage.empresa.com/v1/header_2023.png",
    "footer": "https://storage.empresa.com/v1/footer_2023.png"
  },
  "informacion_legal_base": "Todos los precios expresados están sujetos a cambios..."
}
```

## 4. Renderizado PDF/HTML
El motor de renderizado de contratos y recibos consultará `document.branding_snapshot.logo_url` en lugar de `tenant.settings.logo_url`. Esto asegura que el re-impreso en PDF de un contrato viejo luzca exactamente igual que el día que se firmó.
