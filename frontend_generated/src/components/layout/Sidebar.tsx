import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTenantStore } from '../../core/tenant';
import { usePermissionStore } from '../../core/permissions';
import { useAuthStore } from '../../core/auth';
import { cn } from '../../utils';
import { 
  BarChart3, Users, Files, LayoutDashboard, Settings, Map as MapIcon, FileText, 
  Building2, Calendar, Briefcase, GitMerge, Wallet, ShieldCheck, Archive, 
  BarChart, CheckSquare, Search, Activity, Scale, Eye, Fingerprint, History, Database, Sliders, Hash,
  ChevronDown
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export function Sidebar() {
  const { currentTenant, tenantMetadata, setTenant } = useTenantStore();
  const tenant = currentTenant ? tenantMetadata[currentTenant] : null;
  const authUser = useAuthStore(state => state.user);
  const [isTenantMenuOpen, setIsTenantMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsTenantMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const routes = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard, perm: 'dashboard.view' },
    { name: 'CRM', path: '/app/clients', icon: Users, perm: 'clients.read' },
    { name: 'Agenda', path: '/app/agenda', icon: Calendar, perm: 'schedule.view' },
  ];

  const comercialRoutes = [
    { name: 'Cotizaciones', path: '/app/quotes', icon: FileText, perm: 'quotes.read' },
    { name: 'Contratos', path: '/app/contracts', icon: Briefcase, perm: 'contracts.read' },
    { name: 'Convenios', path: '/app/agreements', icon: GitMerge, perm: 'contracts.read' },
    { name: 'Expedientes / Bóveda', path: '/app/boveda', icon: Building2, perm: 'admin.access' },
    { name: 'Finanzas', path: '/app/finance', icon: Wallet, perm: 'finance.view' },
  ];

  const operacionRoutes = [
    { name: 'Mis Tareas', path: '/app/tasks', icon: CheckSquare, perm: 'admin.access' },
    { name: 'Workflow', path: '/app/workflow', icon: GitMerge, perm: 'admin.access' },
    { name: 'Rev. y Aprob.', path: '/app/reviews', icon: Eye, perm: 'admin.access' },
    { name: 'Gest. Jurídica', path: '/app/legal', icon: Scale, perm: 'legal.write' },
  ];

  const adminRoutes = [
    { name: 'Reportes Detallados', path: '/app/reports', icon: BarChart, perm: 'audit.read' },
    { name: 'Centro de Auditoría', path: '/app/audit', icon: ShieldCheck, perm: 'audit.read' },
    { name: 'Archivo', path: '/app/archive', icon: Archive, perm: 'admin.access' },
    { name: 'Observabilidad', path: '/app/observability', icon: Eye, perm: 'admin.access' },
  ];

  const systemRoutes = [
    { name: 'Catálogo (Espacios)', path: '/app/catalog', icon: MapIcon, perm: 'catalog.view' },
    { name: 'Reglamentos', path: '/app/regulations', icon: FileText, perm: 'admin.access' },
    { name: 'Plantillas', path: '/app/settings/templates', icon: FileText, perm: 'settings.view' },
    { name: 'Folios', path: '/app/numbering', icon: Hash, perm: 'admin.access' },
    { name: 'Configuración', path: '/app/settings', icon: Settings, perm: 'settings.view' },
  ];

  const hasPermission = usePermissionStore(state => state.hasPermission);

  const hasAnyAdminPerm = [...adminRoutes, ...systemRoutes].some(r => r.perm && hasPermission(r.perm as any));
  
  const allowedTenantsList = Object.values(tenantMetadata).filter(t => {
     if (t.id === 'admin') return hasAnyAdminPerm;
     return true;
  });

  const NavGroup = ({ title, routesList, allowedTenants }: { title: string, routesList: any[], allowedTenants?: string[] }) => {
    if (allowedTenants && currentTenant && !allowedTenants.includes(currentTenant)) return null;

    const visibleRoutes = routesList.filter(r => !r.perm || hasPermission(r.perm as any));
    
    if (visibleRoutes.length === 0) return null;
    
    return (
      <div className="mt-6 mb-2">
        <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-3 mb-2">{title}</div>
        {visibleRoutes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            end={route.path === '/app'}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-brand-primary",
              isActive 
                ? "bg-bg-surface-hover text-brand-primary" 
                : "text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
            )}
          >
            <route.icon className="w-4 h-4" />
            {route.name}
          </NavLink>
        ))}
      </div>
    );
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-bg-surface border-r border-border-base h-screen flex flex-col sticky top-0 relative z-30">
      <div 
        className="h-16 flex items-center px-4 border-b border-border-base relative shrink-0"
        style={{ backgroundColor: tenant ? tenant.primaryColor + '10' : undefined }}
        ref={menuRef}
      >
        {tenant && (
          <div 
            className="absolute left-0 top-0 bottom-0 w-1" 
            style={{ backgroundColor: tenant.primaryColor }}
          />
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-center px-2 relative cursor-pointer" onClick={() => setIsTenantMenuOpen(!isTenantMenuOpen)}>
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 overflow-hidden">
               <div 
                 className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-black/20 to-black/5 flex-shrink-0 overflow-hidden p-0.5"
                 style={{ backgroundColor: tenant?.primaryColor, color: 'white' }}
               >
                 {tenant?.shortName === 'CP' ? <img src="/logocp2.png" alt="CP" className="w-full h-full object-contain brightness-0 invert" /> :
                  tenant?.shortName === 'PM' ? <img src="/logo.png" alt="PM" className="w-full h-full object-contain brightness-0 invert" /> :
                  tenant?.id === 'admin' ? <Settings className="w-4 h-4" /> :
                  <span className="text-xs font-bold">{tenant?.shortName}</span>}
               </div>
               <span 
                 className="truncate text-lg font-black tracking-tighter uppercase"
                 style={{ color: 'var(--color-brand-primary)' }}
               >
                 {tenant?.name}
               </span>
             </div>
             <ChevronDown className={cn("w-4 h-4 transition-transform text-text-secondary", isTenantMenuOpen && "rotate-180")} style={{ color: 'var(--color-brand-primary)' }} />
           </div>

           <AnimatePresence>
             {isTenantMenuOpen && (
               <motion.div
                 initial={{ opacity: 0, y: -5, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: -5, scale: 0.95 }}
                 transition={{ duration: 0.15 }}
                 className="absolute top-12 left-0 right-0 mt-2 w-[calc(100%+16px)] -ml-2 bg-bg-surface border border-border-base rounded-md shadow-lg overflow-hidden py-1 z-50"
               >
                 {allowedTenantsList.map((t) => (
                   <button
                     key={t.id}
                     onClick={(e) => {
                       e.stopPropagation();
                       setTenant(t.id as any);
                       setIsTenantMenuOpen(false);
                     }}
                     className={cn(
                       "w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-bg-surface-hover transition-colors",
                       currentTenant === t.id ? "bg-bg-surface-hover" : ""
                     )}
                   >
                     <div 
                       className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-black/20 to-black/5 flex-shrink-0 overflow-hidden p-0.5"
                       style={{ backgroundColor: t.primaryColor, color: 'white' }}
                     >
                       {t.shortName === 'CP' ? <img src="/logocp2.png" alt="CP" className="w-full h-full object-contain brightness-0 invert" /> :
                        t.shortName === 'PM' ? <img src="/logo.png" alt="PM" className="w-full h-full object-contain brightness-0 invert" /> :
                        t.id === 'admin' ? <Settings className="w-4 h-4" /> :
                        <span className="text-xs font-bold">{t.shortName}</span>}
                     </div>
                     <span className="text-sm font-bold text-text-primary uppercase tracking-tighter truncate">{t.name}</span>
                   </button>
                 ))}
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 block scrollbar-thin scrollbar-thumb-border-base">
        <NavGroup title="Área de Trabajo" routesList={routes} allowedTenants={['plaza_mayor', 'casa_de_piedra']} />
        <NavGroup title="Comercial" routesList={comercialRoutes} allowedTenants={['plaza_mayor', 'casa_de_piedra']} />
        <NavGroup title="Operación" routesList={operacionRoutes} allowedTenants={['plaza_mayor', 'casa_de_piedra']} />
        <NavGroup title="Trazabilidad" routesList={adminRoutes} allowedTenants={['admin']} />
        <NavGroup title="Sistema" routesList={systemRoutes} allowedTenants={['admin']} />
      </nav>

      <div className="p-4 border-t border-border-base bg-bg-surface shrink-0">
        <div className="bg-bg-surface-hover rounded-lg p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-border-strong flex items-center justify-center text-text-primary font-bold">
            {authUser ? `${authUser.firstName?.[0] || ''}${authUser.lastName?.[0] || ''}` : '??'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{authUser ? `${authUser.firstName} ${authUser.lastName}` : 'Sin sesión'}</p>
            <p className="text-xs text-text-secondary truncate">{authUser?.role || ''}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
