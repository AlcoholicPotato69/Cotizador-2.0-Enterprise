# DOCUMENT SERVICE ARCHITECTURE (Fase 2.1)

## 1. Diseño Base
El microservicio se despliega como un *Sidecar* (Node.js/Playwright) desacoplado del motor central de PocketBase. 
PocketBase actuará como orquestador, enviando solicitudes POST al Sidecar con el `snapshot` del contrato, y el Sidecar devolverá un flujo binario (`.pdf`).