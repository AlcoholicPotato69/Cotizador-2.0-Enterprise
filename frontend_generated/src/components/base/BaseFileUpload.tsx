import React, { useCallback } from 'react';
import { UploadCloud, X, File } from 'lucide-react';
import { cn } from '../../utils';
import { BaseButton } from './BaseButton';

export interface BaseFileUploadProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  className?: string;
}

export function BaseFileUpload({
  onUpload,
  accept,
  multiple = false,
  maxSizeMB = 10,
  label = "Sube tus archivos",
  description = "Arrastra y suelta tus archivos aquí, o haz clic para seleccionarlos",
  className
}: BaseFileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [onUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  }, [onUpload]);

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(f => f.size <= maxSizeMB * 1024 * 1024);
    if (validFiles.length > 0) {
      onUpload(multiple ? validFiles : [validFiles[0]]);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors relative",
          isDragging ? "border-brand-primary bg-brand-subtle" : "border-border-strong hover:border-text-tertiary bg-bg-surface"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          title=""
        />
        <div className="flex flex-col items-center justify-center pointer-events-none">
          <UploadCloud className={cn("w-10 h-10 mb-4", isDragging ? "text-brand-primary" : "text-text-tertiary")} />
          <p className="text-sm font-semibold text-text-primary mb-1">{label}</p>
          <p className="text-xs text-text-secondary">{description}</p>
          <p className="text-xs text-text-tertiary mt-2">Máximo {maxSizeMB}MB {accept ? `(${accept})` : ''}</p>
        </div>
      </div>
    </div>
  );
}
