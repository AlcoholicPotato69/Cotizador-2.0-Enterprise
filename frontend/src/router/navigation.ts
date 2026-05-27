import { featureFlags, hasPermission } from '../app/access-context';

export interface NavItem {
    label: string;
    icon: string;
    route: string;
    permission?: string;
    featureFlag?: string;
    children?: NavItem[];
}

export const navigationRegistry: NavItem[] = [
    {
        label: 'Dashboard',
        icon: 'pi pi-home',
        route: '/dashboard'
    },
    {
        label: 'Catálogo',
        icon: 'pi pi-th-large',
        route: '/catalog',
        permission: 'catalog:read'
    },
    {
        label: 'Creador de Cotización',
        icon: 'pi pi-calculator',
        route: '/quotes/creator',
        permission: 'quotes:create'
    },
    {
        label: 'Cotizaciones',
        icon: 'pi pi-file-o',
        route: '/quotes',
        permission: 'quotes:read'
    },
    {
        label: 'Contratos',
        icon: 'pi pi-file-edit',
        route: '/legal/contracts',
        permission: 'contracts:read'
    },
    {
        label: 'Agenda',
        icon: 'pi pi-calendar',
        route: '/schedule',
        permission: 'calendar:view'
    },
    {
        label: 'Clientes',
        icon: 'pi pi-users',
        route: '/clients',
        permission: 'clients:read'
    },
    {
        label: 'Recibos',
        icon: 'pi pi-receipt',
        route: '/finance/receipts',
        permission: 'finance:view'
    },
    {
        label: 'Facturas',
        icon: 'pi pi-money-bill',
        route: '/finance/invoices',
        permission: 'finance:view'
    },
    {
        label: 'Reportes',
        icon: 'pi pi-chart-pie',
        route: '/reports',
        permission: 'reports:read'
    },
    {
        label: 'Configuración',
        icon: 'pi pi-cog',
        route: '/tac',
        permission: 'tac:access'
    }
];

export function getAuthorizedNavigation(): NavItem[] {
    return navigationRegistry.filter(item => {
        if (item.featureFlag && !featureFlags(item.featureFlag, true)) {
            return false;
        }

        if (!item.permission) return true;
        return hasPermission(item.permission);
    });
}
