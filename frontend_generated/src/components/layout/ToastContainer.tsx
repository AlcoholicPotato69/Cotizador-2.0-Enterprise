import React, { useEffect } from 'react';
import { useNotificationStore } from '../../core/notifications';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '../../utils';

const ToastItem = ({ toast, dismissToast }: { toast: any, dismissToast: (id: string) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      dismissToast(toast.id);
    }, 10000); // 10 seconds auto-dismiss
    return () => clearTimeout(timer);
  }, [toast.id, dismissToast]);

  return (
    <div
      className={cn(
        "pointer-events-auto w-full bg-bg-surface border rounded-xl shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-right-8 duration-300",
        toast.type === 'info' && "border-border-strong",
        toast.type === 'success' && "border-success/30",
        toast.type === 'warning' && "border-warning/30",
        toast.type === 'error' && "border-danger/30"
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
        {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-success" />}
        {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-warning" />}
        {toast.type === 'error' && <XCircle className="w-5 h-5 text-danger" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary">{toast.title}</p>
        {toast.message && <p className="text-sm text-text-secondary mt-1 leading-snug">{toast.message}</p>}
      </div>
      <button
        onClick={() => dismissToast(toast.id)}
        className="flex-shrink-0 p-1 rounded-md text-text-tertiary hover:bg-bg-surface-hover hover:text-text-primary transition-colors focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export function ToastContainer() {
  const { items, dismissToast } = useNotificationStore();
  const visibleItems = items.filter(item => !item.dismissed);

  return (
    <div className="fixed bottom-0 right-0 z-[100] p-4 sm:p-6 flex flex-col gap-3 pointer-events-none w-full sm:w-auto max-w-sm">
      {visibleItems.map((toast) => (
        <ToastItem key={toast.id} toast={toast} dismissToast={dismissToast} />
      ))}
    </div>
  );
}
