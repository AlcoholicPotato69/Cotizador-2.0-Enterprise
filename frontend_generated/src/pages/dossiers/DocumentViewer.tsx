import { BaseButton } from '../../components/base/BaseButton';
import { BaseModal } from '../../components/base/BaseModal';
import { BaseSelect } from '../../components/base/BaseSelect';
import { BaseInput } from '../../components/base/BaseInput';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Download, Share2, ShieldCheck, FileText, CheckCircle, XCircle, ScanText, CornerDownRight } from 'lucide-react';
import { PermissionGuard } from '../../core/PermissionGuard';
import { generatePDF } from '../../utils/pdfGenerator';
import { toast } from 'sonner';

export function DocumentViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  
  // OCR & Review State
  const [isOcrActive, setIsOcrActive] = useState(false);
  const [isOcrLoading, setIsOcrLoading] = useState(true);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('illegible');
  const [customReason, setCustomReason] = useState('');
  const [docStatus, setDocStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const docType = 'csf'; // Simulated active upload (constancia de situacion fiscal)
  
  React.useEffect(() => {
    // Simulate OCR delay
    const timer = setTimeout(() => {
      setIsOcrLoading(false);
      setIsOcrActive(true);
      toast.success('Extracción OCR completada exitosamente.');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    setIsDownloading(true);
    
    // Use true pdf generator
    setTimeout(() => {
      generatePDF({
        title: 'Documento Visualizado',
        subtitle: `ID: ${id}`,
        content: [
          'Este es un documento exportado desde el visor seguro del sistema.',
          'El contenido original fue procesado para descarga.'
        ],
        filename: `Doc_${id || 'Export'}`
      });
      setIsDownloading(false);
      toast.success('Documento descargado correctamente.');
    }, 1000);
  };

  const handleShare = () => {
    toast.success('Enlace de seguridad generado y copiado al portapapeles');
  };

  const handleApprove = () => {
    setDocStatus('approved');
    toast.success('Documento validado y aprobado exitosamente');
  };

  const handleReject = () => {
    const finalReason = rejectReason === 'custom' ? customReason : rejectReason;
    if (!finalReason) {
      toast.error('Debe especificar un motivo de rechazo');
      return;
    }
    setDocStatus('rejected');
    setIsRejectModalOpen(false);
    toast.error(`Documento rechazado: ${finalReason}`);
  };

  // Mocked OCR result based on type
  const ocrResults: Record<string, any> = {
    invoice: {
      'Folio Fiscal (UUID)': '8E9B...A12C',
      'Razón Social': 'Acme Corp',
      'Fecha Emisión': '2026-05-24',
      'Concepto Principal': 'Arrendamiento de Espacio',
      'Total': '$25,000.00'
    },
    csf: {
      'Razón Social': 'Acme Corp S.A. de C.V.',
      'RFC': 'ACM010101XYZ',
      'Fecha Emisión': '2026-05-20',
      'Vigencia': 'Válida (Menos de 3 meses)',
      'Régimen Fiscal': 'General de Ley Personas Morales'
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] -m-6 bg-bg-surface">
      {/* Viewer Header */}
      <div className="h-16 flex-shrink-0 flex items-center justify-between px-4 border-b border-border-base bg-bg-base">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-bg-surface hover:text-text-primary rounded-lg transition-colors text-text-secondary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-primary" />
              <h1 className="text-sm font-semibold text-text-primary">Constancia_Situacion_Fiscal.pdf</h1>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">ID: {id} • 2.4 MB • Versión 1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {docStatus === 'pending' ? (
            <div className="flex items-center gap-2 border-r border-border-base pr-4 mr-2">
              <BaseButton variant="outline" className="border-danger text-danger hover:bg-danger/10" onClick={() => setIsRejectModalOpen(true)}>
                <XCircle className="w-4 h-4 mr-2" />
                Rechazar
              </BaseButton>
              <BaseButton variant="primary" className="bg-success hover:bg-success/90" onClick={handleApprove}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprobar Documento
              </BaseButton>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-r border-border-base pr-4 mr-2 text-sm font-medium">
               {docStatus === 'approved' ? (
                 <span className="text-success flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Aprobado</span>
               ) : (
                 <span className="text-danger flex items-center gap-1"><XCircle className="w-4 h-4" /> Rechazado</span>
               )}
            </div>
          )}

          <div className="flex items-center gap-1 border-r border-border-base pr-2 mr-2">
             <button className="p-1.5 hover:bg-bg-surface rounded text-text-secondary hover:text-text-primary">
               <ZoomOut className="w-4 h-4" />
             </button>
             <span className="text-sm font-medium text-text-primary px-2">100%</span>
             <button className="p-1.5 hover:bg-bg-surface rounded text-text-secondary hover:text-text-primary">
               <ZoomIn className="w-4 h-4" />
             </button>
          </div>
          <PermissionGuard permissions="admin.access">
            <BaseButton variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </BaseButton>
          </PermissionGuard>
          <PermissionGuard permissions="admin.access">
            <BaseButton onClick={handleDownload} isLoading={isDownloading}>
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </BaseButton>
          </PermissionGuard>
        </div>
      </div>

      {/* Viewer Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* PDF Placeholder */}
        <div className="flex-1 bg-bg-surface-hover border-r border-border-base overflow-y-auto p-8 flex justify-center">
            <div className="w-full max-w-4xl bg-bg-base border border-border-base shadow-xl min-h-[1100px] p-12">
               <div className="border-b-2 border-border-strong pb-4 mb-8 flex justify-between items-end">
                   <div>
                       <h2 className="text-2xl font-bold font-serif text-text-primary">CONTANCIA DE SITUACIÓN FISCAL</h2>
                       <p className="text-sm text-text-secondary mt-2">Folio: SAT-2026</p>
                   </div>
                   <div className="text-right">
                       <p className="text-xs text-text-tertiary">FECHA EMISIÓN: 20/05/2026</p>
                       <p className="text-xs font-mono text-text-secondary mt-1">Acme Corp S.A. de C.V.</p>
                   </div>
               </div>
               
               <div className="space-y-6 text-sm text-text-primary leading-relaxed text-justify">
                   <p>El Servicio de Administración Tributaria (SAT)...</p>
               </div>
            </div>
        </div>

        {/* Audit Sidebar */}
        <div className="w-80 bg-bg-base flex flex-col z-10 shadow-lg">
            <div className="p-4 border-b border-border-base bg-brand-primary/5">
               <h3 className="font-semibold text-brand-primary flex items-center gap-2">
                 <ScanText className="w-4 h-4" />
                 {isOcrLoading ? 'Procesando Documento...' : 'Extracción OCR Activa'}
               </h3>
               <p className="text-xs text-text-secondary mt-1">
                 {isOcrLoading ? 'Analizando folio fiscal y vigencia...' : 'Datos extraídos automáticamente mediante IA'}
               </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
               {isOcrLoading ? (
                 <div className="flex flex-col items-center justify-center py-10 text-brand-primary">
                    <div className="w-8 h-8 rounded-full border-4 border-brand-primary/20 border-t-brand-primary animate-spin mb-4" />
                    <p className="text-sm font-medium animate-pulse">Servicio OCR Trabajando...</p>
                 </div>
               ) : (
                 <div>
                    <div className="bg-bg-surface border border-border-base rounded p-4 text-sm space-y-3">
                       {Object.entries(ocrResults[docType]).map(([key, value]) => (
                         <div key={key} className="flex flex-col">
                           <span className="text-xs text-text-tertiary font-medium">{key}</span>
                           <span className={`font-mono text-xs mt-0.5 ${key === 'Vigencia' ? 'text-success font-bold' : 'text-text-primary'}`}>
                             {value as string}
                           </span>
                         </div>
                       ))}
                    </div>
                    
                    {docType === 'csf' && (
                      <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-md flex items-start gap-2 text-sm text-success-strong">
                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>La vigencia del documento ha sido validada (&lt; 3 meses). El folio fiscal (UUID) y la Razón Social coinciden con el registro del cliente.</p>
                      </div>
                    )}
                 </div>
               )}

               <div className="border-t border-border-base pt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Propiedades
                  </h4>
                  <div className="space-y-2 text-sm">
                     <div className="flex justify-between border-b border-border-base pb-2">
                        <span className="text-text-secondary">Poliza Retención</span>
                        <span className="text-text-primary font-medium">5 Años</span>
                     </div>
                     <div className="flex justify-between border-b border-border-base pb-2">
                        <span className="text-text-secondary">Clasificación</span>
                        <span className="text-text-primary font-medium">Fiscal / Confidencial</span>
                     </div>
                  </div>
               </div>

               <div className="border-t border-border-base pt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Versiones (Snapshots)
                  </h4>
                  <div className="space-y-3 mt-4">
                     <div className="p-3 border border-brand-primary/30 bg-brand-primary/5 rounded-md cursor-pointer">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-brand-primary">v2.0 (Actual)</span>
                          <span className="text-[10px] text-text-tertiary">Hoy 10:42 AM</span>
                        </div>
                        <p className="text-xs text-text-secondary">Actualizada por: ACME Representante</p>
                     </div>
                     <div className="p-3 border border-border-base bg-bg-surface hover:bg-bg-surface-hover transition-colors rounded-md cursor-pointer group">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-text-primary group-hover:text-brand-primary">v1.0</span>
                          <span className="text-[10px] text-text-tertiary">Hace 2 meses</span>
                        </div>
                        <p className="text-xs text-text-secondary">Documento rechazado por: Ilegible</p>
                     </div>
                  </div>
               </div>
            </div>
        </div>
      </div>

      <BaseModal
        title="Rechazar Documento"
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Seleccione el motivo de rechazo. Esto notificará al cliente para re-subir el archivo.</p>
          
          <BaseSelect
            label="Motivo de Rechazo"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            options={[
              { value: 'illegible', label: 'El documento es ilegible o borroso' },
              { value: 'wrong_doc', label: 'Documento equivocado / No corresponde' },
              { value: 'expired', label: 'Documento vencido (mayor a 3 meses)' },
              { value: 'custom', label: 'Otro (Especificar...)' }
            ]}
          />

          {rejectReason === 'custom' && (
            <div className="animate-in fade-in slide-in-from-top-1">
              <BaseInput
                label="Motivo Personalizado"
                placeholder="Especifique el motivo de rechazo..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <BaseButton variant="ghost" onClick={() => setIsRejectModalOpen(false)}>Cancelar</BaseButton>
            <BaseButton variant="primary" className="bg-danger hover:bg-danger/90 border-danger" onClick={handleReject}>Confirmar Rechazo</BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
