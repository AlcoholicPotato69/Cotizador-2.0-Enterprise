import { BaseBadge } from '../../components/base/BaseBadge';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseModal } from '../../components/base/BaseModal';
import { BaseInput } from '../../components/base/BaseInput';
import { BaseCalendar } from '../../components/base/BaseCalendar';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, Settings, Users, Ruler, Activity, Calendar } from 'lucide-react';
import { PermissionGuard } from '../../core/PermissionGuard';
import { toast } from 'sonner';
import { generatePDF } from '../../utils/pdfGenerator';
import { api } from '../../core/api';

export function CatalogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dynamic State for backend simulation
  const [spaceData, setSpaceData] = useState<any>(null);
  const [eventsData, setEventsData] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchSpaceDetailsAndAgenda = async () => {
      try {
        const [spaceRes, agendaRes] = await Promise.all([
          api.get(`/spaces/${id}`),
          api.get(`/agenda`, { params: { space_id: id } })
        ]);
        
        if (isMounted) {
          setSpaceData(spaceRes.data);
          // Assuming agenda returns array of events with dates as string
          const events = agendaRes.data.map((e: any) => ({
            ...e,
            date: new Date(e.date)
          }));
          setEventsData(events);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          toast.error('Error al cargar los detalles del espacio');
          setSpaceData(null);
          setEventsData([]);
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    fetchSpaceDetailsAndAgenda();

    return () => { isMounted = false; };
  }, [id]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generatePDF({
        title: `Plano - ${spaceData?.name}`,
        subtitle: `ID Espacio: ${spaceData?.id} | Área: ${spaceData?.area || 'N/A'}`,
        content: [
          'El presente documento certifica los linderos, capacidades y distribuciones del espacio solicitado.',
          `Capacidad máxima permitida (Aforo): ${spaceData?.capacity}`,
          `Ubicación: ${spaceData?.location || 'No especificada'}`
        ],
        filename: `Plano_${spaceData?.id}`
      });
      toast.success('Plano PDF descargado con éxito.');
    } catch (error) {
      toast.error('Error al generar el PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewAvailability = () => {
    document.getElementById('availability-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [isSavingRules, setIsSavingRules] = useState(false);

  const handleSaveRules = async () => {
    setIsSavingRules(true);
    try {
      await api.post(`/spaces/${id}/rules`, {
        minHours: 4,
        maxCapacity: spaceData?.capacity
      });
      toast.success('Reglas sincronizadas al servidor correctamente');
      setIsRulesModalOpen(false);
    } catch (error) {
      toast.error('Error al sincronizar reglas con el servidor');
    } finally {
      setIsSavingRules(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!spaceData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Map className="w-12 h-12 text-text-tertiary" />
        <h2 className="text-xl font-bold text-text-primary">Espacio no encontrado</h2>
        <p className="text-text-secondary">No se pudo cargar la información del espacio desde el servidor.</p>
        <BaseButton onClick={() => navigate('/app/catalog')}>Volver al catálogo</BaseButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/app/catalog')}
            className="p-2 hover:bg-bg-surface-hover rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">{spaceData.name}</h1>
              <BaseBadge variant={spaceData.status === 'AVAILABLE' ? 'success' : 'warning'}>{spaceData.status}</BaseBadge>
            </div>
            <p className="text-text-secondary mt-1">ID: {spaceData.id} • Categoría: {spaceData.category}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <PermissionGuard permissions="admin.access">
            <BaseButton variant="outline" onClick={() => setIsRulesModalOpen(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Configurar Reglas
            </BaseButton>
          </PermissionGuard>
          <PermissionGuard permissions="schedule.view">
            <BaseButton onClick={handleViewAvailability}>
              <Activity className="w-4 h-4 mr-2" />
              Ver Disponibilidad
            </BaseButton>
          </PermissionGuard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-surface border border-border-base rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Información del Espacio</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <Users className="w-4 h-4 text-text-tertiary" />
                     <p className="text-sm font-medium text-text-secondary">Capacidad</p>
                  </div>
                  <p className="text-xl font-bold text-text-primary">{spaceData.capacity}</p>
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <Ruler className="w-4 h-4 text-text-tertiary" />
                     <p className="text-sm font-medium text-text-secondary">Área</p>
                  </div>
                  <p className="text-xl font-bold text-text-primary">{spaceData.area}</p>
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-lg font-bold text-text-tertiary">$</span>
                     <p className="text-sm font-medium text-text-secondary">Precio Base / h</p>
                  </div>
                  <p className="text-xl font-bold text-text-primary">${spaceData.basePricePerHour ? spaceData.basePricePerHour.toLocaleString('es-MX') : '0'}</p>
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <Map className="w-4 h-4 text-text-tertiary" />
                     <p className="text-sm font-medium text-text-secondary">Ubicación</p>
                  </div>
                  <p className="text-xl font-bold text-text-primary">{spaceData.location}</p>
               </div>
            </div>
            
            <div className="mt-8">
               <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-2">Descripción (Metadata)</h3>
               <p className="text-text-secondary leading-relaxed">
                 Espacio versátil obtenido desde el backend. Todos los parámetros y restricciones listados en esta vista son cargados dinámicamente y validados mediante los endpoints operativos del sistema.
               </p>
            </div>
          </div>
          
          <div className="bg-bg-surface border border-border-base rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Configuración B2B Opciones</h2>
            <div className="space-y-3">
               <div className="flex justify-between items-center py-2 border-b border-border-base">
                 <span className="text-text-secondary text-sm">Permite Contrato Exclusivo</span>
                 <BaseBadge variant="success">{spaceData.exclusive ? 'Sí' : 'No'}</BaseBadge>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-border-base">
                 <span className="text-text-secondary text-sm">Reglamento Activo</span>
                 <span className="text-text-primary font-medium text-sm">Por defecto</span>
               </div>
            </div>
          </div>

          <div id="availability-section" className="bg-bg-surface border border-border-base rounded-xl p-6 shadow-sm">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                 <Calendar className="w-5 h-5 text-text-secondary" />
                 Disponibilidad Verificada
               </h2>
               <BaseBadge variant="info">Datos en Tiempo Real</BaseBadge>
             </div>
             <p className="text-sm text-text-secondary mb-4">Esta vista está sincronizada directamente con la agenda central para este espacio (ID: {spaceData.id}).</p>
             <div className="h-[400px]">
               <BaseCalendar events={eventsData} />
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-surface border border-border-base rounded-xl p-6 shadow-sm top-6 sticky">
             <div className="flex items-center gap-2 mb-4">
                 <Map className="w-5 h-5" />
                 <h2 className="text-lg font-semibold text-text-primary">Plano y Mapa Oficial</h2>
             </div>
             <div className="mt-4 border border-border-base rounded-lg bg-bg-base aspect-[4/3] flex items-center justify-center overflow-hidden">
                {spaceData.images && spaceData.images.length > 0 ? (
                  <img src={spaceData.images[0]} alt="Plano" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Map className="w-8 h-8 text-text-tertiary mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-text-secondary">Cargando visuales remotos...</p>
                  </div>
                )}
             </div>
             <div className="mt-4 text-right">
                <PermissionGuard permissions="admin.access">
                  <BaseButton variant="outline" className="w-full" onClick={handleDownload} isLoading={isDownloading}>
                    Generar PDF Oficial
                  </BaseButton>
                </PermissionGuard>
             </div>
          </div>
        </div>
      </div>

      <BaseModal
        title="Configurar Reglas del Servidor"
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Los parámetros ingresados se enviarán directamente al microservicio de reglas operativas para afectar contratos futuros.
          </p>
          <div className="space-y-4">
            <BaseInput label="Horas mínimas de reserva" type="number" defaultValue="4" />
            <BaseInput label="Aforo máximo dinámico" type="number" defaultValue={spaceData.capacity === 'Variable' ? '100' : spaceData.capacity.replace(/\D/g, '')} />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <BaseButton variant="ghost" onClick={() => setIsRulesModalOpen(false)}>Cancelar</BaseButton>
            <BaseButton variant="primary" onClick={handleSaveRules} isLoading={isSavingRules}>Aplicar a Backend</BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
