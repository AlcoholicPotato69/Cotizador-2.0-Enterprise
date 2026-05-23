# BANK REFERENCE MANAGEMENT ARCHITECTURE (Fase 2.6)

## 1. Asignación Manual Bancaria
La referencia bancaria es el identificador financiero único (`bank_reference`). Es asignada manualmente al perfil del `Client` por el área de Finanzas desde el portal bancario.

## 2. Inmutabilidad en Contratos (Snapshot)
Al firmarse o aprobarse un Contrato, la `bank_reference` actual del cliente se copia dentro del `financial_snapshot`. 
- **Congelamiento**: Si en el futuro Finanzas actualiza la referencia bancaria del cliente en el catálogo principal, el contrato histórico conservará intacta la referencia con la que fue expedido. Las instrucciones de pago en el PDF generado seguirán apuntando a la referencia histórica.