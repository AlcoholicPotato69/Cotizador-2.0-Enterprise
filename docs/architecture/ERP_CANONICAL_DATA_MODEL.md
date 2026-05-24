# ERP Canonical Data Model

El Anti-Corruption Layer (ACL) abstrae las estructuras propietarias del ERP legadas. Las APIs internas y los Módulos de NestJS **siempre** deben intercambiar información con el ACL utilizando este modelo canónico común.

## 1. Canonical Customer
Representación universal del cliente comercial, independiente de si el ERP lo considera un `T-CUST-3942` o un `BusinessPartner`.
```json
{
  "erpReferenceId": "string",
  "taxIdentification": "string",
  "companyName": "string",
  "currencyCode": "string",
  "paymentTerms": "string",
  "billingAddress": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "countryIso2": "string"
  }
}
```

## 2. Canonical Product
Representación universal del producto o SKU en el ecosistema corporativo.
```json
{
  "erpReferenceId": "string",
  "skuCode": "string",
  "displayName": "string",
  "baseUnitOfMeasure": "string",
  "listPrice": "number",
  "isActive": "boolean"
}
```

## 3. Canonical Sales Order
Cuando una Cotización (`Quote`) se aprueba, se transforma en este DTO canónico y se envía al ACL para orquestar la creación del Pedido de Ventas en el ERP (SAP, Dynamics, etc).
```json
{
  "sourceQuoteId": "string",
  "customerErpReferenceId": "string",
  "requestedDeliveryDate": "ISO8601 Date",
  "notesToWarehouse": "string",
  "lines": [
    {
      "skuCode": "string",
      "quantity": "number",
      "negotiatedUnitPrice": "number",
      "appliedDiscountPercentage": "number"
    }
  ]
}
```
