# Network Configuration & Topology

## 1. Architectural Overview
The **Cotizador 2.0 Enterprise** architecture is deployed as a consolidated NestJS monolith that acts as the primary API Server and static file server for the built frontend. This simplifies network topology while providing robust performance.

## 2. Inbound/Outbound Port Requirements

To ensure proper functionality, the following TCP ports must be explicitly permitted through the Windows Defender Firewall and any external network security groups (AWS SG, Azure NSG, physical firewalls):

| Port | Protocol | Scope | Service | Description |
|------|----------|-------|---------|-------------|
| **3000** | TCP | Inbound (External/LAN) | Node.js Monolith | Primary application port. Serves the REST/GraphQL API and the compiled frontend assets. |
| **5432** | TCP | Internal (Localhost) | PostgreSQL | Database listener. Should **NOT** be exposed externally unless required for remote administration (e.g., pgAdmin). |
| **80 / 443** | TCP | Inbound (External) | Reverse Proxy | Optional but recommended for production. Used if placing NGINX/IIS in front of port 3000 for TLS termination. |

## 3. Dynamic IP Binding Strategy
The application is designed to prevent "hardcoded" IP addresses, ensuring portability across different environments (Staging, UAT, Production).

### Modifying Network Bindings
When the server IP changes, or during initial deployment:
1. Execute `start-prod.bat`.
2. The script interactively prompts for the `SERVER_IP`.
3. It automatically updates internal configurations and generates `.env.production` for the Vite build step, injecting `VITE_API_BASE_URL`.
4. The frontend is recompiled to ensure API calls are routed to the new IP address.

*Warning: Manually editing configuration files without recompiling the frontend will result in cross-origin (CORS) or connection timeout errors from the client.*

## 4. Reverse Proxy & SSL/TLS Setup (Recommended)
For enterprise production environments, direct exposure of Port 3000 is not recommended.
1. Deploy a reverse proxy such as **IIS, NGINX, or HAProxy** on the host.
2. Bind the proxy to port 443 (HTTPS) and configure an SSL/TLS certificate.
3. Configure the reverse proxy to forward traffic to `http://127.0.0.1:3000`.
4. Update the `start-prod.bat` IP prompt to reflect the public-facing FQDN (e.g., `cotizador.company.com`) rather than a raw IP, so the frontend directs API requests to the secure proxy.
