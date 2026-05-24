# Antigravity Design Constitution
## ERP Cotizador 2.0 Enterprise

### 1. The Goal
Our primary objective is to deliver an unparalleled Enterprise ERP experience that transcends the traditional, clunky aesthetics of legacy systems. The Antigravity Cotizador 2.0 Enterprise must feel as fluid as Linear, as trustworthy as Salesforce, as customizable as Notion, and as precise as Stripe. We are building a high-agency, professional-grade tool designed for speed, clarity, and delight.

### 2. The Enterprise Premium Philosophy
We reject the notion that B2B software has to be visually unappealing or overly complex. Our philosophy is rooted in:
- **Spatial Rhythm:** Generous but intentional whitespace. Every component breathes, establishing a clear visual hierarchy.
- **Calibrated Contrast:** Deep, rich dark modes and crisp, luminous light modes. Text must be perfectly legible; borders must be subtle (1px solid with low opacity).
- **Subtle Depth:** Flat design augmented with intentional depth. Soft drop shadows, refined glassmorphism (backdrop-filter), and layered surfaces to communicate elevation without overwhelming the eye.
- **Fluid Micro-interactions:** Every hover, click, and transition should feel instantaneous yet smooth. Motion must be purposeful, guiding the user's focus rather than distracting them.
- **Typographic Excellence:** Using premium sans-serif fonts (e.g., Inter, SF Pro, or Geist). Typography scale must be strict, prioritizing readability and data density where necessary.

### 3. The White Label Directive
The ERP must be fundamentally designed for multi-tenant, white-label scaling.
- **90% Shared DNA:** 90% of the UI components must remain identical across all tenant variations. Structure, spacing, typography sizes, and behaviors are immutable.
- **10% Brand Injection:** Customization is strictly limited to CSS Variables / Design Tokens for primary brand colors, secondary accents, and logo assets.
- **Tokenized Architecture:** No hardcoded hex values. Every color, shadow, and radius must reference a semantic token (e.g., `var(--color-primary-500)`, `var(--radius-md)`). This ensures instant, flawless rebranding without code duplication.
