import { create } from 'zustand';
import { Permission } from './permissions';

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  path?: string;
  requiredPermission?: Permission;
  dismissed?: boolean;
}

interface NotificationState {
  items: NotificationItem[];
  add: (notification: Omit<NotificationItem, 'id' | 'read' | 'createdAt' | 'dismissed'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  remove: (id: string) => void;
  dismissToast: (id: string) => void;
  unreadCount: (hasPermissionCb: (perm: Permission | Permission[]) => boolean) => number;
  getVisibleItems: (hasPermissionCb: (perm: Permission | Permission[]) => boolean) => NotificationItem[];
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  items: [],
  add: (notif) => {
    const newItem: NotificationItem = {
      ...notif,
      id: crypto.randomUUID(),
      read: false,
      dismissed: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ items: [newItem, ...state.items] }));
  },
  markAsRead: (id) => set((state) => ({
    items: state.items.map(item => item.id === id ? { ...item, read: true } : item)
  })),
  markAllAsRead: () => set((state) => ({
    items: state.items.map(item => ({ ...item, read: true }))
  })),
  remove: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  dismissToast: (id) => set((state) => ({
    items: state.items.map(item => item.id === id ? { ...item, dismissed: true } : item)
  })),
  getVisibleItems: (hasPermissionCb) => {
    return get().items.filter(item => !item.requiredPermission || hasPermissionCb(item.requiredPermission));
  },
  unreadCount: (hasPermissionCb) => {
    return get().getVisibleItems(hasPermissionCb).filter(item => !item.read).length;
  },
}));
