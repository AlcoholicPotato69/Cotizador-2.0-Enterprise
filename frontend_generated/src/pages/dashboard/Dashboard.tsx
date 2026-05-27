import React, { useState, useEffect } from 'react';
import { BaseStatsCard } from '../../components/base/BaseStatsCard';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseModal } from '../../components/base/BaseModal';
import { BaseLoading } from '../../components/base/BaseLoading';
import { BaseErrorState } from '../../components/base/BaseErrorState';
import { useTenantStore } from '../../core/tenant';
import { useAuthStore } from '../../core/auth';
import { api } from '../../core/api';
import { Activity, Clock, AlertCircle, CheckCircle2, TrendingUp, Calendar, FileText, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { currentTenant, tenantMetadata } = useTenantStore();
  const tenant = currentTenant ? tenantMetadata[currentTenant] : null;
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/dashboard/metrics');
      setMetrics(response.data.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [currentTenant]);

  const handleViewDetails = (activity: any) => {
    setSelectedActivity(activity);
    setIsActivityModalOpen(true);
  };

  const handleNavigateToActivity = () => {
    setIsActivityModalOpen(false);
    if (selectedActivity?.type === 'QUOTE') {
      navigate('/app/quotes');
    } else {
      navigate('/app/contracts');
    }
  };

  if (isLoading) {
    return <BaseLoading fullHeight text="Cargando métricas del dashboard..." />;
  }

  if (error) {
    return <BaseErrorState onRetry={loadMetrics} />;
  }

  const activities = metrics?.recentActivity || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Hola, {user?.firstName || 'Usuario'}
        </h1>
        <p className="text-text-secondary mt-1">
          Aquí tienes el resumen de hoy para <span className="font-semibold text-text-primary">{tenant?.name || 'la plataforma'}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <BaseStatsCard
          title="Ingresos Totales"
          value={`$${(metrics?.totalRevenue || 0).toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5 text-success" />}
          trend={{ value: `${metrics?.revenueGrowth > 0 ? '+' : ''}${metrics?.revenueGrowth || 0}% vs mes anterior`, isPositive: (metrics?.revenueGrowth || 0) >= 0 }}
        />

        <BaseStatsCard
          title="Cotizaciones Activas"
          value={metrics?.activeQuotes?.toString() || '0'}
          icon={<TrendingUp className="w-5 h-5 text-brand-primary" />}
          trend={{ value: `${metrics?.quotesGrowth > 0 ? '+' : ''}${metrics?.quotesGrowth || 0}%`, isPositive: (metrics?.quotesGrowth || 0) >= 0 }}
        />

        <BaseStatsCard
          title="Por Validar Firmas"
          value={metrics?.pendingSignatures?.toString() || '0'}
          icon={<Clock className="w-5 h-5 text-warning" />}
        />

        <BaseStatsCard
          title="Ocupación"
          value={`${metrics?.occupancyRate || 0}%`}
          icon={<Activity className="w-5 h-5 text-brand-primary" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Actividad Reciente</h2>
            <button className="text-sm font-medium text-brand-primary hover:text-brand-hover" onClick={() => navigate('/app/activity')}>Ver todo</button>
          </div>
          
          <BaseCard noPadding>
            <div className="divide-y divide-border-base">
              {activities.length > 0 ? (
                activities.map((activity: any) => (
                  <div key={activity.id} className="p-4 flex gap-4 hover:bg-bg-surface-hover transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === 'CONTRACT' ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : (
                        <FileText className="w-5 h-5 text-brand-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">
                        {activity.title}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        {new Date(activity.date).toLocaleDateString()} • {activity.status}
                        {activity.amount ? ` • $${activity.amount.toLocaleString()}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <BaseButton variant="ghost" onClick={() => handleViewDetails(activity)}>Ver Detalles</BaseButton>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-text-secondary text-sm">
                  No hay actividad reciente.
                </div>
              )}
            </div>
          </BaseCard>
        </div>
      </div>

      <BaseModal
        title="Detalles de la Actividad"
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
      >
        <div className="space-y-4">
          <div className="bg-bg-base p-4 rounded-lg border border-border-base">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Resumen</h3>
            <p className="text-text-secondary text-sm">{selectedActivity?.title}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Estado</p>
               <p className="text-sm font-medium text-text-primary">{selectedActivity?.status}</p>
             </div>
             <div>
               <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Fecha</p>
               <p className="text-sm font-medium text-text-primary">
                 {selectedActivity?.date ? new Date(selectedActivity.date).toLocaleDateString() : '-'}
               </p>
             </div>
             {selectedActivity?.amount && (
               <div>
                 <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Monto</p>
                 <p className="text-sm font-medium text-text-primary">${selectedActivity.amount.toLocaleString()}</p>
               </div>
             )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <BaseButton variant="ghost" onClick={() => setIsActivityModalOpen(false)}>Cerrar</BaseButton>
            <BaseButton variant="primary" onClick={handleNavigateToActivity}>Ir al Documento</BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
