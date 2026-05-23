# SECURITY REMEDIATION PLAN (J.3)

## 1. Mitigaciones Inmediatas (Previo a J.4)
- **ZT-03 (High)**: Implementar `Absolute Token Expiry` (Max 2 horas) y rotación forzada de tokens JWT en PocketBase. Implementar chequeo de IP de origen.
- **ZT-04 (Medium)**: Agregar bloque de `try/catch` estructural en `main.pb.js` para devolver un error `400 - Snapshot Signature Invalid` en vez de tirar el proceso.

## 2. Dictamen de Avance
Los riesgos detectados son periféricos a la arquitectura de cálculo. Ningún atacante logró manipular precios, aforos o contratos. 

**Se autoriza la resolución de los hallazgos ZT-03 y ZT-04 y el paso inmediato a la Fase J.4 (Automated Testing).**