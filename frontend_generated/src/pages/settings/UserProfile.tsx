import { BaseCard } from '../../components/base/BaseCard';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseInput } from '../../components/base/BaseInput';
import { BaseModal } from '../../components/base/BaseModal';
import React, { useState, useEffect } from 'react';
import { User, Shield, Briefcase, Mail } from 'lucide-react';
import { toast } from 'sonner';

export function UserProfile() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  useEffect(() => {
    // Simulate checking if user needs to change password on first login
    const hasChangedPassword = localStorage.getItem('has_changed_password');
    if (!hasChangedPassword) {
      setIsPasswordModalOpen(true);
    }
  }, []);

  const handlePasswordChange = () => {
    if (!newPassword || newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }
    localStorage.setItem('has_changed_password', 'true');
    setIsPasswordModalOpen(false);
    toast.success('Contraseña actualizada exitosamente.');
  };
  const dummyPermissions = [
    'quotes:read',
    'quotes:write',
    'clients:read',
    'clients:write',
    'catalog:read',
    'dossiers:read'
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Mi Perfil</h1>
          <p className="text-text-secondary mt-1">Configuración personal y detalles de acceso.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-bg-surface border border-border-base rounded-xl p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-brand-primary/10 text-brand-primary mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Juan Ventas</h2>
            <p className="text-sm text-text-secondary mt-1">Director Comercial</p>
            
            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-primary">juan.ventas@acmecorp.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-primary">Acme Corp (Casa de Piedra)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <BaseCard title="Roles Asignados" headerAction={<Shield className="w-5 h-5 text-text-tertiary" />}>
             <div className="space-y-2">
                 <div className="flex items-center gap-3 p-3 border border-border-base rounded-lg bg-bg-base text-sm font-medium text-text-primary">
                    <div className="w-2 h-2 rounded-full bg-brand-primary" />
                    Director Comercial
                 </div>
                 <div className="flex items-center gap-3 p-3 border border-border-base rounded-lg bg-bg-base text-sm font-medium text-text-primary">
                    <div className="w-2 h-2 rounded-full bg-border-strong" />
                    Visor de Catálogo
                 </div>
             </div>
          </BaseCard>

          <BaseCard title="Permisos Activos (RBAC)" headerAction={<Shield className="w-5 h-5 text-text-tertiary" />}>
            <div>
              <p className="text-sm text-text-secondary mb-4">Los siguientes permisos determinan qué acciones puedes realizar en el sistema.</p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                 {dummyPermissions.map(p => (
                   <div key={p} className="px-3 py-2 border border-border-base rounded text-xs font-mono text-text-primary bg-bg-base">
                     {p}
                   </div>
                 ))}
              </div>
            </div>
          </BaseCard>
        </div>
      </div>

      <BaseModal
        title="Actualización de Contraseña Requerida"
        isOpen={isPasswordModalOpen}
        onClose={() => {
          if (localStorage.getItem('has_changed_password')) {
            setIsPasswordModalOpen(false);
          } else {
            toast.warning('Debe actualizar su contraseña para continuar.');
          }
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Por políticas de seguridad, es necesario que actualice su contraseña temporal antes de continuar utilizando el sistema.
          </p>
          <BaseInput
            type="password"
            label="Nueva Contraseña"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <BaseInput
            type="password"
            label="Confirmar Contraseña"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="flex justify-end pt-4">
            <BaseButton variant="primary" onClick={handlePasswordChange}>
              Actualizar y Continuar
            </BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
