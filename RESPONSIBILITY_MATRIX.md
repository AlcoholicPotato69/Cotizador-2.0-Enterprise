# RESPONSIBILITY MATRIX & COMMUNICATION PROTOCOL

## Responsibility Matrix

| Fase / Entregable | Creador Autorizado | Revisores Requeridos | Aprobación Final |
| :--- | :--- | :--- | :--- |
| **Domain Map & Boundaries** | Enterprise Architect | Solution Architect, Product Owner | Director Técnico |
| **Database Model** | Database Architect | Solution Architect, Security Architect | Enterprise Architect |
| **Prisma Repositories** | Solution Architect | Backend Lead, Database Architect | Director Técnico |
| **NestJS Services** | Backend Lead | QA Authority, Security Architect | Release Authority |
| **Vue Components** | Frontend Lead | Backend Lead, Product Owner | Release Authority |
| **Test Strategy** | QA Authority | Test Automation Engineer | Release Authority |

## Communication Protocol (Execution Rules)

1. **Pre-Coding Authorization:** Ningún constructor (Backend/Frontend) puede programar una línea sin que el Diseño Arquitectónico haya sido aprobado por el Enterprise Architect y el Security Architect.
2. **Certification Gate:** Ningún dominio puede declararse terminado sin emitir `ARCHITECTURE_CERTIFICATION`, `SECURITY_CERTIFICATION`, `QA_CERTIFICATION` y `RELEASE_CERTIFICATION`.
3. **Agent Context:** Cada agente mantendrá un archivo `agent_context.md` en su subdirectorio describiendo Objetivos, Decisiones, Bloqueadores y Dependencias.
