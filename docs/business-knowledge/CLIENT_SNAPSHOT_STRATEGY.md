# CLIENT SNAPSHOT STRATEGY

## 1. Justificación Arquitectónica
Los clientes en el sistema (`clientes`) tienen perfiles vivos. Un cliente puede actualizar su RFC (por corrección o cambio de régimen fiscal), su domicilio fiscal, su representante legal (en personas morales), o sus métodos de contacto.

Si el sistema utilizará relaciones directas (`expand.cliente.rfc`) para renderizar un contrato viejo o una factura vieja, los cambios futuros del cliente alterarían documentos legales ya emitidos, constituyendo una violación a las leyes fiscales y comerciales.

## 2. Inmutabilidad Exigida
Todo documento financiero o legal (Cotización, Contrato, Recibo, Factura) debe contener un clon de los datos del cliente, tomado exactamente en el milisegundo de su emisión.

## 3. Composición del Client Snapshot
El campo `client_snapshot` (JSON) alojado en `cotizaciones` y `contratos` congelará como mínimo:

```json
{
  "cliente_id": "cli_999888",
  "nombre_completo": "Juan Pérez Méndez",
  "tipo_persona": "Fisica",
  "rfc": "PEMJ800101XYZ",
  "regimen_fiscal": "612",
  "domicilio_fiscal": {
    "calle": "Av. Principal 123",
    "colonia": "Centro",
    "codigo_postal": "37000",
    "ciudad": "León",
    "estado": "Guanajuato",
    "pais": "México"
  },
  "representante_legal": null,
  "telefonos": ["4771234567"],
  "correos": ["juan.perez@empresa.com"]
}
```

## 4. Estrategia de Consumo
Toda vista histórica (Ver PDF de Contrato, Ver Detalle de Cotización, Impresión de Recibo) **PROHÍBE** utilizar datos de la tabla `clientes`. La UI debe alimentarse exclusivamente de la rama `documento.client_snapshot`.
