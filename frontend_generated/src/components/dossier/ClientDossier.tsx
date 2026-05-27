import { BaseAvatar } from '../base/BaseAvatar';
import { BaseButton } from '../base/BaseButton';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseDossierViewer, DossierSection, DossierField } from './BaseDossierViewer';
import { FileText } from 'lucide-react';
import { api } from '../../core/api';

interface ClientDossierProps {
  client?: any;
}

export function ClientDossier({ client }: ClientDossierProps) {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (client?.id) {
      const fetchDocuments = async () => {
        try {
          setIsLoading(true);
          const response = await api.get(`/client-files?clientId=${client.id}`);
          setDocuments(response.data);
        } catch (error) {
          console.error('Error fetching documents', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDocuments();
    }
  }, [client?.id]);

  const header = (
    <div className="flex items-center gap-4">
      <BaseAvatar size="lg" initials={client?.name || 'C'} />
      <div>
        <h2 className="text-lg font-bold text-text-primary">{client?.name || 'Nombre del Cliente'}</h2>
        <p className="text-sm text-text-secondary">{client?.legalName || 'Razón social'}</p>
      </div>
    </div>
  );

  return (
    <BaseDossierViewer header={header}>
      <DossierSection title="Información General">
        <DossierField label="ID Cliente" value={client?.id || 'CLI-0000'} />
        <DossierField label="RFC" value={client?.rfc || 'XAXX010101000'} />
        <DossierField label="Estado" value={client?.status || 'Activo'} isBadge />
      </DossierSection>
      <DossierSection title="Contacto Principal">
        <DossierField label="Nombre" value={client?.contactName || 'No especificado'} />
        <DossierField label="Email" value={client?.contactEmail || client?.email || 'No especificado'} />
        <DossierField label="Teléfono" value={client?.contactPhone || client?.phone || 'No especificado'} />
      </DossierSection>
      <DossierSection title="Expediente Mantenimiento">
        {isLoading ? (
          <div className="text-sm text-text-secondary mt-2">Cargando documentos...</div>
        ) : documents.length > 0 ? (
          documents.map((doc: any) => (
            <div 
              key={doc.id}
              onClick={() => navigate(`/app/documents/${doc.id}`)}
              className="flex items-center gap-3 p-3 border border-border-base rounded-lg hover:border-brand-primary cursor-pointer transition-colors mt-2"
            >
              <div className="w-10 h-10 rounded bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{doc.name || 'Documento'}</p>
                <p className="text-xs text-text-secondary">
                  {doc.status || 'Subido'} • {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Sin fecha'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-text-secondary mt-2">No hay documentos en el expediente</div>
        )}
      </DossierSection>
    </BaseDossierViewer>
  );
}
