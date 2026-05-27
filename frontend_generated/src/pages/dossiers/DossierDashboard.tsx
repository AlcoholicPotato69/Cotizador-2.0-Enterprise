import { BaseInfoCard } from '../../components/base/BaseInfoCard';
import { BaseInput } from '../../components/base/BaseInput';
import { BaseButton } from '../../components/base/BaseButton';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Files, FileText, CheckCircle, Search, ArrowRight } from 'lucide-react';

export function DossierDashboard() {
  const navigate = useNavigate();

  const recentDocs = [
    { id: 'DOC-001', name: 'Acta Constitutiva Acme Corp', type: 'Legal', date: '24 May 2026' },
    { id: 'DOC-002', name: 'Contrato Maestría TechFlow', type: 'Contrato', date: '20 May 2026' },
    { id: 'DOC-003', name: 'Comprobante de Domicilio.pdf', type: 'Identificación', date: '19 May 2026' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Expedientes Digitales</h1>
          <p className="text-text-secondary mt-1">Centro de documentación, contratos y acuerdos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BaseInfoCard 
          title="Contratos Activos" 
          description="Accede a la bóveda de contratos vigentes."
          icon={<FileText className="w-6 h-6" />}
        >
           <p className="text-3xl font-bold text-text-primary mt-2">48</p>
        </BaseInfoCard>

        <BaseInfoCard 
          title="Acuerdos en Revisión" 
          description="Documentos pendientes de aprobación o firma."
          icon={<Files className="w-6 h-6" />}
        >
           <p className="text-3xl font-bold text-text-primary mt-2">12</p>
        </BaseInfoCard>

        <BaseInfoCard 
          title="Expedientes Completos" 
          description="Clientes con toda su documentación validada."
          icon={<CheckCircle className="w-6 h-6" />}
        >
           <p className="text-3xl font-bold text-text-primary mt-2">126</p>
        </BaseInfoCard>
      </div>

      <div className="bg-bg-surface border border-border-base rounded-xl p-6 shadow-sm">
         <div className="flex items-center justify-between mb-6">
           <h3 className="text-lg font-semibold text-text-primary">Expedientes Recientes</h3>
           <div className="flex items-center gap-4">
             <BaseButton variant="outline" onClick={() => navigate('/app/boveda')}>
               Abrir Bóveda de Documentos
             </BaseButton>
             <div className="w-64 relative">
               <BaseInput placeholder="Buscar documento..." className="pl-9 h-9 text-sm" />
               <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-2.5" />
             </div>
           </div>
         </div>
         <div className="divide-y divide-border-base border-t border-border-base">
           {recentDocs.map(doc => (
             <div 
               key={doc.id}
               onClick={() => navigate(`/app/documents/${doc.id}`)}
               className="py-4 flex justify-between items-center group cursor-pointer hover:bg-bg-surface-hover px-2 -mx-2 rounded transition-colors"
             >
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <FileText className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-text-primary group-hover:text-brand-primary transition-colors">{doc.name}</p>
                   <p className="text-xs text-text-secondary">{doc.type} • Subido el {doc.date}</p>
                 </div>
               </div>
               <ArrowRight className="w-5 h-5 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}
