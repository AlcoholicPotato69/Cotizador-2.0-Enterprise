import { BaseBadge } from '../../components/base/BaseBadge';
import { BaseInput } from '../../components/base/BaseInput';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseModal } from '../../components/base/BaseModal';
import { BaseSelect } from '../../components/base/BaseSelect';
import { PermissionGuard } from '../../core/PermissionGuard';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Upload, FileText, Image as ImageIcon, FileCode, CheckCircle } from 'lucide-react';
import { BaseDocumentViewer } from '../../components/viewer/BaseDocumentViewer';
import { toast } from 'sonner';
import { api } from '../../core/api';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc';
  entityType: 'client' | 'contract';
  entityName: string;
  size: string;
  uploadedBy: string;
  createdAt: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

export function DocumentVault() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  React.useEffect(() => {
    let mounted = true;
    const fetchDocs = async () => {
      try {
        const res = await api.get('/documents');
        if (mounted) setDocuments(res.data || []);
      } catch (error) {
        if (mounted) console.error('Failed to fetch documents', error);
      }
    };
    fetchDocs();
    return () => { mounted = false; };
  }, []);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.entityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5" />;
      case 'image': return <ImageIcon className="w-5 h-5" />;
      case 'doc': return <FileCode className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <BaseBadge variant="success">Verificado</BaseBadge>;
      case 'PENDING': return <BaseBadge variant="warning">Pendiente</BaseBadge>;
      case 'REJECTED': return <BaseBadge variant="danger">Rechazado</BaseBadge>;
      default: return <BaseBadge>{status}</BaseBadge>;
    }
  };

  const handleUpload = () => {
    toast.success('Documento encriptado y subido a la bóveda exitosamente');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Bóveda de Documentos</h1>
          <p className="text-text-secondary mt-1">Gestión centralizada de archivos de clientes y contratos.</p>
        </div>
        <div className="flex gap-2">
          <PermissionGuard permissions="admin.access">
            <BaseButton onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Subir Archivo
            </BaseButton>
          </PermissionGuard>
        </div>
      </div>

      <div className="bg-bg-surface border border-border-base rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <BaseInput 
              placeholder="Buscar por nombre o entidad..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-3" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-secondary">Filtro:</span>
            <select 
              className="h-[38px] px-3 bg-bg-base border border-border-base rounded-lg text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Todos los formatos</option>
              <option value="pdf">PDFs</option>
              <option value="image">Imágenes</option>
              <option value="doc">Documentos DOC</option>
            </select>
            <BaseButton variant="outline" className="px-3" aria-label="Filtros avanzados">
              <Filter className="w-4 h-4" />
            </BaseButton>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border-base text-sm text-text-secondary">
                <th className="font-medium px-4 py-3">Nombre</th>
                <th className="font-medium px-4 py-3">Entidad</th>
                <th className="font-medium px-4 py-3">Tamaño</th>
                <th className="font-medium px-4 py-3">Subido por</th>
                <th className="font-medium px-4 py-3">Estado</th>
                <th className="font-medium px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-base text-sm">
              {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-bg-surface-hover transition-colors group cursor-pointer" onClick={() => setSelectedDoc(doc)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        {getIcon(doc.type)}
                      </div>
                      <span className="font-medium text-text-primary">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-text-primary">{doc.entityName}</span>
                    <span className="block text-xs text-text-tertiary capitalize">{doc.entityType}</span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{doc.size}</td>
                  <td className="px-4 py-3 text-text-secondary">{doc.uploadedBy}</td>
                  <td className="px-4 py-3">{getStatusBadge(doc.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <BaseButton size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setSelectedDoc(doc); }}>
                      Vista Previa
                    </BaseButton>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-text-secondary">
                    No se encontraron documentos que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BaseDocumentViewer 
        isOpen={selectedDoc !== null}
        onClose={() => setSelectedDoc(null)}
        documentUrl={selectedDoc ? `https://demo.example.com/docs/${selectedDoc.id}` : undefined}
        metadata={selectedDoc ? {
          name: selectedDoc.name,
          type: selectedDoc.type,
          size: selectedDoc.size,
          uploadedBy: selectedDoc.uploadedBy,
          createdAt: selectedDoc.createdAt
        } : undefined}
      />

      <BaseModal
        title="Subir Documento a la Bóveda"
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      >
        <div className="space-y-4">
          <BaseSelect 
            label="Tipo de Relación" 
            options={[
              { value: 'client', label: 'Cliente (Expediente Legal/Fiscal)' },
              { value: 'quote', label: 'Cotización (Anexos)' },
              { value: 'contract', label: 'Contrato (Firmas/Anexos)' },
              { value: 'space', label: 'Espacio (Planos/Fotos)' }
            ]} 
          />
          <BaseInput label="Entidad Relacionada (ID o Nombre)" placeholder="Ej. Acme Corp o COT-001" />
          <BaseSelect 
            label="Tipo de Documento" 
            options={[
              { value: 'identificacion', label: 'Identificación Oficial' },
              { value: 'acta', label: 'Acta Constitutiva' },
              { value: 'comprobante', label: 'Comprobante de Domicilio' },
              { value: 'plano', label: 'Plano / Distribución' },
              { value: 'otro', label: 'Otro Anexo' }
            ]} 
          />
          <div className="border border-dashed border-border-strong rounded-lg p-8 text-center bg-bg-surface-hover mt-4">
            <Upload className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
            <p className="text-sm font-medium text-text-primary">Haz clic para buscar o arrastra tu archivo aquí</p>
            <p className="text-xs text-text-tertiary mt-1">PDF, JPG, PNG o DOCX (Máx. 10MB)</p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <BaseButton variant="ghost" onClick={() => setIsUploadModalOpen(false)}>Cancelar</BaseButton>
            <BaseButton variant="primary" onClick={handleUpload}>Subir Documento</BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
