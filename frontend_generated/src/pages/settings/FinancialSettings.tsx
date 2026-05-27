import React, { useState, useEffect } from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseInput } from '../../components/base/BaseInput';
import { BaseSelect } from '../../components/base/BaseSelect';
import { BaseModal } from '../../components/base/BaseModal';
import { PermissionGuard } from '../../core/PermissionGuard';
import { BaseBadge } from '../../components/base/BaseBadge';
import { Plus, Check, Save, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useTenantStore } from '../../core/tenant';

export function FinancialSettings() {
  const [activeTab, setActiveTab] = useState('pricing');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateContent, setTemplateContent] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateSyntaxError, setTemplateSyntaxError] = useState<string | null>(null);
  const { currentTenant } = useTenantStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState({
    extraHourMode: 'fixed',
    extraHourValue: '1500',
    setupMode: 'fixed',
    setupValue: '800',
    taxMode: 'percentage',
    taxValue: '16',
    retentionMode: 'percentage',
    retentionValue: '0'
  });

  useEffect(() => {
    // Simulate fetching tenant configuration
    setIsLoading(true);
    setTimeout(() => {
      if (currentTenant === 'casa_de_piedra') {
        setConfig({
          extraHourMode: 'fixed',
          extraHourValue: '2000',
          setupMode: 'fixed',
          setupValue: '1000',
          taxMode: 'percentage',
          taxValue: '16',
          retentionMode: 'percentage',
          retentionValue: '0'
        });
      } else {
        setConfig({
          extraHourMode: 'fixed',
          extraHourValue: '1500',
          setupMode: 'fixed',
          setupValue: '800',
          taxMode: 'percentage',
          taxValue: '16',
          retentionMode: 'percentage',
          retentionValue: '0'
        });
      }
      setIsLoading(false);
    }, 500);
  }, [currentTenant]);

  const handleConfigChange = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success(`Configuraciones financieras de ${currentTenant} guardadas exitosamente`);
  };

  const validateTemplateSyntax = (content: string) => {
    const regex = /\{\{(.*?)\}\}/g;
    let match;
    const errors = [];
    
    let balance = 0;
    for (let i = 0; i < content.length; i++) {
        if (content[i] === '{') balance++;
        else if (content[i] === '}') balance--;
        
        if (balance < 0) {
            errors.push('Existen llaves de cierre "}" sin una llave de apertura correspondiente.');
            break;
        }
    }
    
    if (balance > 0) {
        errors.push('Existen llaves de apertura "{" sin cerrar.');
    }
    
    return errors.length > 0 ? errors[0] : null;
  };

  const handleSaveTemplate = () => {
    const error = validateTemplateSyntax(templateContent);
    if (error) {
      setTemplateSyntaxError(error);
      toast.error('Error de sintaxis en la plantilla');
      return;
    }
    
    setTemplateSyntaxError(null);
    toast.success(`Plantilla "${templateName}" guardada correctamente`);
    setIsTemplateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-bg-surface p-2 rounded-lg border border-border-base max-w-fit">
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'pricing' ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Tarifas y Horas Extra
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'services' ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Servicios Adicionales
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'templates' ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Plantillas de Contratos
        </button>
      </div>

      <PermissionGuard permissions="settings.view">
        {activeTab === 'pricing' && (currentTenant === 'admin' || currentTenant === 'casa_de_piedra') && (
          <BaseCard title="Configuración de Tarifas Base" className="max-w-3xl">
            <div className="space-y-6">
              <div className="bg-bg-surface-hover p-4 rounded-lg border border-border-base space-y-4">
                <h3 className="font-medium text-text-primary">Hora Extra / Montaje</h3>
                <div className="grid grid-cols-2 gap-4">
                  <BaseSelect 
                    label="Modo de Cobro (Hora Extra)" 
                    options={[
                      { value: 'fixed', label: 'Cantidad Fija ($)' },
                      { value: 'percentage', label: 'Porcentaje por Día (%)' }
                    ]} 
                    value={config.extraHourMode} 
                    onChange={(e) => handleConfigChange('extraHourMode', e.target.value)}
                  />
                  <BaseInput label="Valor (M.N. o %)" type="number" value={config.extraHourValue} onChange={(e) => handleConfigChange('extraHourValue', e.target.value)} />
                  
                  <BaseSelect 
                    label="Modo de Cobro (Montaje/Desmontaje)" 
                    options={[
                      { value: 'fixed', label: 'Cantidad Fija ($)' },
                      { value: 'percentage', label: 'Porcentaje por Día (%)' }
                    ]} 
                    value={config.setupMode} 
                    onChange={(e) => handleConfigChange('setupMode', e.target.value)}
                  />
                  <BaseInput label="Valor (M.N. o %)" type="number" value={config.setupValue} onChange={(e) => handleConfigChange('setupValue', e.target.value)} />
                </div>
              </div>

              <div className="bg-bg-surface-hover p-4 rounded-lg border border-border-base space-y-4 mt-6">
                <h3 className="font-medium text-text-primary">Impuestos</h3>
                {isLoading ? (
                  <div className="text-sm text-text-tertiary">Cargando configuración...</div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <BaseSelect 
                        label="Modo de Cobro (IVA)" 
                        options={[
                          { value: 'fixed', label: 'Cantidad Fija ($)' },
                          { value: 'percentage', label: 'Porcentaje (%)' }
                        ]} 
                        value={config.taxMode} 
                        onChange={(e) => handleConfigChange('taxMode', e.target.value)}
                      />
                      <BaseInput label="Valor IVA" type="number" value={config.taxValue} onChange={(e) => handleConfigChange('taxValue', e.target.value)} />
                    </div>
                    
                    <div className="space-y-4">
                      <BaseSelect 
                        label="Modo de Cobro (Retención)" 
                        options={[
                          { value: 'fixed', label: 'Cantidad Fija ($)' },
                          { value: 'percentage', label: 'Porcentaje (%)' }
                        ]} 
                        value={config.retentionMode} 
                        onChange={(e) => handleConfigChange('retentionMode', e.target.value)}
                      />
                      <BaseInput label="Valor Retención" type="number" value={config.retentionValue} onChange={(e) => handleConfigChange('retentionValue', e.target.value)} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <BaseButton variant="primary" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Tarifas
                </BaseButton>
              </div>
            </div>
          </BaseCard>
        )}
        
        {activeTab === 'pricing' && currentTenant !== 'admin' && currentTenant !== 'casa_de_piedra' && (
          <BaseCard className="max-w-3xl p-8 text-center text-text-tertiary">
            <p>La configuración de tarifas base no está disponible para este recinto.</p>
          </BaseCard>
        )}

        {activeTab === 'services' && (
          <BaseCard title="Catálogo de Servicios Adicionales" className="max-w-3xl">
            <div className="flex justify-end mb-4">
              <BaseButton size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Servicio
              </BaseButton>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-bg-surface-hover p-4 rounded-lg border border-border-base">
                <div className="flex-1">
                  <p className="font-medium text-text-primary">Limpieza Post-Evento</p>
                  <p className="text-sm text-text-secondary">Servicio de limpieza general después de la entrega del espacio.</p>
                </div>
                <div className="font-semibold text-text-primary w-24">$2,500.00</div>
                <BaseSelect options={[{ value: 'active', label: 'Activo' }, { value: 'inactive', label: 'Inactivo' }]} defaultValue="active" />
              </div>
              <div className="flex items-center gap-4 bg-bg-surface-hover p-4 rounded-lg border border-border-base">
                <div className="flex-1">
                  <p className="font-medium text-text-primary">Seguridad Privada</p>
                  <p className="text-sm text-text-secondary">Guardia de seguridad 12 horas.</p>
                </div>
                <div className="font-semibold text-text-primary w-24">$1,800.00</div>
                <BaseSelect options={[{ value: 'active', label: 'Activo' }, { value: 'inactive', label: 'Inactivo' }]} defaultValue="active" />
              </div>
            </div>
          </BaseCard>
        )}

        {activeTab === 'templates' && (
          <BaseCard title="Gestión de Plantillas" className="max-w-3xl">
            <div className="flex justify-end mb-4">
              <BaseButton size="sm" onClick={() => { setTemplateName(''); setTemplateContent(''); setTemplateSyntaxError(null); setIsTemplateModalOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Plantilla
              </BaseButton>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-bg-surface-hover p-4 rounded-lg border border-border-base">
                <div className="flex-1">
                  <p className="font-medium text-text-primary">Contrato de Arrendamiento - Plaza Mayor</p>
                  <p className="text-sm text-text-secondary">Última actualización: 10 May 2026</p>
                </div>
                <BaseBadge variant="success">Activo</BaseBadge>
                <BaseButton variant="outline" size="sm" onClick={() => { setTemplateName('Contrato de Arrendamiento - Plaza Mayor'); setTemplateContent('Este es un contrato para {{CLIENT_NAME}}...'); setTemplateSyntaxError(null); setIsTemplateModalOpen(true); }}>Actualizar</BaseButton>
              </div>
              <div className="flex items-center gap-4 bg-bg-surface-hover p-4 rounded-lg border border-border-base">
                <div className="flex-1">
                  <p className="font-medium text-text-primary">Contrato Publicidad Fija</p>
                  <p className="text-sm text-text-secondary">Última actualización: 15 Ene 2026</p>
                </div>
                <BaseBadge variant="success">Activo</BaseBadge>
                <BaseButton variant="outline" size="sm" onClick={() => { setTemplateName('Contrato Publicidad Fija'); setTemplateContent('Por medio de la presente {{CORPORATION}} y {{CLIENT_NAME...'); setTemplateSyntaxError(null); setIsTemplateModalOpen(true); }}>Actualizar</BaseButton>
              </div>
            </div>
          </BaseCard>
        )}
      </PermissionGuard>

      <BaseModal
        title="Editor de Plantilla de Contrato"
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      >
        <div className="space-y-4">
          <BaseInput 
            label="Nombre de la Plantilla" 
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Ej. Contrato Standard..."
          />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Contenido (Usar múltiples llaves para variables: {'{{NOMBRE_CLIENTE}}'})
            </label>
            <textarea
              className={`w-full h-64 p-3 bg-bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-text-tertiary transition-colors resize-none ${templateSyntaxError ? 'border-red-500' : 'border-border-base'}`}
              value={templateContent}
              onChange={(e) => {
                setTemplateContent(e.target.value);
                if (templateSyntaxError) {
                  setTemplateSyntaxError(validateTemplateSyntax(e.target.value));
                }
              }}
              placeholder="Ingresa el contenido del contrato..."
            />
            {templateSyntaxError && (
              <p className="text-red-500 text-sm mt-1">{templateSyntaxError}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <BaseButton variant="ghost" onClick={() => setIsTemplateModalOpen(false)}>Cancelar</BaseButton>
            <BaseButton variant="primary" onClick={handleSaveTemplate}>Guardar Cambios</BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
