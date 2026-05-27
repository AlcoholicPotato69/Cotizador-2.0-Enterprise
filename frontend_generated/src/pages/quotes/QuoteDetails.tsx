import { BaseCard } from '../../components/base/BaseCard';
import { BaseButton } from '../../components/base/BaseButton';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, Download, FileSignature } from 'lucide-react';
import { WorkflowBadge } from '../../components/workflow/WorkflowBadge';
import { PermissionGuard } from '../../core/PermissionGuard';
import { QuoteCreationWizard } from './QuoteCreationWizard';
import { toast } from 'sonner';
import { api } from '../../core/api';

export function QuoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchQuote = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/quotes/${id}`);
        if (mounted) setQuote(res.data);
      } catch (error) {
        if (mounted) toast.error('Error al cargar la cotización');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    if (id !== 'new') {
      fetchQuote();
    }
    return () => { mounted = false; };
  }, [id]);

  if (id === 'new') {
    return <QuoteCreationWizard />;
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await api.get(`/quotes/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Cotizacion_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Cotización descargada correctamente.');
    } catch (error) {
      toast.error('Error en la descarga.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await api.post(`/quotes/${id}/approve`);
      toast.success('Cotización aprobada. Generando contrato...');
      navigate('/app/contracts');
    } catch (error) {
      toast.error('Error al aprobar la cotización');
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-text-secondary">Cargando cotización...</div>;
  }

  if (!quote) {
    return <div className="p-8 text-center text-text-secondary">Cotización no encontrada.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/app/quotes')}
            className="p-2 hover:bg-bg-surface-hover rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">Cotización {quote.id}</h1>
              <WorkflowBadge state={quote.status || 'SENT'} />
            </div>
            <p className="text-text-secondary mt-1">{quote.client?.name} • {new Date(quote.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <PermissionGuard permissions="admin.access">
            <BaseButton variant="outline" onClick={handleDownload} isLoading={isDownloading}>
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </BaseButton>
          </PermissionGuard>
          <PermissionGuard permissions="admin.access">
            <BaseButton onClick={handleApprove} isLoading={isApproving}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprobar y Generar Contrato
            </BaseButton>
          </PermissionGuard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-surface border border-border-base rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Desglose de Precios</h2>
            <div className="space-y-4">
              {quote.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-border-base">
                  <div>
                    <p className="font-medium text-text-primary">{item.description || item.space?.name}</p>
                    <p className="text-sm text-text-secondary">{item.details}</p>
                  </div>
                  <p className="font-medium text-text-primary">${(item.price || 0).toLocaleString()} MXN</p>
                </div>
              ))}
              {(!quote.items || quote.items.length === 0) && (
                <div className="flex justify-between items-center py-3 border-b border-border-base">
                   <div>
                     <p className="font-medium text-text-primary">Servicio General</p>
                   </div>
                   <p className="font-medium text-text-primary">${((quote.totalAmount || 0) / 1.16).toLocaleString()} MXN</p>
                </div>
              )}
              <div className="pt-4 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="text-text-primary font-medium">${((quote.totalAmount || 0) / 1.16).toLocaleString()} MXN</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">IVA (16%)</span>
                    <span className="text-text-primary font-medium">${((quote.totalAmount || 0) - (quote.totalAmount || 0) / 1.16).toLocaleString()} MXN</span>
                  </div>
                  <div className="pt-2 border-t border-border-base flex justify-between text-lg font-bold">
                    <span className="text-text-primary">TOTAL</span>
                    <span className="text-brand-primary">${(quote.totalAmount || 0).toLocaleString()} MXN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-surface border border-border-base rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Archivos Adjuntos (Quote Files)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {quote.files?.map((file: any) => (
                 <div 
                   key={file.id}
                   onClick={() => navigate(`/app/documents/${file.id}`)}
                   className="flex items-center gap-3 p-3 border border-border-base rounded-lg hover:border-brand-primary cursor-pointer transition-colors"
                 >
                    <div className="w-10 h-10 rounded bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{file.name}</p>
                      <p className="text-xs text-text-secondary">{file.size} • {new Date(file.createdAt).toLocaleDateString()}</p>
                    </div>
                 </div>
               ))}
               {(!quote.files || quote.files.length === 0) && (
                 <p className="text-text-secondary text-sm">No hay archivos adjuntos.</p>
               )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <BaseCard title="Resumen" headerAction={<FileSignature className="w-5 h-5 text-text-tertiary" />}>
             <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-secondary">Cliente</p>
                  <p className="font-medium text-text-primary">{quote.client?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Válido hasta</p>
                  <p className="font-medium text-text-primary">{quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Moneda</p>
                  <p className="font-medium text-text-primary">{quote.currency || 'MXN'}</p>
                </div>
             </div>
          </BaseCard>
          
          <div className="bg-bg-surface border border-border-base rounded-xl p-6">
             <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Integración Workflow</h3>
             <ul className="space-y-4 relative before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-border-base">
               <li className="relative flex gap-4">
                 <div className="w-5 h-5 rounded-full bg-brand-primary text-text-inverted flex items-center justify-center shrink-0 z-10">
                   <div className="w-2 h-2 rounded-full bg-white" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-text-primary">Borrador Creado</p>
                   <p className="text-xs text-text-secondary">{new Date(quote.createdAt).toLocaleString()}</p>
                 </div>
               </li>
               <li className="relative flex gap-4">
                 <div className={`w-5 h-5 rounded-full ${quote.status === 'SENT' || quote.status === 'APPROVED' ? 'bg-brand-primary text-text-inverted' : 'bg-bg-surface border-2 border-border-base'} flex items-center justify-center shrink-0 z-10`}>
                   {(quote.status === 'SENT' || quote.status === 'APPROVED') && <div className="w-2 h-2 rounded-full bg-white" />}
                 </div>
                 <div>
                   <p className={`text-sm font-medium ${quote.status === 'SENT' || quote.status === 'APPROVED' ? 'text-text-primary' : 'text-text-secondary'}`}>Enviado al Cliente</p>
                   <p className="text-xs text-text-tertiary">{quote.sentAt ? new Date(quote.sentAt).toLocaleString() : 'Pendiente'}</p>
                 </div>
               </li>
               <li className="relative flex gap-4">
                 <div className={`w-5 h-5 rounded-full ${quote.status === 'APPROVED' ? 'bg-brand-primary text-text-inverted' : 'bg-bg-surface border-2 border-border-base'} flex items-center justify-center shrink-0 z-10`}>
                   {quote.status === 'APPROVED' && <div className="w-2 h-2 rounded-full bg-white" />}
                 </div>
                 <div>
                   <p className={`text-sm font-medium ${quote.status === 'APPROVED' ? 'text-text-primary' : 'text-text-secondary'}`}>Aprobación del Cliente</p>
                   <p className="text-xs text-text-tertiary">{quote.approvedAt ? new Date(quote.approvedAt).toLocaleString() : 'Pendiente'}</p>
                 </div>
               </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
