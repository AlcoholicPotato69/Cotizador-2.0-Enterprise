import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useThemeStore } from './core/theme';
import { RouteGuard } from './core/RouteGuard';
import { Login } from './pages/auth/Login';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { QuotesList } from './pages/quotes/QuotesList';
import { QuoteDetails } from './pages/quotes/QuoteDetails';
import { CatalogList } from './pages/catalog/CatalogList';
import { CatalogDetails } from './pages/catalog/CatalogDetails';
import { DossierDashboard } from './pages/dossiers/DossierDashboard';
import { DocumentViewer } from './pages/dossiers/DocumentViewer';
import { DocumentVault } from './pages/dossiers/DocumentVault';
import { ClientsList } from './pages/clients/ClientsList';
import { ClientDetails } from './pages/clients/ClientDetails';
import { Settings } from './pages/settings/Settings';
import { SettingsGeneral } from './pages/settings/SettingsGeneral';
import { UsersList } from './pages/settings/UsersList';
import { RolesPermissions } from './pages/settings/RolesPermissions';
import { UserProfile } from './pages/settings/UserProfile';
import { NotificationSettings } from './pages/settings/NotificationSettings';
import { AgendaDashboard } from './pages/agenda/AgendaDashboard';
import { FinanceDashboard } from './pages/finance/FinanceDashboard';
import { ContractsList } from './pages/contracts/ContractsList';
import { AgreementsList } from './pages/agreements/AgreementsList';
import { WorkflowDashboard } from './pages/workflow/WorkflowDashboard';
import { ReportsDashboard } from './pages/reports/ReportsDashboard';
import { AuditDashboard } from './pages/audit/AuditDashboard';
import { ArchiveDashboard } from './pages/archive/ArchiveDashboard';

// Nuevos módulos generados
import { ReviewsDashboard } from './pages/reviews/ReviewsDashboard';
import { ApprovalsDashboard } from './pages/approvals/ApprovalsDashboard';
import { RegulationsDashboard } from './pages/regulations/RegulationsDashboard';
import { StorageDashboard } from './pages/storage/StorageDashboard';
import { OperationsDashboard } from './pages/operations/OperationsDashboard';
import { FeatureFlagsDashboard } from './pages/featureFlags/FeatureFlagsDashboard';
import { TenantsDashboard } from './pages/tenants/TenantsDashboard';
import { NumberingDashboard } from './pages/numbering/NumberingDashboard';
import { ProcessDashboard } from './pages/processes/ProcessDashboard';
import { LegalDashboard } from './pages/legal/LegalDashboard';
import { ObservabilityDashboard } from './pages/observability/ObservabilityDashboard';
import { TasksDashboard } from './pages/tasks/TasksDashboard';
import { FinancialSettings } from './pages/settings/FinancialSettings';
import { SettingsTemplates } from './pages/settings/SettingsTemplates';
import { CommandCenter } from './pages/command/CommandCenter';
import { FsmVisualizationEngine } from './pages/fsm/FsmVisualizationEngine';

import { Toaster } from 'sonner';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98, y: 15 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.98, y: -15 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="h-full w-full outline-none"
  >
    {children}
  </motion.div>
);

function App() {
  const { initialize } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const getPageTitle = (pathname: string) => {
      if (pathname.includes('/clients')) return 'Directorio de Clientes';
      if (pathname.includes('/quotes')) return 'Cotizaciones';
      if (pathname.includes('/contracts')) return 'Contratos';
      if (pathname.includes('/agreements')) return 'Convenios';
      if (pathname.includes('/agenda')) return 'Agenda';
      if (pathname.includes('/catalog')) return 'Catálogo de Espacios';
      if (pathname.includes('/dossiers') || pathname.includes('/boveda')) return 'Bóveda de Expedientes';
      if (pathname.includes('/finance')) return 'Finanzas';
      if (pathname.includes('/settings/users')) return 'Gestión de Usuarios';
      if (pathname.includes('/settings/roles')) return 'Roles y Permisos';
      if (pathname.includes('/settings')) return 'Configuración';
      if (pathname === '/app') return 'Dashboard';
      return 'ERP';
    };

    document.title = `Cotizador | ${getPageTitle(location.pathname)}`;
  }, [location]);

  return (
    <>
      <Toaster position="top-right" richColors duration={5000} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<PageWrapper><RouteGuard permissions="dashboard.view"><Dashboard /></RouteGuard></PageWrapper>} />
            
            {/* CRM */}
            <Route path="clients" element={<PageWrapper><RouteGuard permissions="clients.read"><ClientsList /></RouteGuard></PageWrapper>} />
            <Route path="clients/:id" element={<PageWrapper><RouteGuard permissions="clients.read"><ClientDetails /></RouteGuard></PageWrapper>} />
            
            {/* Operaciones */}
            <Route path="quotes" element={<PageWrapper><RouteGuard permissions="quotes.read" tenantMode="commercial_only"><QuotesList /></RouteGuard></PageWrapper>} />
            <Route path="quotes/:id" element={<PageWrapper><RouteGuard permissions="quotes.read" tenantMode="commercial_only"><QuoteDetails /></RouteGuard></PageWrapper>} />
            <Route path="contracts" element={<PageWrapper><RouteGuard permissions="contracts.read" tenantMode="commercial_only"><ContractsList /></RouteGuard></PageWrapper>} />
            <Route path="agreements" element={<PageWrapper><RouteGuard permissions="contracts.read" tenantMode="commercial_only"><AgreementsList /></RouteGuard></PageWrapper>} />
            <Route path="agenda" element={<PageWrapper><RouteGuard permissions="schedule.view" tenantMode="commercial_only"><AgendaDashboard /></RouteGuard></PageWrapper>} />
            <Route path="catalog" element={<PageWrapper><RouteGuard permissions="catalog.view" tenantMode="admin_only"><CatalogList /></RouteGuard></PageWrapper>} />
            <Route path="catalog/:id" element={<PageWrapper><RouteGuard permissions="catalog.view" tenantMode="admin_only"><CatalogDetails /></RouteGuard></PageWrapper>} />
            
            {/* Documental y Legal */}
            <Route path="dossiers" element={<PageWrapper><RouteGuard permissions="admin.access"><DossierDashboard /></RouteGuard></PageWrapper>} />
            <Route path="boveda" element={<PageWrapper><RouteGuard permissions="admin.access"><DocumentVault /></RouteGuard></PageWrapper>} />
            <Route path="documents/:id" element={<PageWrapper><RouteGuard permissions="admin.access" tenantMode="commercial_only"><DocumentViewer /></RouteGuard></PageWrapper>} />
            <Route path="reviews" element={<PageWrapper><RouteGuard permissions="admin.access" tenantMode="commercial_only"><ReviewsDashboard /></RouteGuard></PageWrapper>} />
            <Route path="regulations" element={<PageWrapper><RouteGuard permissions="admin.access" tenantMode="admin_only"><RegulationsDashboard /></RouteGuard></PageWrapper>} />
            <Route path="legal" element={<PageWrapper><RouteGuard permissions="legal.write" tenantMode="commercial_only"><LegalDashboard /></RouteGuard></PageWrapper>} />
            
            {/* Finanzas */}
            <Route path="finance" element={<PageWrapper><RouteGuard permissions="finance.view" tenantMode="commercial_only"><FinanceDashboard /></RouteGuard></PageWrapper>} />
            
            {/* Workflows / Procesos */}
            <Route path="workflow" element={<PageWrapper><RouteGuard permissions="admin.access" tenantMode="commercial_only"><WorkflowDashboard /></RouteGuard></PageWrapper>} />
            <Route path="approvals" element={<PageWrapper><RouteGuard permissions="admin.access" tenantMode="commercial_only"><ApprovalsDashboard /></RouteGuard></PageWrapper>} />
            <Route path="processes" element={<PageWrapper><RouteGuard permissions="admin.access" tenantMode="commercial_only"><ProcessDashboard /></RouteGuard></PageWrapper>} />
            <Route path="tasks" element={<PageWrapper><RouteGuard permissions="admin.access" tenantMode="commercial_only"><TasksDashboard /></RouteGuard></PageWrapper>} />
            <Route path="fsm" element={<PageWrapper><RouteGuard permissions="admin.access" tenantMode="commercial_only"><FsmVisualizationEngine /></RouteGuard></PageWrapper>} />
            
            {/* Trazabilidad y Archivo */}
            <Route path="reports" element={<PageWrapper><RouteGuard permissions="audit.read" tenantMode="admin_only"><ReportsDashboard /></RouteGuard></PageWrapper>} />
            <Route path="audit" element={<PageWrapper><RouteGuard permissions="audit.read" tenantMode="admin_only"><AuditDashboard /></RouteGuard></PageWrapper>} />
            <Route path="archive" element={<PageWrapper><RouteGuard permissions="admin.access" tenantMode="admin_only"><ArchiveDashboard /></RouteGuard></PageWrapper>} />

            {/* Sistema Core */}
            <Route path="numbering" element={<PageWrapper><RouteGuard permissions="admin.access" tenantMode="admin_only"><NumberingDashboard /></RouteGuard></PageWrapper>} />
            <Route path="observability" element={<PageWrapper><RouteGuard permissions="admin.access" tenantMode="admin_only"><ObservabilityDashboard /></RouteGuard></PageWrapper>} />

            <Route path="settings" element={<PageWrapper><RouteGuard permissions="settings.view" tenantMode="admin_only"><Settings /></RouteGuard></PageWrapper>}>
              <Route index element={<PageWrapper><SettingsGeneral /></PageWrapper>} />
              <Route path="users" element={<PageWrapper><UsersList /></PageWrapper>} />
              <Route path="roles" element={<PageWrapper><RolesPermissions /></PageWrapper>} />
              <Route path="profile" element={<PageWrapper><UserProfile /></PageWrapper>} />
              <Route path="financial" element={<PageWrapper><FinancialSettings /></PageWrapper>} />
              <Route path="templates" element={<PageWrapper><SettingsTemplates /></PageWrapper>} />
              <Route path="notifications" element={<PageWrapper><NotificationSettings /></PageWrapper>} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
