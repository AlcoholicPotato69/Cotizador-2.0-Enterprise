import React, { useState, useRef } from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseDataTable } from '../../components/base/BaseDataTable';
import { BaseModal } from '../../components/base/BaseModal';
import { BaseInput } from '../../components/base/BaseInput';
import { BaseSelect } from '../../components/base/BaseSelect';
import { Plus, Edit2, FileText, Download, CheckCircle, ShieldAlert, MonitorUp, Code, CopyPlus } from 'lucide-react';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';

const VARIABLES_MAP: Record<string, {name: string, description: string}[]> = {
  contract: [
    { name: 'client.name', description: 'Nombre del cliente / arrendatario' },
    { name: 'client.rfc', description: 'RFC del cliente' },
    { name: 'space.name', description: 'Nombre del espacio asignado' },
    { name: 'event.date', description: 'Fecha del evento' },
    { name: 'contract.total', description: 'Total (Numérico)' },
  ],
  quote: [
    { name: 'client.name', description: 'Nombre del prospecto' },
    { name: 'quote.total', description: 'Total cotizado' },
    { name: 'quote.validity', description: 'Días de vigencia' },
  ],
  regulation: [
    { name: 'tenant.name', description: 'Razón Social / Organización' },
    { name: 'space.name', description: 'Nombre del espacio' },
  ],
  letterhead: [
    { name: 'tenant.name', description: 'Razón Social' },
    { name: 'tenant.logo', description: 'URL estática del logo' },
    { name: 'current_date', description: 'Fecha de generación' },
  ]
};

export function SettingsTemplates() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', type: 'contract', appliesTo: 'ALL', content: '' });
  const [isEditorMode, setIsEditorMode] = useState(false);
  
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [templates, setTemplates] = useState([
    { id: 'TPL-001', name: 'Contrato Arrendamiento Premium', type: 'contract', updated_at: '2026-05-24', status: 'ACTIVE' },
    { id: 'TPL-002', name: 'Membrete Oficial Corporativo', type: 'letterhead', updated_at: '2026-05-10', status: 'ACTIVE' },
    { id: 'TPL-003', name: 'Reglamento de Jardines', type: 'regulation', updated_at: '2026-04-18', status: 'ACTIVE' },
    { id: 'TPL-004', name: 'Cotización B2B Default', type: 'quote', updated_at: '2026-01-20', status: 'ACTIVE' },
  ]);

  const mapType = (type: string) => {
    switch (type) {
      case 'contract': return { label: 'Contrato', icon: <FileText className="w-4 h-4 text-brand-primary" /> };
      case 'letterhead': return { label: 'Membrete / Fondo PDF', icon: <MonitorUp className="w-4 h-4 text-brand-secondary" /> };
      case 'regulation': return { label: 'Reglamento', icon: <ShieldAlert className="w-4 h-4 text-warning" /> };
      case 'quote': return { label: 'Cotización', icon: <FileText className="w-4 h-4 text-success" /> };
      default: return { label: 'Otro', icon: <FileText className="w-4 h-4 text-text-tertiary" /> };
    }
  };

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Nombre de Plantilla', accessorKey: 'name', cell: (row: any) => <span className="font-semibold text-text-primary">{row.name}</span> },
    { 
      header: 'Tipo', 
      accessorKey: 'type',
      cell: (row: any) => {
        const meta = mapType(row.type);
        return (
          <span className="flex items-center gap-2">
            {meta.icon}
            <span>{meta.label}</span>
          </span>
        );
      }
    },
    { header: 'Última Edición', accessorKey: 'updated_at' },
    { 
      header: 'Estado', 
      accessorKey: 'status',
      cell: (row: any) => (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success text-xs font-semibold rounded-md">
          <CheckCircle className="w-3 h-3" />
          Activo
        </span>
      )
    },
    {
      header: 'Acciones',
      accessorKey: 'actions',
      cell: (row: any) => (
        <div className="flex justify-end gap-2">
          <button className="p-1 text-text-tertiary hover:text-brand-primary transition-colors" title="Descargar Origen">
            <Download className="w-4 h-4" />
          </button>
          <button 
            className="p-1 text-text-tertiary hover:text-brand-primary transition-colors" 
            title="Editar Plantilla"
            onClick={() => handleEdit(row)}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      ),
      align: 'right'
    }
  ];

  const handleEdit = (templateData: any) => {
    setFormData({
       id: templateData.id,
       name: templateData.name,
       type: templateData.type,
       appliesTo: 'ALL',
       content: '<!-- HTML/Handlebars Plantilla Base -->\n<h1>{{tenant.name}}</h1>'
    });
    setIsEditorMode(true);
    setIsModalOpen(true);
  };

  const handleValidateSyntax = (): boolean => {
    const activeVariables = VARIABLES_MAP[formData.type] || [];
    const validVarNames = activeVariables.map(v => v.name);
    
    const matches = formData.content.match(/{{([^}]+)}}/g);
    
    if (!matches) {
       return true;
    }

    const invalidVars = [];
    for (const match of matches) {
      const varName = match.replace('{{', '').replace('}}', '').trim();
      if (!validVarNames.includes(varName)) {
         invalidVars.push(varName);
      }
    }
    
    if (invalidVars.length > 0) {
      toast.error(`Error: variables no permitidas encontradas: ${invalidVars.join(', ')}`);
      return false;
    }
    
    return true;
  };

  const handleValidateClick = () => {
     if (handleValidateSyntax()) {
       toast.success('Sintaxis validada: todos los marcadores coinciden con las variables permitidas.');
     }
  };

  const handleCreate = () => {
    if (!formData.name) return toast.error('Ingrese el nombre de la plantilla');
    
    if (isEditorMode) {
      if (!handleValidateSyntax()) {
        return; // Prevents saving if validation fails
      }
    }

    if (formData.id) {
       // Is editing
       setTemplates(templates.map(t => t.id === formData.id ? {
           ...t,
           name: formData.name,
           type: formData.type,
           updated_at: new Date().toISOString().split('T')[0]
       } : t));
       toast.success('Plantilla actualizada y guardada dinámicamente en servidor');
    } else {
       // Is creating
       const newId = `TPL-00${templates.length + 1}`;
       setTemplates([
         ...templates,
         {
           id: newId,
           name: formData.name,
           type: formData.type,
           updated_at: new Date().toISOString().split('T')[0],
           status: 'ACTIVE'
         }
       ]);
       toast.success('Plantilla registrada en el sistema');
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', type: 'contract', appliesTo: 'ALL', content: '' });
    setIsEditorMode(false);
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const insertVariable = (variableName: string) => {
    if (editorRef.current && monacoRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      editor.executeEdits("insert-var", [
        {
           range: selection,
           text: `{{${variableName}}}`,
           forceMoveMarkers: true,
        }
      ]);
      editor.focus();
    }
  };

  const activeVariables = VARIABLES_MAP[formData.type] || [];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-start">
         <div className="max-w-3xl">
           <p className="text-text-secondary leading-relaxed text-sm">
             Administra las plantillas oficiales del sistema. Estas plantillas se utilizarán para la generación de contratos, 
             exportación de cotizaciones, y como base visual (membretes y marcas de agua) en todos los documentos descargables generados en formato PDF y Word.
           </p>
         </div>
         <BaseButton onClick={() => { resetForm(); setIsEditorMode(true); setIsModalOpen(true); }}>
           <Code className="w-4 h-4 mr-2" />
           Crear Plantilla (IDE)
         </BaseButton>
      </div>

      <BaseCard noPadding>
        <BaseDataTable columns={columns} data={templates} />
      </BaseCard>

      <BaseModal
        title={formData.id ? `Editar Plantilla DocGenerative: ${formData.id}` : "Nueva Plantilla DocGenerative"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size={isEditorMode ? "xl" : "md"}
      >
        <div className="flex flex-col h-full gap-4">
          {!isEditorMode ? (
             <div className="space-y-4">
               <p className="text-sm text-text-secondary">
                  Defina las propiedades base de la nueva plantilla.
               </p>
               {/* Legacy upload UI hidden to favor IDE mode */}
             </div>
          ) : (
             <>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <BaseInput 
                    label="Nombre de la Plantilla" 
                    placeholder="Ej: Contrato Eventos Masivos V3" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <BaseSelect 
                    label="Tipo de Recurso"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    options={[
                       { value: 'contract', label: 'Contrato Comercial' },
                       { value: 'quote', label: 'Formato de Cotización' },
                       { value: 'regulation', label: 'Reglamento / Anexo' },
                       { value: 'letterhead', label: 'Fondo Estático / Membrete de PDF' },
                    ]}
                  />
                  <BaseSelect 
                    label="Alcance"
                    value={formData.appliesTo}
                    onChange={(e) => setFormData({...formData, appliesTo: e.target.value})}
                    options={[
                       { value: 'ALL', label: 'Global (Todo el Tenant)' },
                       { value: 'SPECIFIC', label: 'Espacios Específicos' }
                    ]}
                  />
               </div>

               {formData.type === 'letterhead' ? (
                 <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border-strong rounded-xl bg-bg-surface-hover/50 p-12">
                   <div className="text-center">
                     <FileText className="w-12 h-12 text-brand-primary mx-auto opacity-80 mb-4" />
                     <h3 className="text-lg font-medium text-text-primary">Subir Archivo de Membrete</h3>
                     <p className="text-sm text-text-secondary mt-2 mb-6">
                       Sube una imagen o capa PDF para incrustar automáticamente en el fondo de los documentos generados.
                     </p>
                     <BaseButton variant="primary" onClick={() => toast.success('Explorador de archivos simulado')}>
                       Seleccionar Archivo (PNG, JPG, PDF)
                     </BaseButton>
                   </div>
                 </div>
               ) : (
                 <div className="flex flex-1 gap-4 min-h-[400px]">
                    {/* Variables Sidebar */}
                  <div className="w-64 flex flex-col border border-border-base rounded-md overflow-hidden bg-bg-surface-hover/50">
                    <div className="p-3 border-b border-border-base bg-bg-surface flex items-center gap-2">
                       <FileText className="w-4 h-4 text-brand-primary" />
                       <h4 className="text-sm font-semibold text-text-primary">Variables Locales</h4>
                    </div>
                    <div className="p-2 flex-1 overflow-y-auto space-y-2">
                      <p className="text-[10px] uppercase font-bold text-text-tertiary mb-3 tracking-wider">Disponibles ({formData.type})</p>
                      {activeVariables.map(v => (
                         <div 
                           key={v.name} 
                           className="group flex flex-col p-2 rounded bg-bg-surface border border-border-base hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-colors cursor-pointer"
                           onClick={() => insertVariable(v.name)}
                         >
                           <div className="flex justify-between items-center w-full">
                              <span className="font-mono text-xs text-brand-primary font-medium">{`{{${v.name}}}`}</span>
                              <CopyPlus className="w-3 h-3 text-text-tertiary group-hover:text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                           </div>
                           <span className="text-[10px] text-text-secondary mt-1 tracking-tight leading-tight">{v.description}</span>
                         </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Monaco Editor Container */}
                  <div className="flex-1 flex flex-col border border-border-base rounded-md overflow-hidden bg-white">
                    <div className="p-2 border-b border-border-base bg-bg-surface flex justify-between items-center">
                       <span className="text-xs font-mono text-text-tertiary">HTML / Handlebars Editor</span>
                       <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded font-medium">Validación Activa</span>
                    </div>
                    <div className="flex-1 relative">
                      <Editor 
                        height="100%"
                        defaultLanguage="html"
                        theme="light" // Always light theme for Editor context to maximize readable contrast for HTML templates 
                        value={formData.content}
                        onChange={(val) => setFormData({...formData, content: val || ''})}
                        onMount={handleEditorDidMount}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 13,
                          wordWrap: "on",
                          formatOnPaste: true,
                          padding: { top: 16, bottom: 16 }
                        }}
                      />
                    </div>
                  </div>
               </div>
               )}
             </>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-border-base shrink-0 mt-2">
            <div>
              {isEditorMode && (
                <BaseButton variant="ghost" onClick={handleValidateClick} className="text-brand-primary border border-brand-primary/20">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Validar Sintaxis
                </BaseButton>
              )}
            </div>
            <div className="flex gap-3">
              <BaseButton variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</BaseButton>
              <BaseButton variant="primary" onClick={handleCreate}>Guardar y Sincronizar Plantilla</BaseButton>
            </div>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
