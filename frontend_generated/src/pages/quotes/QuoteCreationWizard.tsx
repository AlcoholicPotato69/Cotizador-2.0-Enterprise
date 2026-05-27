import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseWizard } from '../../components/base/BaseWizard';
import { BaseSelect } from '../../components/base/BaseSelect';
import { useQuoteStore } from '../../core/QuoteStore';
import { useCatalogStore } from '../../core/CatalogStore';
import { useTenantStore } from '../../core/tenant';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import { api } from '../../core/api';

export function QuoteCreationWizard() {
  const navigate = useNavigate();
  const { currentTenant } = useTenantStore();
  const { spaces } = useCatalogStore();
  const { clientId, spaceId, services, totalCalculation, setClient, setSpace, toggleService, calculateTotal, reset } = useQuoteStore();
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    reset();
    let mounted = true;
    const fetchClients = async () => {
      try {
        const res = await api.get('/clients');
        if (mounted) setClients(res.data || []);
      } catch (error) {
        if (mounted) toast.error('Error al cargar clientes');
      }
    };
    fetchClients();
    return () => { mounted = false; };
  }, [reset]);

  const filteredSpaces = spaces.filter(space => space.tenantId === currentTenant || space.tenantId === 'all');

  const steps = [
    {
      id: 'step1',
      label: 'Cliente',
      description: 'Selecciona el cliente',
      content: (
        <div className="space-y-6 max-w-md">
          <h2 className="text-xl font-semibold mb-4">Información del Cliente</h2>
          <BaseSelect 
            label="Cliente Existente"
            value={clientId || ''}
            onChange={(e) => setClient(e.target.value)}
            options={[
              { value: '', label: 'Seleccionar...' },
              ...clients.map(c => ({ value: c.id, label: c.name }))
            ]}
          />
        </div>
      )
    },
    {
      id: 'step2',
      label: 'Espacios',
      description: 'Catálogo de espacios',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Seleccionar Espacio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpaces.map(space => (
              <div 
                key={space.id} 
                onClick={() => setSpace(space.id)}
                className={`p-4 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all ${spaceId === space.id ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary' : 'border-border-base hover:border-border-strong'}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-text-primary">{space.name}</h3>
                  {spaceId === space.id && <Check className="w-5 h-5 text-brand-primary" />}
                </div>
                <p className="text-sm text-text-secondary">{space.category} • {space.capacity === '-' ? 'N/A' : space.capacity + ' pax'}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'step3',
      label: 'Servicios',
      description: 'Catering, AV, etc.',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Servicios Adicionales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {['Catering Premium', 'Limpieza Post-Evento', 'Seguridad Privada 12h', 'Equipo AV y Pantallas'].map((srv) => (
               <div 
                  key={srv}
                  onClick={() => toggleService(srv)}
                  className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${services.includes(srv) ? 'border-brand-primary bg-brand-primary/5' : 'border-border-base'}`}
               >
                 <div className={`w-5 h-5 rounded flex items-center justify-center border ${services.includes(srv) ? 'bg-brand-primary border-brand-primary' : 'border-border-strong'}`}>
                    {services.includes(srv) && <Check className="w-3.5 h-3.5 text-white" />}
                 </div>
                 <span className="font-medium text-text-primary">{srv}</span>
               </div>
             ))}
          </div>
        </div>
      )
    },
    {
      id: 'step4',
      label: 'Agenda',
      description: 'Fechas de evento',
      content: (
        <div className="space-y-6 max-w-xl">
          <h2 className="text-xl font-semibold mb-4">Mapeo de Fechas del Evento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
               <label className="block text-sm font-medium text-text-secondary mb-1">Inicio Premontaje</label>
               <input type="date" className="w-full p-2 rounded-lg border border-border-base bg-bg-surface focus:ring-2 focus:ring-brand-primary" />
             </div>
             <div>
               <label className="block text-sm font-medium text-text-secondary mb-1">Inicio Evento</label>
               <input type="date" className="w-full p-2 rounded-lg border border-border-base bg-bg-surface focus:ring-2 focus:ring-brand-primary" />
             </div>
             <div>
               <label className="block text-sm font-medium text-text-secondary mb-1">Fin Desmontaje</label>
               <input type="date" className="w-full p-2 rounded-lg border border-border-base bg-bg-surface focus:ring-2 focus:ring-brand-primary" />
             </div>
          </div>
          <p className="text-xs text-text-tertiary mt-2">
            El sistema calculará las penalizaciones y costos operativos base conforme a las fechas especificadas vs reglamento vigente.
          </p>
        </div>
      )
    },
    {
      id: 'step5',
      label: 'Cotización',
      description: 'Revisión y Totales',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Resumen y Cálculo</h2>
          
          <div className="bg-bg-surface-hover p-4 rounded-lg border border-border-base space-y-4">
             <div className="flex justify-between border-b border-border-base pb-2">
                <span className="text-text-secondary">Cliente ID</span>
                <span className="font-medium">{clientId || 'No seleccionado'}</span>
             </div>
             <div className="flex justify-between border-b border-border-base pb-2">
                <span className="text-text-secondary">Espacio</span>
                <span className="font-medium">{filteredSpaces.find(s => s.id === spaceId)?.name || 'No seleccionado'}</span>
             </div>
             <div className="flex justify-between border-b border-border-base pb-2">
                <span className="text-text-secondary">Servicios Adicionales</span>
                <span className="font-medium whitespace-pre-wrap text-right">{services.length > 0 ? services.join('\n') : 'Ninguno'}</span>
             </div>
             
             <div className="pt-4 text-center">
                <button 
                  onClick={async () => {
                    setIsCalculating(true);
                    await calculateTotal();
                    setIsCalculating(false);
                    toast.success('Cálculos completados por el backend.');
                  }}
                  className="px-4 py-2 bg-text-primary text-bg-surface rounded-lg font-medium hover:bg-text-secondary transition-colors"
                >
                  {isCalculating ? 'Calculando...' : 'Calcular Totales (Backend)'}
                </button>
             </div>

             {totalCalculation && (
               <div className="pt-4 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="text-text-primary font-medium">${totalCalculation.subtotal.toLocaleString()} MXN</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">IVA (16%)</span>
                    <span className="text-text-primary font-medium">${totalCalculation.tax.toLocaleString()} MXN</span>
                  </div>
                  <div className="pt-2 border-t border-border-base flex justify-between text-lg font-bold">
                    <span className="text-text-primary">TOTAL</span>
                    <span className="text-brand-primary">${totalCalculation.total.toLocaleString()} MXN</span>
                  </div>
                </div>
              </div>
             )}
          </div>
        </div>
      )
    }
  ];

  const handleComplete = async () => {
    if (!totalCalculation) {
      toast.error('Debes calcular los totales primero');
      return;
    }
    setIsCreating(true);
    try {
      const res = await api.post('/quotes', {
        clientId,
        spaceId,
        services,
        totalAmount: totalCalculation.total
      });
      toast.success('Cotización generada correctamente');
      navigate(`/app/quotes/${res.data.id}`);
    } catch (error) {
      toast.error('Error al generar la cotización');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold mb-6">Crear Nueva Cotización</h1>
      <BaseWizard 
        steps={steps} 
        onComplete={handleComplete} 
        onCancel={() => navigate('/app/quotes')} 
      />
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg-surface p-6 rounded-xl shadow-lg">
             <p className="text-text-primary font-medium">Creando cotización...</p>
          </div>
        </div>
      )}
    </div>
  );
}
