import { BaseCard } from '../../components/base/BaseCard';
import { BaseBadge } from '../../components/base/BaseBadge';
import { BaseButton } from '../../components/base/BaseButton';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Briefcase, Mail, Phone, Calendar } from 'lucide-react';
import { ClientDossier } from '../../components/dossier/ClientDossier';
import { PermissionGuard } from '../../core/PermissionGuard';
import { toast } from 'sonner';
import { api } from '../../core/api';

export function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [client, setClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/clients/' + id);
        setClient(response.data);
      } catch (err: any) {
        setError(err.message || 'Error fetching client');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchClient();
    }
  }, [id]);

  const handleNewQuote = () => {
    toast.success(`Nueva cotización iniciada para ${client?.name || 'Cliente'}`);
    navigate('/app/quotes');
  };

  const handleViewDossier = () => {
    navigate('/app/dossiers');
    toast.info('Abriendo vista de expedientes');
  };

  if (isLoading) {
    return <div className="p-6">Cargando detalles del cliente...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!client) {
    return <div className="p-6">No se encontró el cliente</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/app/clients')}
            className="p-2 hover:bg-bg-surface-hover rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">{client.name}</h1>
              <BaseBadge variant="success">{client.status || 'CLIENTE'}</BaseBadge>
            </div>
            <p className="text-text-secondary mt-1">ID: {client.id} • {client.type || 'Empresa Privada'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <PermissionGuard permissions="quotes.create">
            <BaseButton variant="outline" onClick={handleNewQuote}>
              <Briefcase className="w-4 h-4 mr-2" />
              Nueva Cotización
            </BaseButton>
          </PermissionGuard>
          <PermissionGuard permissions="admin.access">
            <BaseButton onClick={handleViewDossier}>
              <FileText className="w-4 h-4 mr-2" />
              Ver Expediente (Dossier)
            </BaseButton>
          </PermissionGuard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <BaseCard title="Información de Contacto" headerAction={<Mail className="w-5 h-5 text-text-tertiary" />}>
             <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-text-secondary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{client.email || client.contactEmail || 'Sin email'}</p>
                    <p className="text-xs text-text-secondary">Email principal</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-text-secondary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{client.phone || client.contactPhone || 'Sin teléfono'}</p>
                    <p className="text-xs text-text-secondary">Teléfono corporativo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-text-secondary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'Sin fecha'}
                    </p>
                    <p className="text-xs text-text-secondary">Fecha de registro</p>
                  </div>
                </div>
             </div>
          </BaseCard>

          <BaseCard title="Validaciones" headerAction={<FileText className="w-5 h-5 text-text-tertiary" />}>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Validación Fiscal:</span>
                <BaseBadge variant="success">Aprobado</BaseBadge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Bloqueo Pagos:</span>
                <span className="font-medium text-text-primary">No</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Bloqueo Contratos:</span>
                <span className="font-medium text-text-primary">No</span>
              </div>
            </div>
          </BaseCard>
        </div>
        
        <div className="lg:col-span-2">
           <ClientDossier client={client} />
        </div>
      </div>
    </div>
  );
}
