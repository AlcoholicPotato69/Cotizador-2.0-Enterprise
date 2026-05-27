import React, { useState } from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseBreadcrumb } from '../../components/base/BaseBreadcrumb';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseInput } from '../../components/base/BaseInput';
import { BaseSelect } from '../../components/base/BaseSelect';
import { FileBarChart, PieChart, TrendingUp, Download, Calendar, Filter } from 'lucide-react';
import { generatePDF } from '../../utils/pdfGenerator';
import { toast } from 'sonner';
import { useTenantStore } from '../../core/tenant';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

export function ReportsDashboard() {
  const { currentTenant } = useTenantStore();
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  
  // Filtering state
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [contractType, setContractType] = useState('ALL');

  const reportTypes = [
    {
      id: 'occupancy',
      title: 'Reporte de Ocupación de Espacios',
      description: 'Métricas detalladas sobre la utilización de salones y jardines, promedios de aforo y días pico de operación.',
      icon: <PieChart className="w-8 h-8 text-brand-primary" />,
      generateData: () => ({
        title: 'Reporte de Ocupación',
        subtitle: `Centro de Análisis - ${currentTenant.toUpperCase()}`,
        content: [
          `Periodo de Análisis: ${format(new Date(startDate), 'dd MMMM yyyy', {locale: es})} al ${format(new Date(endDate), 'dd MMMM yyyy', {locale: es})}`,
          'Este reporte detalla los indicadores de uso y optimización de espacios en el periodo seleccionado.',
          'Resumen Ejecutivo:',
          '- Ocupación global del periodo: 78%',
          '- Espacio más utilizado: Salón Principal (85% ocupación)',
          '- Día de mayor demanda: Viernes y Sábados',
        ],
        tableHeaders: ['Escenario', 'Ocupación (%)', 'Eventos Realizados', 'Ingresos Estimados'],
        tableData: [
          ['Salón Principal', '85%', '42', '$1,050,000 MXN'],
          ['Jardín Norte', '60%', '15', '$270,000 MXN'],
          ['Salas VIP', '90%', '60', '$300,000 MXN'],
          ['Explanada', '45%', '8', '$900,000 MXN']
        ],
        filename: 'Reporte_Ocupacion'
      })
    },
    {
      id: 'finance',
      title: 'Reporte de Ingresos y Facturación',
      description: 'Análisis financiero con desglose por tipo de evento, servicios adicionales, penalizaciones e impuestos.',
      icon: <TrendingUp className="w-8 h-8 text-success" />,
      generateData: () => ({
        title: 'Reporte Financiero',
        subtitle: `Corte Periódico - ${currentTenant.toUpperCase()}`,
        content: [
          `Periodo de Análisis: ${format(new Date(startDate), 'dd MMMM yyyy', {locale: es})} al ${format(new Date(endDate), 'dd MMMM yyyy', {locale: es})}`,
          'Métricas financieras correspondientes al operativo en fechas. Los montos expresados son antes de impuestos.',
          'Crecimiento mes a mes (MoM) de 12.4% derivado de la suma de más eventos B2B.'
        ],
        tableHeaders: ['Concepto', 'Total (MXN)', 'Crecimiento %', 'Status'],
        tableData: [
          ['Arrendamiento Base', '$2,500,000', '+5%', 'Estable'],
          ['Horas Extra', '$350,000', '+15%', 'Alza'],
          ['Penalizaciones', '$45,000', '-2%', 'Baja'],
          ['Servicios Adicionales', '$820,000', '+22%', 'Alza']
        ],
        filename: 'Reporte_Financiero'
      })
    },
    {
      id: 'calendar',
      title: 'Reporte de Agenda B2B',
      description: 'Listado completo de premontajes, montajes, eventos activos y proyecciones para los siguientes 90 días.',
      icon: <Calendar className="w-8 h-8 text-warning" />,
      generateData: () => ({
        title: 'Reporte de Agenda de Eventos',
        subtitle: `Proyección y Activos - ${currentTenant.toUpperCase()}`,
        content: [
          `Filtro de Fechas Aplicado: ${format(new Date(startDate), 'dd MMMM yyyy', {locale: es})} al ${format(new Date(endDate), 'dd MMMM yyyy', {locale: es})}`,
          'La siguiente matriz muestra el consolidado de eventos agendados y aprobados, listos para ejecución operativa.'
        ],
        tableHeaders: ['Fecha', 'Evento', 'Cliente', 'Espacio asignado'],
        tableData: [
          ['12 Oct 2026', 'Congreso LATAM', 'TechCorp Inc.', 'Pabellón Central'],
          ['15 Oct 2026', 'Boda Martínez', 'Privado', 'Jardín Sur'],
          ['22 Oct 2026', 'Expo Medical', 'Health S.A.', 'Salones A, B, C'],
          ['02 Nov 2026', 'Feria Automotriz', 'AutoGroup', 'Explanada Principal']
        ],
        filename: 'Reporte_Agenda'
      })
    },
    {
      id: 'contracts',
      title: 'Reporte Contractual y Firmas',
      description: 'Métricas detalladas de contratos firmados digitalmente, convenios activos y tasas de conversión comercial.',
      icon: <FileBarChart className="w-8 h-8 text-brand-primary" />,
      generateData: () => ({
        title: 'Reporte de Gestión Comercial B2B',
        subtitle: `Corte de Firmas y Acuerdos - ${currentTenant.toUpperCase()}`,
        content: [
          `Fechas: ${format(new Date(startDate), 'dd MMMM yyyy', {locale: es})} al ${format(new Date(endDate), 'dd MMMM yyyy', {locale: es})}`,
          `Tipo de Contrato / Convenio filtrado: ${contractType === 'ALL' ? 'Todos los tipos' : contractType}`,
          'Este documento consolida la actividad contractual y el desempeño de cierre de firmas.',
          'Tasas de conversión generales de Cotización a Contrato Firmado: 64%',
          'Tiempo promedio de firma: 12.5 hrs.'
        ],
        tableHeaders: ['Responsable', 'Cotizaciones', 'Firmas Logradas', 'Tasa (%)'],
        tableData: [
          ['John Doe', '45', '30', '66%'],
          ['Ana Martínez', '34', '20', '58%'],
          ['Carlos Vega', '60', '42', '70%'],
          ['Luisa Peña', '25', '21', '84%']
        ],
        filename: 'Reporte_Contractual'
      })
    }
  ];

  const handleGenerate = async (reportId: string, genFn: any) => {
    setIsGenerating(reportId);
    
    // Simulate network/generation wait for UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const data = genFn();
      generatePDF(data);
      toast.success('Reporte generado y descargado correctamente con los filtros aplicados');
    } catch (err) {
      toast.error('Ocurrió un error al generar el reporte');
      console.error(err);
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in zoom-in-95 duration-200">
      <BaseBreadcrumb items={[{ label: 'Reportes y Analítica' }]} className="mb-6" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Centro de Reportes</h1>
          <p className="text-sm text-text-secondary mt-1">Exploración de datos y exportación de métricas comerciales.</p>
        </div>
      </div>

      <div className="mb-8 p-5 bg-bg-surface border border-border-base rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-text-primary font-semibold">
           <Filter className="w-5 h-5 text-brand-primary" />
           Filtros Globales de Generación (PDFs)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BaseInput 
            type="date"
            label="Fecha de Inicio"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <BaseInput 
            type="date"
            label="Fecha de Fin"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <BaseSelect 
            label="Tipo de Contrato"
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
            options={[
              { value: 'ALL', label: 'Todos los tipos' },
              { value: 'COMERCIAL', label: 'Comercial B2B' },
              { value: 'ARRENDAMIENTO', label: 'Arrendamiento' },
              { value: 'PROVEEDORES', label: 'Proveedores' }
            ]}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <BaseCard key={report.id} className="flex flex-col h-full group hover:border-brand-primary/50 transition-colors">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-bg-surface-hover rounded-xl group-hover:scale-110 transition-transform">
                {report.icon}
              </div>
              <h3 className="font-semibold text-lg text-text-primary flex-1">{report.title}</h3>
            </div>
            
            <p className="text-sm text-text-secondary mb-6 flex-1">
              {report.description}
            </p>
            
            <BaseButton 
              className="w-full justify-center" 
              onClick={() => handleGenerate(report.id, report.generateData)}
              isLoading={isGenerating === report.id}
            >
              <Download className="w-4 h-4 mr-2" />
              Generar PDF
            </BaseButton>
          </BaseCard>
        ))}
      </div>
    </div>
  );
}
