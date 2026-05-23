# SPACE SNAPSHOT STRATEGY

## 1. Justificación Arquitectónica
El catálogo de espacios (`espacios`) es un ente vivo. Los salones cambian de nombre, se remodelan (cambiando sus dimensiones o aforos máximos), cambian sus precios base, y actualizan sus fotografías institucionales.

Si una cotización o contrato dependiera de un simple `espacio_id`, cualquier modificación futura al catálogo alteraría documentos históricos, lo cual es legal y financieramente inaceptable.

## 2. Inmutabilidad Exigida
Para garantizar la integridad histórica, toda cotización y contrato debe contener un clon profundo (*Deep Copy*) del espacio exactamente como existía en el milisegundo en que el documento fue emitido.

## 3. Composición del Space Snapshot
El campo `space_snapshot` (JSON) debe congelar obligatoriamente las siguientes propiedades:

```json
{
  "id": "esp_12345",
  "nombre": "Salón Fórum",
  "categoria": "Salón",
  "subcategoria": "Premium",
  "tenant": "plaza_mayor",
  "medidas": "20x30m",
  "dimensiones_m2": 600,
  "capacidad_maxima": 800,
  "ubicacion": "Nivel 2, Ala Norte",
  "precio_base_sugerido": 25000.00,
  "config_b2b": {
    "aplica_premontaje": true,
    "premontaje_pct": 25,
    "horas_minimas": 4
  },
  "fotografias_relevantes": [
    "https://storage.empresa.com/v1/esp_12345_foto1.jpg",
    "https://storage.empresa.com/v1/esp_12345_plano.pdf"
  ],
  "impuestos_aplicados": [
    { "nombre": "IVA", "tasa": 16 },
    { "nombre": "ISN", "tasa": 2 }
  ]
}
```

## 4. Consumo en UI (Históricos)
Cuando un administrativo o cliente visualiza una cotización pasada, el UI **jamás** consultará la colección `espacios`. Todo el renderizado de la vista de "Detalle de Espacio" se construirá alimentando sus variables desde `quote.space_snapshot`.
