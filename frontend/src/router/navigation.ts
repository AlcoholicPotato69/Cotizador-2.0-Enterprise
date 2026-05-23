import { usePermissionsStore } from '../stores/permissionsStore';

export interface NavItem {
    label: string;
    icon: string;
    route: string;
    permission?: string;
    children?: NavItem[];
}

export const navigationRegistry: NavItem[] = [
    {
        label: 'Dashboard',
        icon: 'LayoutDashboard',
        route: '/dashboard'
    },
    {
        label: 'Cotizaciones',
        icon: 'FileText',
        route: '/quotes',
        permission: 'quotes.read'
    },
    {
        label: 'Contratos',
        icon: 'Briefcase',
        route: '/contracts',
        permission: 'contract.view'
    },
    {
        label: 'Finanzas',
        icon: 'CircleDollarSign',
        route: '/finance',
        permission: 'finance.view'
    },
    {
        label: 'Calendario',
        icon: 'Calendar',
        route: '/calendar',
        permission: 'calendar.view'
    },
    {
        label: 'TAC (Admin)',
        icon: 'Settings',
        route: '/tac',
        permission: 'tac.access'
    }
];

export function getAuthorizedNavigation(): NavItem[] {
    const permissionsStore = usePermissionsStore();
    
    return navigationRegistry.filter(item => {
        if (!item.permission) return true;
        return permissionsStore.can(item.permission);
    });
}
