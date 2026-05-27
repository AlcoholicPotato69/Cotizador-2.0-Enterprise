import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../core/theme';
import { useTenantStore } from '../../core/tenant';
import { useNotificationStore } from '../../core/notifications';
import { usePermissionStore } from '../../core/permissions';
import { Search, Bell, Moon, Sun, Monitor, UserCircle, Check } from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';

export function Topbar() {
  const navigate = useNavigate();
  const { mode, setMode } = useThemeStore();
  const { currentTenant, tenantMetadata } = useTenantStore();
  const { unreadCount, getVisibleItems, markAsRead, markAllAsRead } = useNotificationStore();
  const { hasPermission } = usePermissionStore();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  const handleThemeToggle = () => {
    if (mode === 'light') setMode('dark');
    else if (mode === 'dark') setMode('system');
    else setMode('light');
  };

  const getThemeIcon = () => {
    if (mode === 'light') return <Sun className="w-5 h-5" />;
    if (mode === 'dark') return <Moon className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close notifications menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tenant = currentTenant ? tenantMetadata[currentTenant] : null;
  const count = unreadCount(hasPermission);
  const notifications = getVisibleItems(hasPermission);

  const handleNotificationClick = (notif: any) => {
    markAsRead(notif.id);
    setIsNotificationOpen(false);
    if (notif.path) {
      navigate(notif.path);
    }
  };

  return (
    <header className="h-16 border-b border-border-base bg-bg-surface flex items-center justify-between px-6 sticky top-0 z-20 flex-shrink-0">
      <div className="flex-1 flex items-center gap-6">
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-tertiary" />
          </div>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between pl-9 pr-3 py-2 border border-border-base rounded-md leading-5 bg-bg-surface-hover text-text-tertiary hover:bg-bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary sm:text-sm text-left"
          >
            <span>Buscar en todo el sistema...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded border border-border-strong bg-bg-base font-sans text-xs font-medium">⌘K</kbd>
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={handleThemeToggle}
          className="p-2 rounded-md text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
          title={`Tema actual: ${mode}`}
        >
          {getThemeIcon()}
        </button>

        <div className="relative" ref={notificationMenuRef}>
          <button 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 rounded-md text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <Bell className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-bg-surface" />
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-bg-surface border border-border-base rounded-xl shadow-lg z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-border-base flex justify-between items-center bg-bg-surface-hover">
                <h3 className="text-sm font-semibold text-text-primary">Notificaciones</h3>
                {count > 0 && (
                  <button 
                    onClick={() => markAllAsRead()}
                    className="text-xs text-brand-primary hover:underline hover:text-brand-hover flex items-center"
                  >
                    <Check className="w-3 h-3 mr-1" /> Marcar vistas
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-text-secondary">
                    No tienes notificaciones
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-border-base text-left w-full">
                    {notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 text-left hover:bg-bg-surface-hover transition-colors flex flex-col gap-1 w-full relative ${
                          !notif.read ? 'bg-brand-primary/5' : ''
                        }`}
                      >
                        {!notif.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary rounded-r-md"></div>
                        )}
                        <span className={`text-sm font-medium ${!notif.read ? 'text-text-primary' : 'text-text-secondary'}`}>{notif.title}</span>
                        <span className="text-xs text-text-tertiary line-clamp-2 leading-relaxed">{notif.message}</span>
                        <span className="text-[10px] text-text-tertiary mt-1">Hace un momento</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-2 border-t border-border-base text-center bg-bg-surface-hover">
                 <button 
                   onClick={() => { setIsNotificationOpen(false); navigate('/app/settings/notifications'); }}
                   className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                 >
                   Ver todas las notificaciones
                 </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-border-strong mx-1"></div>

        <button 
          onClick={() => navigate('/app/settings/profile')}
          className="flex items-center gap-2 p-1 rounded-md hover:bg-bg-surface-hover focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          <UserCircle className="w-8 h-8 text-text-secondary" />
        </button>
      </div>

      <GlobalSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </header>
  );
}
