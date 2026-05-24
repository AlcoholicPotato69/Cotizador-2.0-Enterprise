# Dashboard Designs & Architecture
## ERP Cotizador 2.0 Enterprise

This document defines the high-level visual structure and metrics for the primary entry points of the ERP.

### 1. Executive Dashboard (High-Level Overview)
**Target Audience:** C-Level, VPs, Directors.
**Goal:** Instant pulse check of the business. Focus on trends, aggregated data, and high-level health metrics.
**Vibe:** Minimalist, data-dense but highly breathable, Stripe-like financial reporting.

#### Structure & Layout
- **Hero Section:** Greeting + Last Updated timestamp.
- **Key Performance Indicators (KPIs) Row:** 4 main cards.
  - *Metrics:* Total Revenue (MTD), Active Quotes Value, Conversion Rate (Win/Loss), Outstanding Invoices.
  - *Visuals:* Large primary number, subtle sparkline graph in the background, green/red trend indicator (+5.2% vs last month).
- **Secondary Data Row (Split View):**
  - *Left (60%):* Revenue Trend Chart (Smooth area chart, gradient fill).
  - *Right (40%):* Top Performing Products/Services List (Avatars/Icons + Name + Value).
- **Actionable Insights:** AI-generated or rule-based alerts (e.g., "3 high-value quotes expire this week").

### 2. Operative Dashboard (Daily Execution)
**Target Audience:** Sales Reps, Account Managers, Support.
**Goal:** Drive immediate action, manage tasks, and track personal/team progress.
**Vibe:** Linear-like task management, high-agency, keyboard-first navigation.

#### Structure & Layout
- **Command Center:** Prominent global search bar (Cmd/Ctrl + K) at the top.
- **Urgent Action Items (Inbox Style):**
  - Quotes awaiting approval.
  - Follow-ups scheduled for today.
  - Recent activity feed.
- **Personal Pipeline (Kanban or List view):**
  - Drafts -> Sent -> Negotiating -> Won/Lost.
  - Drag-and-drop capability.
  - Micro-interactions on hover (Quick actions: Edit, Send Email, Duplicate).
- **Quick Metrics:** Personal quota attainment, deals closed this week, average response time.

### 3. Global Dashboard Components
- **Sidebar Navigation:** Collapsible, subtle active states, group headers. Includes user profile and quick tenant switcher (if applicable).
- **Top Bar:** Breadcrumbs, Global Search, Notification Bell, Dark/Light mode toggle.
- **Data Tables:** Sticky headers, ultra-thin borders, inline editing (where applicable), pagination/infinite scroll, bulk action floating bar.
