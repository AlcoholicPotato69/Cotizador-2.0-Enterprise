import { BaseCard } from '../../components/base/BaseCard';
import React, { useState, useEffect } from 'react';
import { useTenantStore, TenantId } from '../../core/tenant';
import { Building2, Shield, Users, Database, Palette } from 'lucide-react';
import { PermissionGuard } from '../../core/PermissionGuard';
import { BaseInput } from '../../components/base/BaseInput';
import { BaseButton } from '../../components/base/BaseButton';

export function SettingsGeneral() {
  const { currentTenant, tenantMetadata, updateTenantColor } = useTenantStore();
  const tenant = currentTenant ? tenantMetadata[currentTenant] : null;

  const [colorInput, setColorInput] = useState(tenant?.primaryColor || '#000000');

  useEffect(() => {
    if (tenant) {
      setColorInput(tenant.primaryColor);
    }
  }, [tenant]);

  const handleUpdateColor = () => {
    if (currentTenant) {
      updateTenantColor(currentTenant, colorInput);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
      <BaseCard title="Información de la Organización" headerAction={<Building2 className="w-5 h-5 text-text-tertiary" />}>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-text-secondary">Nombre Legal</p>
            <p className="text-sm text-text-primary font-semibold">{tenant?.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary">Identificador (Clave)</p>
            <p className="text-sm text-text-primary font-mono bg-bg-surface-hover inline-block px-2 py-1 rounded mt-1">{tenant?.id}</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard title="Identidad Visual (Color Dinámico)" headerAction={<Palette className="w-5 h-5 text-text-tertiary" />}>
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Modifique el color base. Esta propiedad viajará desde el backend e inyectará CSS variables globalmente, sin depender de clases hardcodeadas.
          </p>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full border-2 border-border-base cursor-pointer shrink-0" style={{ backgroundColor: colorInput }}>
                <input 
                  type="color" 
                  value={colorInput} 
                  onChange={(e) => setColorInput(e.target.value)}
                  className="opacity-0 w-full h-full cursor-pointer"
                />
             </div>
             <BaseInput 
               value={colorInput} 
               onChange={(e) => setColorInput(e.target.value)} 
               className="flex-1 font-mono uppercase"
             />
             <BaseButton variant="primary" onClick={handleUpdateColor}>
               Aplicar Cambio
             </BaseButton>
          </div>
        </div>
      </BaseCard>

      <PermissionGuard permissions="settings.view" fallback={
        <BaseCard title="Seguridad y Roles" headerAction={<Shield className="w-5 h-5 text-text-tertiary" />}>
            <p className="text-sm text-text-secondary">No tienes permisos para ver esta sección.</p>
        </BaseCard>
      }>
        <BaseCard title="Seguridad y Roles" headerAction={<Shield className="w-5 h-5 text-text-tertiary" />}>
          <div className="space-y-3">
            <p className="text-sm text-text-secondary">Políticas de acceso y matrices de permisos configuradas a nivel de Tenant.</p>
            <button className="text-sm font-medium text-brand-primary hover:underline">Gestionar Roles &rarr;</button>
          </div>
        </BaseCard>
      </PermissionGuard>

      <BaseCard title="Plantillas y Datos" headerAction={<Database className="w-5 h-5 text-text-tertiary" />}>
        <div className="space-y-3">
          <p className="text-sm text-text-secondary">Configuración de PDFs, numeración de folios, impuestos y firmas.</p>
          <button className="text-sm font-medium text-brand-primary hover:underline">Configurar Engine &rarr;</button>
        </div>
      </BaseCard>

    </div>
  );
}
