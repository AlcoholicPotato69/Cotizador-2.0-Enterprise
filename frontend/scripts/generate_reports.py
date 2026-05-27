import os

reports_dir = r"h:\Cotizador-2.0-Enterprise\frontend"

reports = {
    "FUNCTIONAL_BROWSER_AUDIT.md": "# FUNCTIONAL BROWSER AUDIT\n\n## Playwright Execution Results\n- **Status**: ROTO\n- **Details**: Playwright failed due to navigation timeout on `/auth/login`. The login cannot complete, indicating either a broken backend integration, offline backend server, or missing proxy. No screens beyond login could be audited functionally.\n",
    "LEGIBILITY_AUDIT.md": "# LEGIBILITY AUDIT\n\n## Analysis\n- **Status**: NO AUDITABLE (Blocked by Login)\n- Since the application cannot navigate past the login screen due to integration issues, deep visual legibility audit across internal screens is blocked.\n",
    "THEME_ENGINE_AUDIT.md": "# THEME ENGINE AUDIT\n\n## Issues Detected\n- Found `bg-white/20` hardcoded in `src/views/LoginView.vue`.\n- No other hardcoded `bg-white` or `text-black` detected. System correctly uses `dark:` and `surface-*` tokens.\n- **Correction applied**: Replaced hardcoded string with tokens.\n",
    "COMPONENT_LIBRARY_AUDIT.md": "# COMPONENT LIBRARY AUDIT\n\n## Component Verification\n- BaseButton -> Implemented as `DsButton.vue` (IMPLEMENTADO)\n- BaseInput -> Implemented as `DsInput.vue` (IMPLEMENTADO)\n- BaseTextarea -> Implemented as `DsTextarea.vue` (IMPLEMENTADO)\n- BaseSelect -> Implemented as `DsSelect.vue` (IMPLEMENTADO)\n- BaseCheckbox -> Implemented as `DsCheckbox.vue` (IMPLEMENTADO)\n- BaseSwitch -> Implemented as `DsCheckbox.vue`/Toggle (PARCIAL - no Switch specific)\n- BaseModal -> Implemented as `DsModal.vue` (IMPLEMENTADO)\n- BaseDrawer -> Implemented as `DsDrawer.vue` (IMPLEMENTADO)\n- BaseTable -> Implemented as `DsTable.vue` (IMPLEMENTADO)\n- BaseBadge -> Implemented as `DsBadge.vue` and `DsTag.vue` (IMPLEMENTADO)\n- BaseCard -> Implemented as `DsCard.vue` (IMPLEMENTADO)\n- BaseTabs -> Implemented as `DsTabs.vue` (IMPLEMENTADO)\n",
    "LAYOUT_AUDIT.md": "# LAYOUT AUDIT\n\n## Verification\n- Layout components exist (`Sidebar`, `Topbar`, etc.).\n- Playwright verification blocked by login failure.\n",
    "RBAC_UI_AUDIT.md": "# RBAC UI AUDIT\n\n## Static Analysis Results\n- Checked for `role ===`, `user.role ===`, `isAdmin()`.\n- Found some references to `authStore.user?.role` in `AppLayout.vue` and `PermissionSimulator.vue`.\n- No dangerous hardcoded bypasses found.\n- Architecture is sound but `hasPermission()` should strictly wrap all conditional renders.\n",
    "TENANT_UI_AUDIT.md": "# TENANT UI AUDIT\n\n## Static Analysis Results\n- Checked for `tenant === 'pm'`, `tenant === 'cp'`.\n- No hardcoded string checks found.\n- System correctly uses `currentTenant`.\n",
    "FRONTEND_BACKEND_MAPPING.md": "# FRONTEND-BACKEND MAPPING\n\n## Verification\n- Endpoints match definitions in `src/api/`.\n- The major issue is the backend is currently inaccessible from the frontend E2E process.\n",
    "NETWORK_AUDIT.md": "# NETWORK AUDIT\n\n## Interceptors & Services\n- Checked `src/api/http.ts` or `authService.ts`.\n- **Status**: ROTO (Backend Unreachable)\n",
    "DOCUMENT_VIEWER_AUDIT.md": "# DOCUMENT VIEWER AUDIT\n\n## Verification\n- `DsDocumentViewer.vue` and `BaseDossierViewer.vue` and `PdfPreview.vue` exist.\n- Components implement zooming and download functions via PdfPreview.\n",
    "NOTIFICATION_AUDIT.md": "# NOTIFICATION FRAMEWORK AUDIT\n\n## Verification\n- `DsNotificationPanel.vue`, `DsNotificationItem.vue`, `DsToast.vue` exist.\n",
    "FRONTEND_ACCEPTANCE_REPORT.md": "# FRONTEND ACCEPTANCE REPORT\n\n## Final Status: FAIL\n\n- FRONTEND_INVENTORY = PASS\n- FUNCTIONAL_BROWSER = FAIL (Login timeout)\n- LEGIBILITY = BLOCKED\n- THEME_ENGINE = PARCIAL\n- COMPONENT_LIBRARY = PASS\n- LAYOUT = BLOCKED\n- RBAC = PASS\n- TENANT = PASS\n- FRONTEND_BACKEND_MAPPING = FAIL\n- NETWORK = FAIL\n- DOCUMENT_VIEWER = PASS\n- NOTIFICATION_FRAMEWORK = PASS\n\n**Conclusion**: Phase 0 blocked due to backend offline/integration failure. We cannot proceed to Phase 1 until the backend server is running and the auth endpoint responds.\n"
}

for filename, content in reports.items():
    with open(os.path.join(reports_dir, filename), "w", encoding="utf-8") as f:
        f.write(content)

print("Generated all audit reports.")
