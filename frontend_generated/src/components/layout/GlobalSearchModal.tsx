import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Users, FileText, X } from 'lucide-react';
import { BaseModal } from '../base/BaseModal';
import { api } from '../../core/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      try {
        const res = await api.get('/search', { params: { q: query } });
        setResults(res.data || []);
      } catch (err) {
        // Handle error silently for search
      }
    };
    const debounceTimeout = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  // Keyboard shortcut listener (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) { 
          // Open handled by Topbar, but we can't do it here easily if it's controlled outside.
          // In Topbar we will listen to Ctrl+K to open it.
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-bg-surface rounded-xl shadow-2xl border border-border-strong overflow-hidden flex flex-col mx-4 h-[60vh] max-h-[600px] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-border-base px-4 py-3">
          <Search className="w-5 h-5 text-text-tertiary mr-3" />
          <input
            type="text"
            className="flex-1 bg-transparent border-none text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0 text-lg"
            placeholder="Buscar clientes, contratos, espacios..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-md text-text-tertiary hover:bg-bg-surface-hover hover:text-text-primary transition-colors">
             <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {query.length > 0 ? (
            results.length > 0 ? (
              <ul className="space-y-1">
                {results.map(result => (
                  <li key={result.id}>
                    <button
                      onClick={() => handleSelect(result.url)}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-bg-surface-hover flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {result.type === 'espacio' && <Building2 className="w-5 h-5 text-brand-secondary" />}
                        {result.type === 'cliente' && <Users className="w-5 h-5 text-blue-500" />}
                        {result.type === 'contrato' && <FileText className="w-5 h-5 text-emerald-500" />}
                        <span className="font-medium text-text-primary group-hover:text-brand-primary">{result.title}</span>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">{result.type}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
               <div className="text-center text-text-tertiary py-12">
                 <p>No se encontraron resultados para "{query}"</p>
               </div>
            )
          ) : (
             <div className="text-center text-text-tertiary py-12">
               <Search className="w-10 h-10 mx-auto mb-4 opacity-20" />
               <p>Ingresa un término para buscar en todo el sistema.</p>
             </div>
          )}
        </div>
        <div className="border-t border-border-base bg-bg-surface-hover px-4 py-2 text-xs text-text-tertiary flex justify-between">
           <span>Usa las flechas para navegar</span>
           <span><kbd className="font-sans px-1 rounded-md border border-border-strong bg-bg-base">esc</kbd> para cerrar</span>
        </div>
      </div>
    </div>
  );
}
