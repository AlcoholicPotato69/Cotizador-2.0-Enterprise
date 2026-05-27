import { BaseInput } from '../../components/base/BaseInput';
import { BaseBadge } from '../../components/base/BaseBadge';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseModal } from '../../components/base/BaseModal';
import { BaseSelect } from '../../components/base/BaseSelect';
import { PermissionGuard } from '../../core/PermissionGuard';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Map as MapIcon, Users, Clock, Tag, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../core/api';

// Tarjeta del componente con carrusel en hover
function CatalogCard({ item, onClick }: { item: any; onClick: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && item.images && item.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
      }, 1500);
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, item.images]);

  return (
    <div 
      className="bg-bg-surface border border-border-base rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow group flex flex-col h-full"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 w-full bg-bg-surface-hover overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={item.images[currentImageIndex]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover absolute inset-0"
              alt={item.name}
            />
          </AnimatePresence>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-tertiary">
            <MapIcon className="w-10 h-10 opacity-20" />
          </div>
        )}
        
        {item.images && item.images.length > 1 && isHovered && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
            {item.images.map((_: any, idx: number) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full bg-white transition-all ${idx === currentImageIndex ? 'w-4 opacity-100' : 'w-1.5 opacity-50'}`}
              />
            ))}
          </div>
        )}

        <div className="absolute top-3 right-3 z-10">
          <BaseBadge variant={item.status === 'AVAILABLE' ? 'success' : item.status === 'MAINTENANCE' ? 'warning' : 'info'}>
            {item.status === 'AVAILABLE' ? 'Disponible' : item.status === 'MAINTENANCE' ? 'Mantenimiento' : 'Ocupado'}
          </BaseBadge>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-text-primary text-lg truncate group-hover:text-brand-primary transition-colors">{item.name}</h3>
            <span className="text-xs font-mono text-text-tertiary">{item.id}</span>
          </div>
          <p className="font-bold text-brand-primary">
            ${item.basePricePerHour ? item.basePricePerHour.toLocaleString('es-MX') : '0'} / h
          </p>
        </div>

        <div className="mt-auto space-y-2 pt-4">
          <div className="flex items-center text-sm text-text-secondary gap-2">
            <Tag className="w-4 h-4 text-text-tertiary" />
            <span className="truncate">{item.category} {item.pubType ? `(${item.pubType})` : ''}</span>
          </div>
          
          {(item.category === 'Salones' || item.category === 'Jardines') && (
            <>
              <div className="flex items-center text-sm text-text-secondary gap-2">
                <Users className="w-4 h-4 text-text-tertiary" />
                <span>{item.capacity} personas máx.</span>
              </div>
              <div className="flex items-center text-sm text-text-secondary gap-2">
                <Clock className="w-4 h-4 text-text-tertiary" />
                <span>{item.schedule}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function CatalogList() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchCatalog = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/spaces');
        if (isMounted) {
          setData(res.data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error('Error al cargar el catálogo de espacios');
          console.error('Failed to fetch spaces:', error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCatalog();
    return () => { isMounted = false; };
  }, []);

  const categories = ['All', 'Salones', 'Jardines', 'Publicidad'];

  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      // Form state would be collected here
      await api.post('/spaces', {
        name: 'Nuevo Espacio',
        status: 'AVAILABLE'
      });
      toast.success('Espacio creado exitosamente');
      setIsModalOpen(false);
      // Ideally refresh the list here
    } catch (error) {
      toast.error('Error al crear el espacio');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Catálogo de Espacios</h1>
          <p className="text-text-secondary mt-1">Gestión de inventario publicitario y espacios.</p>
        </div>
        <PermissionGuard permissions="admin.access">
          <BaseButton onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Añadir Espacio
          </BaseButton>
        </PermissionGuard>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 md:max-w-md relative">
          <BaseInput 
            placeholder="Buscar espacios por nombre o ID..." 
            className="pl-10 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Filter className="w-4 h-4 text-text-tertiary ml-2 hidden sm:block" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                categoryFilter === cat 
                  ? 'bg-brand-primary text-white border border-brand-primary' 
                  : 'bg-bg-surface border border-border-base text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary'
              }`}
            >
              {cat === 'All' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredData.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <CatalogCard 
                    item={item} 
                    onClick={() => navigate(`/app/catalog/${item.id}`)} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredData.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-12 bg-bg-surface border border-border-base rounded-xl"
            >
              <MapIcon className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
              <h3 className="text-lg font-medium text-text-primary">No se encontraron espacios</h3>
              <p className="text-text-secondary mt-1">Intenta ajustando tu búsqueda o filtros.</p>
            </motion.div>
          )}
        </>
      )}

      <BaseModal
        title="Añadir Nuevo Espacio"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <BaseInput label="Nombre del Espacio" placeholder="Ej. Jardín Sur" />
          <BaseSelect 
            label="Categoría" 
            options={[
              { value: 'Salones', label: 'Salones' },
              { value: 'Jardines', label: 'Jardines' },
              { value: 'Publicidad Fija', label: 'Publicidad Fija' },
              { value: 'Publicidad Digital', label: 'Publicidad Digital' }
            ]} 
          />
          <BaseInput label="Capacidad Máxima (Aforo)" type="number" placeholder="Ej. 150" />
          <BaseInput label="Precio Base (M.N.)" type="number" placeholder="Ej. 15000" />
          <BaseSelect 
            label="Estado Inicial" 
            options={[
              { value: 'AVAILABLE', label: 'Disponible' },
              { value: 'MAINTENANCE', label: 'Mantenimiento' }
            ]} 
          />
          <div className="flex justify-end gap-3 mt-6">
            <BaseButton variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</BaseButton>
            <BaseButton variant="primary" onClick={handleCreate} isLoading={isCreating}>Guardar Espacio</BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
