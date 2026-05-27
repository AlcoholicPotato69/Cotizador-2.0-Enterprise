import React, { useState } from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseButton } from '../../components/base/BaseButton';
import { toast } from 'sonner';

export function NotificationSettings() {
  const [preferences, setPreferences] = useState({
    email_approvals: true,
    email_payments: false,
    email_tasks: true,
    inapp_approvals: true,
    inapp_payments: true,
    inapp_tasks: true,
    push_mobile: false,
    browser_push: false,
  });

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Este navegador no soporta notificaciones de escritorio');
      return;
    }

    if (Notification.permission === 'granted') {
      setPreferences(prev => ({ ...prev, browser_push: true }));
      toast.success('Notificaciones push habilitadas');
      return;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPreferences(prev => ({ ...prev, browser_push: true }));
        toast.success('Notificaciones push habilitadas');
      } else {
        setPreferences(prev => ({ ...prev, browser_push: false }));
        toast.error('Permiso para notificaciones denegado');
      }
    } else {
      toast.error('Permiso previamente denegado. Debes habilitarlo en configuración del navegador.');
    }
  };

  const handleToggle = (key: keyof typeof preferences) => {
    if (key === 'browser_push' && !preferences.browser_push) {
      requestPushPermission();
      return;
    }
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    toast.success('Preferencias de notificaciones actualizadas');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <BaseCard title="Preferencias de Notificación">
        <div className="space-y-6">
          <p className="text-text-secondary text-sm">
            Configura cómo y cuándo deseas recibir alertas sobre las actividades del ERP.
          </p>

          <div className="space-y-4">
            <h3 className="font-medium text-text-primary border-b border-border-base pb-2">Notificaciones de Aprobaciones</h3>
            
            <div className="flex items-center justify-between">
               <div>
                  <p className="font-medium text-text-primary text-sm">Alertas In-App</p>
                  <p className="text-text-tertiary text-xs">Recibir notificaciones dentro de la campanita del sistema</p>
               </div>
               <input 
                 type="checkbox" 
                 className="h-5 w-5 rounded border-border-strong text-brand-primary focus:ring-brand-primary" 
                 checked={preferences.inapp_approvals}
                 onChange={() => handleToggle('inapp_approvals')}
               />
            </div>
            
            <div className="flex items-center justify-between">
               <div>
                  <p className="font-medium text-text-primary text-sm">Correos Electrónicos</p>
                  <p className="text-text-tertiary text-xs">Recibir un correo electrónico cuando se requiere revisión</p>
               </div>
               <input 
                 type="checkbox" 
                 className="h-5 w-5 rounded border-border-strong text-brand-primary focus:ring-brand-primary" 
                 checked={preferences.email_approvals}
                 onChange={() => handleToggle('email_approvals')}
               />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="font-medium text-text-primary border-b border-border-base pb-2">Notificaciones de Pagos y Finanzas</h3>
            
            <div className="flex items-center justify-between">
               <div>
                  <p className="font-medium text-text-primary text-sm">Alertas In-App</p>
                  <p className="text-text-tertiary text-xs">Alertas sobre pagos recibidos o pendientes</p>
               </div>
               <input 
                 type="checkbox" 
                 className="h-5 w-5 rounded border-border-strong text-brand-primary focus:ring-brand-primary" 
                 checked={preferences.inapp_payments}
                 onChange={() => handleToggle('inapp_payments')}
               />
            </div>
            
            <div className="flex items-center justify-between">
               <div>
                  <p className="font-medium text-text-primary text-sm">Correos Electrónicos</p>
                  <p className="text-text-tertiary text-xs">Resumen diario de ingresos</p>
               </div>
               <input 
                 type="checkbox" 
                 className="h-5 w-5 rounded border-border-strong text-brand-primary focus:ring-brand-primary" 
                 checked={preferences.email_payments}
                 onChange={() => handleToggle('email_payments')}
               />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="font-medium text-text-primary border-b border-border-base pb-2">Notificaciones de Escritorio (Push)</h3>
            
            <div className="flex items-center justify-between">
               <div>
                  <p className="font-medium text-text-primary text-sm">Alertas Push en el Navegador</p>
                  <p className="text-text-tertiary text-xs">Recibe alertas importantes del ERP incluso si la pestaña no está activa</p>
               </div>
               <input 
                 type="checkbox" 
                 className="h-5 w-5 rounded border-border-strong text-brand-primary focus:ring-brand-primary" 
                 checked={preferences.browser_push}
                 onChange={() => handleToggle('browser_push')}
               />
            </div>
          </div>

          <div className="pt-6 flex justify-end">
             <BaseButton variant="primary" onClick={handleSave}>
                Guardar Cambios
             </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
  );
}
