import { BaseButton } from '../base/BaseButton';
import React, { useState } from 'react';
import { BaseModal } from '../base/BaseModal';
import { Download, ZoomIn, ZoomOut, Maximize, FileText, X } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl?: string; // e.g. PDF url or image
  metadata?: {
    name: string;
    type: 'pdf' | 'image' | 'doc';
    size: string;
    uploadedBy: string;
    createdAt: string;
  };
}

export function BaseDocumentViewer({ isOpen, onClose, documentUrl, metadata }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Obteniendo enlace de descarga...',
        success: () => {
          setIsDownloading(false);
          return `Documento ${metadata?.name || 'sin título'} descargado correctamente.`;
        },
        error: () => {
          setIsDownloading(false);
          return 'Error al descargar el documento.';
        }
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-bg-inverted/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-bg-surface w-full h-full md:rounded-2xl shadow-2xl flex flex-col border border-border-strong overflow-hidden relative">
        {/* Toolbar */}
        <div className="flex-shrink-0 h-16 border-b border-border-base bg-bg-surface-hover flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-brand-primary text-text-inverted rounded-lg shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary tracking-tight">{metadata?.name || 'Documento sin título'}</h3>
              <p className="text-xs text-text-secondary">{metadata?.size || '-- MB'} • Subido por {metadata?.uploadedBy || 'Sistema'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:block text-xs font-medium text-text-tertiary mr-4">Zoom: {Math.round(zoom * 100)}%</span>
            <div className="flex items-center bg-bg-surface border border-border-base rounded-md overflow-hidden">
              <button 
                onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                className="p-2 text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-brand-primary"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-border-base"></div>
              <button 
                onClick={() => setZoom(z => Math.min(3, z + 0.25))}
                className="p-2 text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-brand-primary"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
            <div className="h-6 w-px bg-border-strong mx-2 hidden md:block"></div>
            <BaseButton variant="secondary" size="sm" className="hidden md:flex" onClick={handleDownload} isLoading={isDownloading}>
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </BaseButton>
            <button 
              onClick={onClose}
              className="p-2 rounded-md bg-danger/10 text-danger hover:bg-danger hover:text-text-inverted transition-colors focus:outline-none ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative flex">
          {/* Viewer Canvas */}
          <div className="flex-1 bg-border-base overflow-auto relative flex items-center justify-center p-8">
            <div 
              className="bg-bg-surface shadow-2xl transition-transform duration-200 origin-center flex items-center justify-center min-h-[800px] w-[600px] border border-border-strong mb-12"
              style={{ transform: `scale(${zoom})` }}
            >
               {documentUrl ? (
                 <iframe src={`${documentUrl}#toolbar=0`} className="w-full h-full pointer-events-none" title="Document Viewer" />
               ) : (
                  <div className="text-center text-text-tertiary p-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Contenido del documento</p>
                    <p className="text-sm mt-2">Visor Universal Multi-tenant Listo.</p>
                  </div>
               )}
            </div>
          </div>
          
          {/* Version History Sidebar */}
          <div className="w-80 bg-bg-surface border-l border-border-base flex flex-col shrink-0">
             <div className="p-4 border-b border-border-base bg-bg-surface-hover">
               <h4 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                 <FileText className="w-4 h-4 text-brand-primary" />
                 Historial de Versiones
               </h4>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="relative pl-4 border-l-2 border-brand-primary/30">
                  <div className="absolute w-2 h-2 bg-brand-primary rounded-full -left-[5px] top-1"></div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-semibold text-text-primary">v3.0 (Actual)</span>
                    <span className="text-[10px] text-text-tertiary">Hace 1 hora</span>
                  </div>
                  <p className="text-xs text-text-secondary">Subido por: {metadata?.uploadedBy || 'Sistema'}</p>
                  <p className="text-xs text-brand-primary mt-1 font-medium bg-brand-primary/5 p-1.5 rounded">Firma verificada, documento final.</p>
                </div>
                
                <div className="relative pl-4 border-l-2 border-border-base">
                  <div className="absolute w-2 h-2 bg-border-strong rounded-full -left-[5px] top-1"></div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">v2.1</span>
                    <span className="text-[10px] text-text-tertiary">Ayer, 16:30</span>
                  </div>
                  <p className="text-xs text-text-secondary">Subido por: Juan Ventas</p>
                  <p className="text-xs text-text-tertiary mt-1 bg-bg-base p-1.5 rounded">Corrección de anexo comercial.</p>
                </div>

                <div className="relative pl-4 border-l-2 border-border-base">
                  <div className="absolute w-2 h-2 bg-border-strong rounded-full -left-[5px] top-1"></div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">v1.0</span>
                    <span className="text-[10px] text-text-tertiary">02 May, 10:15</span>
                  </div>
                  <p className="text-xs text-text-secondary">Subido por: Sistema (Carga inicial)</p>
                  <p className="text-xs text-text-tertiary mt-1 bg-bg-base p-1.5 rounded">Primer borrador de contrato.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
