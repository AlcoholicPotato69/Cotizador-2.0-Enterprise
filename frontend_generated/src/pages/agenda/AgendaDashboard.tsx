import React, { useState } from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseBreadcrumb } from '../../components/base/BaseBreadcrumb';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseModal } from '../../components/base/BaseModal';
import { BaseInput } from '../../components/base/BaseInput';
import { BaseSelect } from '../../components/base/BaseSelect';
import { format, addMonths, subMonths, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, isSameMonth, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, AlertCircle, Calendar as CalendarIcon, Clock, FileText } from 'lucide-react';
import { useTenantStore } from '../../core/tenant';
import { generatePDF } from '../../utils/pdfGenerator';
import { toast } from 'sonner';
import { api } from '../../core/api';

export function AgendaDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { currentTenant } = useTenantStore();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [spaces, setSpaces] = useState<{value: string, label: string}[]>([]);

  // Quote Form State
  const [quoteData, setQuoteData] = useState({
    client: '',
    space: '',
    date: '',
    guests: '',
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleGenerateQuote = async () => {
    if (!quoteData.client || !quoteData.space || !quoteData.date || !quoteData.guests) {
      toast.error('Complete todos los campos requeridos');
      return;
    }

    setIsGeneratingQuote(true);
    
    try {
      await api.post('/quotes', {
        clientId: quoteData.client,
        spaceId: quoteData.space,
        date: quoteData.date,
        guests: Number(quoteData.guests)
      });

      const selectedSpaceLabel = spaces.find(s => s.value === quoteData.space)?.label || quoteData.space;

      generatePDF({
        title: 'Cotización de Evento',
        subtitle: `Cliente: ${quoteData.client} | Fecha: ${quoteData.date}`,
        content: [
          'Por medio de la presente, presentamos la cotización correspondiente al arrendamiento de espacio y servicios descritos.',
          `Espacio Solicitado: ${selectedSpaceLabel}`,
          `Aforo Estimado: ${quoteData.guests} personas`,
          '',
          'Términos y Condiciones:',
          '- Esta cotización tiene una vigencia de 15 días naturales.',
          '- El apartado de fecha requiere un anticipo del 30% no reembolsable.',
          '- Precios expresados en moneda nacional (MXN) antes de IVA.'
        ],
        tableHeaders: ['Concepto', 'Cantidad', 'Precio Unitario', 'Subtotal'],
        tableData: [
          ['Arrendamiento de Espacio Base', '1', '$15,000.00', '$15,000.00'],
          ['Servicio de Limpieza Pre y Post', '1', '$2,500.00', '$2,500.00'],
          ['Horas Extras Estimadas', '2', '$1,000.00', '$2,000.00']
        ],
        filename: `Cotizacion_${quoteData.client.replace(/\s+/g, '_')}`
      });

      setIsQuoteModalOpen(false);
      toast.success('Cotización generada y descargada (PDF)');
    } catch (error) {
      toast.error('Error al generar la cotización');
      console.error(error);
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  const [events, setEvents] = useState<any[]>([]);

  React.useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      try {
        const [eventsRes, spacesRes] = await Promise.all([
          api.get('/events').catch(() => ({ data: [] })),
          api.get('/spaces').catch(() => ({ data: [] }))
        ]);
        
        if (mounted) {
          const eventsData = eventsRes.data.map((e: any) => ({
            ...e,
            date: new Date(e.startTime || e.date),
            startTime: e.startTime ? new Date(e.startTime) : undefined,
            endTime: e.endTime ? new Date(e.endTime) : undefined
          }));
          setEvents(eventsData);

          const spacesData = spacesRes.data.map((space: any) => ({
            value: space.id,
            label: space.name
          }));
          setSpaces(spacesData);
        }
      } catch (error) {
        if (mounted) console.error('Failed to fetch data', error);
      }
    };
    
    fetchData();
    return () => { mounted = false; };
  }, []);

  // Vencimientos y Próximos Eventos
  const upcomingEvents = events.filter(e => e.date >= new Date()).slice(0, 5);

  const renderCells = () => {
    return days.map(day => {
      const dayEvents = events.filter(e => isSameDay(day, e.date));
      const isCurrentMonth = isSameMonth(day, monthStart);
      
      return (
        <div 
          key={day.toString()} 
          className={`min-h-[100px] p-2 border-r border-b border-border-base relative ${!isCurrentMonth ? 'bg-bg-surface-hover/50 text-text-tertiary' : 'bg-bg-surface'} hover:bg-bg-surface-hover transition-colors`}
        >
          <div className="flex justify-between items-center mb-1">
             <span className={`text-sm font-semibold ${isToday(day) ? 'flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white' : ''}`}>
               {format(day, 'd')}
             </span>
          </div>
          <div className="space-y-1">
            {dayEvents.map(event => (
              <div 
                key={event.id}
                className={`text-xs px-1.5 py-0.5 rounded truncate font-medium
                  ${event.type === 'EVENTO' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 
                   'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300'}
                `}
                title={event.title}
              >
                {event.type === 'PREMONTAJE' ? '⚙️' : '🎉'} {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in zoom-in-95 duration-200">
      <BaseBreadcrumb items={[{ label: 'Agenda y Reservas' }]} className="mb-6" />
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Agenda Operativa</h1>
          <p className="text-sm text-text-secondary mt-1">Gestión de eventos, premontajes y alertas de vencimientos.</p>
        </div>
        <BaseButton onClick={() => setIsQuoteModalOpen(true)}>
          <FileText className="w-4 h-4 mr-2" />
          Nueva Cotización
        </BaseButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel lateral: Alertas y Próximos */}
        <div className="lg:col-span-1 space-y-6">
          <BaseCard title="Próximos Eventos">
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex gap-3 items-start border-b border-border-base pb-3 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded bg-brand-primary/10 flex items-center justify-center shrink-0">
                    {event.type === 'PREMONTAJE' ? <Clock className="w-4 h-4 text-brand-primary" /> : <CalendarIcon className="w-4 h-4 text-brand-primary" /> }
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">{event.title}</h4>
                    <p className="text-xs text-text-secondary">{format(event.date, 'dd MMM yyyy', { locale: es })} • {event.space}</p>
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>
        </div>

        {/* Calendario FSM */}
        <div className="lg:col-span-3">
          <BaseCard noPadding className="overflow-hidden">
            <div className="p-4 border-b border-border-base flex items-center justify-between bg-bg-surface-hover">
              <div className="flex items-center gap-4">
                 <button onClick={prevMonth} className="p-1 hover:bg-bg-surface rounded-md transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                 <h2 className="text-lg font-bold text-text-primary uppercase tracking-wide w-48 text-center">
                   {format(currentDate, dateFormat, { locale: es })}
                 </h2>
                 <button onClick={nextMonth} className="p-1 hover:bg-bg-surface rounded-md transition-colors"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <BaseButton variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Hoy</BaseButton>
            </div>
            
            <div className="grid grid-cols-7 border-b border-border-base">
              {weekDays.map(dayText => (
                <div key={dayText} className="text-center py-2 text-xs font-bold text-text-tertiary uppercase tracking-wider border-r border-border-base last:border-r-0 bg-bg-surface-hover/50">
                  {dayText}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 border-l border-t border-border-base">
              {renderCells()}
            </div>
          </BaseCard>
        </div>
      </div>

      <BaseModal
        title="Crear Nueva Cotización B2B"
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      >
        <div className="space-y-5">
          <p className="text-sm text-text-secondary">Explore disponibilidad e ingrese los datos preliminares del prospecto para generar la cotización formal.</p>
          
          <div className="space-y-4">
            <BaseInput 
              label="Cliente / Razón Social" 
              placeholder="Ej. Acme Corp" 
              value={quoteData.client} 
              onChange={e => setQuoteData({...quoteData, client: e.target.value})} 
            />
            
            <BaseSelect 
              label="Espacio de Interés" 
              value={quoteData.space}
              onChange={e => setQuoteData({...quoteData, space: e.target.value})}
              options={spaces.length > 0 ? spaces : [{ value: '', label: 'Cargando espacios...' }]}
            />

            <div className="grid grid-cols-2 gap-4">
              <BaseInput 
                label="Fecha Probable" 
                type="date"
                value={quoteData.date}
                onChange={e => setQuoteData({...quoteData, date: e.target.value})}
              />
              <BaseInput 
                label="Aforo (Personas)" 
                type="number" 
                placeholder="Ej. 150"
                value={quoteData.guests}
                onChange={e => setQuoteData({...quoteData, guests: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <BaseButton variant="ghost" onClick={() => setIsQuoteModalOpen(false)}>Cancelar</BaseButton>
            <BaseButton variant="primary" onClick={handleGenerateQuote} isLoading={isGeneratingQuote}>
              Generar y Descargar PDF
            </BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
